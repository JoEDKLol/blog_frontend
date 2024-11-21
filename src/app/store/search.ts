// * import libraries
import { atom } from "recoil";

interface searchResArr {
    user_id:string,
    blog_seq:string,
    seq:string,
    m_category_id:string,
    s_category_id:string,
    title:string,
    pic:string,
    temp_num:string,
    content:string,
    public:string,
    hashtag:string,
    commentscnt:Number,
    likecnt:Number
    deleteyn:string,
    regdate:string,
    reguser:string,
    upddate:string,
    upduser:string,
}

export const searchResArrState = atom<searchResArr[]>({
    key: "searchRes",
    default: [],
});
