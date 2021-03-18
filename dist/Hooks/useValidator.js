"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidPicture = void 0;
const isValidPicture = (picture) => {
    if (typeof picture !== "undefined" && picture !== "" && picture !== null) {
        return true;
    }
    else {
        return false;
    }
};
exports.isValidPicture = isValidPicture;
//# sourceMappingURL=useValidator.js.map