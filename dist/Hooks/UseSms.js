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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const qs_1 = __importDefault(require("qs"));
const SendSms = (to, message) => __awaiter(void 0, void 0, void 0, function* () {
    if (/^(09|\+639)\d{9}$/.test(to)) {
        const sms_response = yield (0, axios_1.default)({
            method: "post",
            url: `https://api-mapper.clicksend.com/http/v2/send.php`,
            data: qs_1.default.stringify({
                username: `markanthony.suner1993@gmail.com`,
                key: `6DE50D7D-B7F0-1596-96D2-5B8DA4CC1BFB`,
                to: to,
                message: message,
            }),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Basic 4B6BBD4D-DBD1-D7FD-7BF1-F58A909008D1`,
            },
        });
    }
});
exports.default = {
    SendSms,
};
//# sourceMappingURL=UseSms.js.map