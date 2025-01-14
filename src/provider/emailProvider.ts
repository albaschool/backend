import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAILER_MAIL,
    pass: process.env.MAIL_PASSWORD,
  },
  //서명받지 않은 사이트의 요청도 받음
  tls: {
    rejectUnauthorized: false,
  },
});
const getMailOptions = (verificationNumber: string, email: string) => {
  const mailContent = `<h1 style='text-align : center;'> [알바스쿨] 인증메일</h1>
                       <h3 style='text-align : center;'> 인증코드 ${verificationNumber}</h3>`;
  const mailOptions: nodemailer.SendMailOptions = {
    from: process.env.MAILER_MAIL,
    to: email,
    subject: "알바스쿨 회원가입 이메일 인증",
    html: mailContent,
  };
  return mailOptions;
};

export { getMailOptions, transport };
