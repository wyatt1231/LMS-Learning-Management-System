"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorMessage = void 0;
const default_error_message = `External server error has occured. Please contact the administrator for assistance`;
const ErrorMessage = (error) => {
    if (error) {
        if ((error === null || error === void 0 ? void 0 : error.sqlMessage) && typeof (error === null || error === void 0 ? void 0 : error.sqlMessage) === "string") {
            return error === null || error === void 0 ? void 0 : error.sqlMessage;
        }
        if (typeof error === "string") {
            return error;
        }
    }
    return default_error_message;
};
exports.ErrorMessage = ErrorMessage;
//# sourceMappingURL=useErrorMessage.js.map