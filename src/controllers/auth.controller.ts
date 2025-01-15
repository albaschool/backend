import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import logger from "@/logger";
import { checkPassword, isUser, saveCode, saveUser, updatePassword, verifyEmail } from "@/services/auth.service";

import { getMailOptions, transport } from "../provider/emailProvider";

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
  try {
    const isverified = await verifyEmail(body.email, body.code);
    if (!isverified) {
      res.status(404).json({
        message: "인증번호를 확인해 주세요",
      });
    } else {
      res.status(200).json({
        message: "인증이 완료 됐습니다.",
      });
    }

  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};

const regist = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const result = await saveUser(body);
    if ((result.numInsertedOrUpdatedRows ?? 0) === 0) {
      throw new Error("Failed to regist user");
    } else
      res.status(201).json({
        message: "회원가입이 완료됐습니다.",
      });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};


const login = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const user = await isUser(body.email, body.password);
    if (user !== undefined) {
      const SECRETKEY = process.env.JWT_SECRET_KEY || "";
      const token = jwt.sign(
        {
          id: user.id,
          name: user.name,
          role: user.role,
        },
        SECRETKEY,
        {
          expiresIn: "1000000000m",
          issuer: "andev",
        },
      );
      res.cookie("Authorization", token, {
        httpOnly: true,
      });
      console.log(token);
      res.status(200).json({
        message: "로그인이 완료됐습니다.",
      });
    } else {
      res.status(404).json({
        message: "아이디 또는 비밀번호가 일치하지 않습니다.",
      });
    }
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};

const fixPassword = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    console.log(body);
    const result = await updatePassword(body.password, req.auth!.id);

    if (result.numUpdatedRows.toString() === "0n") res.status(500).json({ message: "Internal sercer error." });
    else res.status(200).json({ message: "비밀번호 변경이 완료됐습니다." });
  } catch {
    res.status(401).json({
      message: "토큰이 만료 됐습니다.",
    });
  }
};

const checkUserPassword = async (req: Request, res: Response) => {
  try {
    const body = req.body;

    const result = checkPassword(body.password, body.id);
    if (!result) res.status(500).json({ message: "Internal sercer error." });
    else res.status(200).json({ message: "비밀번호 확인이 완료됐습니다." });
  } catch {
    res.status(401).json({
      message: "토큰이 만료 됐습니다.",
    });
  }
};
export { checkUserPassword, email, emailVerify, fixPassword, login, regist };
