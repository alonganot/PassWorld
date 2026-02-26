import React, { createContext, useState, useEffect } from 'react';
import { getStoredPasswords, savePasswords, getStoredUserLevel, saveUserLevel, isFirstTimeLogin } from '../utils/storage';
import { encryptText, decryptText } from '../utils/crypto';
import { getDefaultPassArray, userLevels, emptyListString, defaultValue } from '../utils/constants';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [key, setKey] = useState("empty");
    const [passwords, setPasswords] = useState([]);
    const [userLevel, setUserLevel] = useState("null");
    const [isFirstLogin, setIsFirstLogin] = useState(false);
    const [isPasscodeModalOpen, setIsPasscodeModalOpen] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        setIsFirstLogin(isFirstTimeLogin());
    }, []);

    const initData = (passcode) => {
        const storedUl = getStoredUserLevel();
        if (!storedUl) {
            // First time login
            const encryptedLevel = encryptText("null", passcode);
            saveUserLevel(encryptedLevel);
            setUserLevel("null");
            setKey(passcode);
            const freshPasswords = getStoredPasswords(passcode);
            setPasswords(freshPasswords);
            setIsPasscodeModalOpen(false);
            return true;
        } else {
            // Validate passcode by trying to decrypt user level
            const decryptedUl = decryptText(storedUl, passcode);
            if (decryptedUl) { // Truthy means decryption was successful with this passcode
                setUserLevel(decryptedUl);
                setKey(passcode);
                const freshPasswords = getStoredPasswords(passcode);
                setPasswords(freshPasswords);
                setIsPasscodeModalOpen(false);
                return true;
            } else {
                return false; // Wrong passcode
            }
        }
    };

    const handleSetPasscode = (passcode) => {
        if (!passcode) return false;
        return initData(passcode);
    };

    const canEdit = () => {
        const levelObj = userLevels.find(l => l.code === userLevel);
        return levelObj ? levelObj.canEdit : false;
    };

    const canSearch = () => {
        const levelObj = userLevels.find(l => l.code === userLevel);
        return levelObj ? levelObj.canSearch : false;
    };

    const hasPassedMaxPasswords = () => {
        const levelObj = userLevels.find(l => l.code === userLevel);
        const maxPass = levelObj ? levelObj.maxPasswords : 3;
        return passwords.length >= maxPass;
    };

    const upgradeUser = (newLevelValue) => {
        const levelObj = userLevels.find(l => l.value === newLevelValue);
        if (levelObj) {
            const encryptedLevel = encryptText(levelObj.code, key);
            saveUserLevel(encryptedLevel);
            setUserLevel(levelObj.code);
        }
    };

    const addPassword = (site, user, pass, link) => {
        let currPasswords = [...passwords];
        if (currPasswords.length > 0 && currPasswords[0].wn === emptyListString) {
            currPasswords = [];
        }

        const newId = currPasswords.length + 1 + Math.random();
        const newPassObj = {
            id: newId,
            wn: site,
            un: encryptText(user || defaultValue, key),
            p: encryptText(pass || defaultValue, key),
            link: link || defaultValue,
        };

        currPasswords.push(newPassObj);
        setPasswords(currPasswords);
        savePasswords(currPasswords);
    };

    const deletePassword = (id) => {
        let currPasswords = passwords.filter(p => p.id !== id);
        if (currPasswords.length === 0) {
            currPasswords = getDefaultPassArray(key);
        }
        setPasswords(currPasswords);
        savePasswords(currPasswords);
    };

    const editPassword = (id, site, user, pass, link) => {
        const newPasswords = passwords.map(p => {
            if (p.id === id) {
                return {
                    id: p.id,
                    wn: site,
                    un: encryptText(user, key),
                    p: encryptText(pass, key),
                    link: link,
                }
            }
            return p;
        });
        setPasswords(newPasswords);
        savePasswords(newPasswords);
    };

    return (
        <AppContext.Provider value={{
            key, isFirstLogin,
            passwords, setPasswords,
            userLevel,
            searchQuery, setSearchQuery,
            handleSetPasscode,
            isPasscodeModalOpen, setIsPasscodeModalOpen,
            canEdit, canSearch, hasPassedMaxPasswords,
            addPassword, deletePassword, editPassword,
            upgradeUser
        }}>
            {children}
        </AppContext.Provider>
    )
};
