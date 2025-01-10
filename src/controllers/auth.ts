import { Request, Response } from "express";

import { db } from "@/db";

import {getMailOptions,transport} from "../provider/emailProvider";

const email = (req: Request, res: Response) => {
    const body = req.body;
    const verificationNumber = Math.random().toString().slice(2, 6);
    const mailOptions = getMailOptions(verificationNumber, body.email);

    transport.sendMail(mailOptions, async (err, info)=>{
        if(err){
            console.error("Failed to send mail" + err);
            res.status(400).json({
                message : "Mail send failed."
            })
        }
        else{
            console.log('success to send mail');
            const result = await db.insertInto('verification')
            .values({
                code : verificationNumber,
                email : body.email,
            }).executeTakeFirst();
            console.log(result , info);
            res.status(201).json({
                message: "Hello World!",
              });
        }
        
    })

};
const emailVerify = async (req : Request, res: Response) =>{
    res.status(201).json({
        "S" : "sss",
    });
}

export { email, emailVerify};