// * import libraries
import { atom } from "recoil";

interface priSearchKeyword {
    blog_seq:string,
    keyword:string,
    majorSeq:number,
    subSeq:number,
    currentPage:number
    searchYn:boolean
}

export const priSearchKeywordState = atom<priSearchKeyword>({
    key: "priSearchKeyword",
    default: {blog_seq:"", keyword:"", majorSeq:-1, subSeq:-1, currentPage:1, searchYn:true},
});
