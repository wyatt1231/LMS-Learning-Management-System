"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseInvalidDateTimeToDefault = exports.parseInvalidTimeToDefault = exports.parseInvalidDateToDefault = void 0;
const moment_1 = __importDefault(require("moment"));
const parseInvalidDateToDefault = (date, defaultString) => {
    const d = (0, moment_1.default)(date);
    if (d.isValid()) {
        return d.format("YYYY-MM-DD");
    }
    else {
        if (typeof defaultString === "string") {
            return defaultString;
        }
        else {
            null;
        }
    }
    return null;
};
exports.parseInvalidDateToDefault = parseInvalidDateToDefault;
const parseInvalidTimeToDefault = (date, defaultString) => {
    const d = (0, moment_1.default)(date, "hh:mm A");
    if (d.isValid()) {
        return d.format("HH:mm:ss");
    }
    else {
        if (typeof defaultString === "string") {
            return defaultString;
        }
        else {
            null;
        }
    }
    return null;
};
exports.parseInvalidTimeToDefault = parseInvalidTimeToDefault;
const parseInvalidDateTimeToDefault = (date, defaultString) => {
    const d = (0, moment_1.default)(date);
    if (d.isValid()) {
        return d.format("YYYY-MM-DD HH:mm:ss");
    }
    else {
        if (typeof defaultString === "string") {
            return defaultString;
        }
        else {
            null;
        }
    }
    return null;
};
exports.parseInvalidDateTimeToDefault = parseInvalidDateTimeToDefault;
//# sourceMappingURL=useDateParser.js.map