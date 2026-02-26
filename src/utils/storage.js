import { getDefaultPassArray } from "./constants";

export const getStoredPasswords = (key = "empty") => {
    const stored = localStorage.getItem("pws");
    if (!stored || stored.length <= 2) { // 2 handles empty array '[]' maybe
        const defaults = getDefaultPassArray(key);
        localStorage.setItem("pws", JSON.stringify(defaults));
        return defaults;
    }
    return JSON.parse(stored);
};

export const savePasswords = (passwords) => {
    localStorage.setItem("pws", JSON.stringify(passwords));
};

export const getStoredUserLevel = () => {
    return localStorage.getItem("ul");
};

export const saveUserLevel = (levelCode, key) => {
    // Original logic actually encrypted user level code: CryptoJS.AES.encrypt(levelCode, key)
    // Let's implement that in AppContext, but store it raw/encrypted via generic storage.
    localStorage.setItem("ul", levelCode);
};

export const isFirstTimeLogin = () => {
    return !localStorage.getItem("ul");
};
