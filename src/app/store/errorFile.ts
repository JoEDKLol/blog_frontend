// * import libraries
import { atom } from "recoil";

interface errorPage {
    screenYn:boolean,
    contents:string,
}
export const errorFilePageState = atom<errorPage>({
    key: "errorPageFile",
    default: {screenYn:false, contents:""}
});
