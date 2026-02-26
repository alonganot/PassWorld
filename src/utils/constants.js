import { encryptText } from "./crypto";

export const defaultValue = "Info is missing!";
export const emptyListString = "Your list is empty!";

export const getDefaultPassArray = (key) => [
    {
        id: 1,
        wn: emptyListString,
        un: defaultValue,
        p: key !== "empty" ? encryptText(defaultValue, key) : defaultValue,
        link: defaultValue,
    },
];

export const userLevels = [
    {
        value: "free",
        code: "null",
        description: "Free version",
        maxPasswords: 3,
        canEdit: false,
        canSearch: false,
        color: "black",
        bgColor: "gray",
    },
    {
        value: "gold",
        code: "34Nhjs3",
        description: "Gold Membership",
        maxPasswords: 10,
        canEdit: true,
        canSearch: false,
        color: "gold",
        bgColor: "rgb(148, 146, 44)",
    },
    {
        value: "platinum",
        code: "k3xnT1e",
        description: "Platinum Membership",
        maxPasswords: 9999,
        canEdit: true,
        canSearch: true,
        color: "rgb(40, 203, 224)",
        bgColor: "rgb(44, 136, 148)",
    },
];
