"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailVerify = exports.email = void 0;
const db_1 = require("../db");
const emailProvider_1 = require("../provider/emailProvider");
const email = (req, res) => {
    const body = req.body;
    const verificationNumber = Math.random().toString().slice(2, 6);
    const mailOptions = (0, emailProvider_1.getMailOptions)(verificationNumber, body.email);
    emailProvider_1.transport.sendMail(mailOptions, (err, info) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            console.error("Failed to send mail" + err);
            res.status(400).json({
                message: "Mail send failed."
            });
        }
        else {
            console.log('success to send mail');
            const result = yield db_1.db.insertInto('verification')
                .values({
                code: verificationNumber,
                email: body.email,
            }).executeTakeFirst();
            console.log(result, info);
            res.status(201).json({
                message: "Hello World!",
            });
        }
    }));
};
exports.email = email;
const emailVerify = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const result = yield db_1.db.selectFrom("verification")
        .where((eb) => eb.and({
        code: body.code,
        email: body.email,
    })).selectAll().executeTakeFirst();
    console.log(result);
    res.status(201).json({
        "S": "sss",
    });
});
exports.emailVerify = emailVerify;
