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
exports.UploadFile = exports.GetUploadedImage = exports.UploadImage = void 0;
const fs_1 = __importDefault(require("fs"));
const moment_1 = __importDefault(require("moment"));
const UploadImage = ({ base_url, file_name, extension, file_to_upload, }) => {
    const extended_file_name = `${file_name}-${(0, moment_1.default)(new Date()).format("x")}.${extension}`;
    return new Promise((resolve, reject) => {
        if (!fs_1.default.existsSync(base_url)) {
            fs_1.default.mkdirSync(base_url, { recursive: true });
        }
        fs_1.default.writeFile(base_url + extended_file_name, file_to_upload, "base64", function (err) {
            if (err) {
                resolve({
                    success: false,
                    message: err.message,
                });
            }
            else {
                resolve({
                    success: true,
                    data: base_url + extended_file_name,
                });
            }
        });
    });
};
exports.UploadImage = UploadImage;
const GetUploadedImage = (url) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof url === "string") {
        try {
            const file = yield fs_1.default.promises.readFile(url, { encoding: "base64" });
            return file;
        }
        catch (error) {
            return null;
        }
    }
    return null;
});
exports.GetUploadedImage = GetUploadedImage;
const UploadFile = (base_url, file_to_upload) => {
    return new Promise((resolve, reject) => {
        if (!fs_1.default.existsSync(base_url)) {
            fs_1.default.mkdirSync(base_url, { recursive: true });
        }
        const file_name = (0, moment_1.default)(new Date()).format("x") + file_to_upload.name;
        fs_1.default.writeFile("./" + base_url + file_name, file_to_upload.data, function (err) {
            if (err) {
                resolve({
                    success: false,
                    message: err.message,
                });
            }
            else {
                resolve({
                    success: true,
                    data: base_url + file_name,
                });
            }
        });
    });
};
exports.UploadFile = UploadFile;
//# sourceMappingURL=useFileUploader.js.map