// * import libraries
import { atom } from "recoil";

export const errorPageState = atom<boolean>({
    key: "errorPage",
    default: false
});
