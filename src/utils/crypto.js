import CryptoJS from "crypto-js";

export const encryptText = (text, key) => {
    if (!text) return "";
    return CryptoJS.AES.encrypt(text, key).toString();
};

export const decryptText = (text, key) => {
    if (!text) return "";
    try {
        const decrypted = CryptoJS.AES.decrypt(text, key);
        return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (e) {
        return "";
    }
};
