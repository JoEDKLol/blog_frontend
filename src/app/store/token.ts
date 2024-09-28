// * import libraries
import { atom } from "recoil";

export const accesstokenState = atom<string>({
    key: "accesstoken",
    default: "",
});
