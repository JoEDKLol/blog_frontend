// * import libraries
import { atom } from "recoil";

interface user {
    id:string,
    email:string,
    blog_seq:string
}

export const userState = atom<user>({
    key: "user",
    default: {id:"", email:"", blog_seq:""},
});
