// * import libraries
import { atom } from "recoil";

interface user {
    id:string,
    email:string,
    name:string
}

export const userState = atom<user>({
    key: "user",
    default: {id:"", email:"", name:""},
});
