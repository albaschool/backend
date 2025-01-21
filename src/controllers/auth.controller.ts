import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import config from "@/config";
import HttpException from "@/interfaces/http-exception.interface";
import logger from "@/logger";
import { getMailOptions, transport } from "@/providers/email.provider";
import { checkPassword, isUser, saveCode, saveUser, updatePassword, verifyEmail } from "@/services/auth.service";
import { createHashedPassword, createSalt } from "@/utils/password";

// POST /auth/email
const email = (req: Request, res: Response) => {
  const body = req.body;
  const code = Math.random().toString().slice(2, 8);
  const mailOptions = getMailOptions(code, body.email);

  transport.sendMail(mailOptions, async (err: Error | null) => {
    if (err) {
      console.error("Failed to send mail" + err);
      res.status(500).json({
        message: "Mail send failed.",
      });
    } else {
      logger.info("success to send mail");
      await saveCode(body.email, code);
      res.status(201).json({
        message: "메일이 성공적으로 전송됐습니다.",
      });
    }
  });
};

//
const emailVerify = async (req: Request, res: Response) => {
  const body = req.body;
  const isVerified = await verifyEmail(body.email, body.code);
  if (!isVerified) {
    throw new HttpException(404, "인증번호를 확인해 주세요");
  }

  res.status(200).json({
    message: "인증이 완료 됐습니다.",
  });
};

const regist = async (req: Request, res: Response) => {
  const body = req.body;

  const salt = await createSalt();
  const hashedPassword = await createHashedPassword(body.password, salt);

  const result = await saveUser({
    ...body,
    password: hashedPassword,
    salt,
  });
  if ((result.numInsertedOrUpdatedRows ?? 0) === 0) {
    throw new Error("Failed to regist user");
  }

  res.status(201).json({
    message: "회원가입이 완료됐습니다.",
  });
};

const login = async (req: Request, res: Response) => {
  const body = req.body;
  const user = await isUser(body.email, body.password);

  if (!user) {
    throw new HttpException(404, "아이디 또는 비밀번호가 일치하지 않습니다.");
  }

  const token = jwt.sign(
    {
      id: user.id,
      name: user.name,
      role: user.role,
    },
    config.jwt.secretKey,
  );
  logger.debug(`JWT Token: ${token}`);

  res.cookie("Authorization", token, {
    httpOnly: true,
  });

  res.status(200).json({
    message: "로그인이 완료됐습니다.",
    token: token,
  });
};

const fixPassword = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const result = await updatePassword(body.password, req.auth!.id);
    if (result.numUpdatedRows.toString() === "0n") throw new Error();
    res.status(200).json({ message: "비밀번호 변경이 완료됐습니다." });
  } catch {
    throw new HttpException(401, "토큰이 만료 됐습니다.");
  }
};

const checkUserPassword = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const result = checkPassword(body.password, body.id);
    if (!result) throw new Error();
    else res.status(200).json({ message: "비밀번호 확인이 완료됐습니다." });
  } catch {
    throw new HttpException(401, "토큰이 만료 됐습니다.");
  }
};

export { checkUserPassword, email, emailVerify, fixPassword, login, regist };
