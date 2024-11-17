// * import libraries
import { atom } from "recoil";

interface searchKeyword {
    keyword:string,
    currentPage:number,
    searchYn:boolean,
}

export const searchKeywordState = atom<searchKeyword>({
    key: "searchKeyword",
    default: {keyword:"", currentPage:1, searchYn:true},
});
