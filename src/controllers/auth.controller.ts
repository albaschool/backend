import { Request, Response } from "express";

import { db } from "@/db";
import { saveCode, verifyEmail } from "@/services/auth.service";

import {getMailOptions,transport} from "../provider/emailProvider";


// POST /auth/email
const email = (req: Request, res: Response) => {
    const body = req.body;
    const code = Math.random().toString().slice(2, 8);
    const mailOptions = getMailOptions(code, body.email);

    transport.sendMail(mailOptions, async (err, info)=>{
        if(err){
            console.error("Failed to send mail" + err);
            res.status(500).json({
                message : "Mail send failed."
            })
        }
        else{
            console.log('success to send mail');
            const result = await saveCode(body.email, code);
            console.log(result , info);
            res.status(201).json({
                message: "메일이 성공적으로 전송됐습니다.",
              });
        }
        
    })

};

//
const emailVerify = async (req : Request, res: Response) =>{
    const body = req.body;
    try {
        const isverified = await verifyEmail(body.email, body.code);
        if (!isverified) {
            res.status(404).json({
            message : "이메일이 올바르지 않습니다.",
        });
        }
        else{
            res.status(200).json({
                message  : "인증이 완료 됐습니다.",
            });
    }} catch {
            res.status(500).json({ message: "Internal server error" });
    }
}


const registUser = async ( req: Request, res : Response)=>{
    try {
        const body = req.body;
        const result = await registUser(body);
        res.status(201).json({
            message : "회원가입이 완료됐습니다."
        })
    } catch {
        res.status(500).json({ message: "Internal server error" });
    }
    
}


export { email, emailVerify, registUser}