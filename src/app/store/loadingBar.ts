// * import libraries
import { atom } from "recoil";

export const loadingBarState = atom<boolean>({
    key: "lodingBar",
    default: false
});
