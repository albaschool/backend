"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transport = exports.getMailOptions = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const transport = nodemailer_1.default.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.MAILER_MAIL,
        pass: process.env.MAIL_PASSWORD,
    },
    //서명받지 않은 사이트의 요청도 받음
    tls: {
        rejectUnauthorized: false,
    }
});
exports.transport = transport;
const getMailOptions = (verificationNumber, email) => {
    const mailContent = `<h1 style='text-align : center;'> [알바스쿨] 인증메일</h1>
                       <h3 style='text-align : center;'> 인증코드 ${verificationNumber}</h3>`;
    const mailOptions = {
        from: process.env.MAILER_MAIL,
        to: email,
        subject: "알바스쿨 회원가입 이메일 인증",
        html: mailContent
    };
    return mailOptions;
};
exports.getMailOptions = getMailOptions;
