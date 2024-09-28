'use client';
import { useRecoilState, useRecoilValue } from "recoil";
import { accesstokenState } from "../store/token";

const setAccesstoken = (token:string) => {
    console.log("여기 온다");
    const [accesstokenRecoil, setAccesstokenRecoil] = useRecoilState<string>(accesstokenState);
    // recoil에 accesstoken 셋팅 (resp.headers.accesstoken)
    setAccesstokenRecoil(token);
}

const getAccesstoken = () => {
    // const [accesstokenRecoil, setAccesstokenRecoil] = useRecoilState<string>(accesstokenState);
    let test = useRecoilValue(accesstokenState);
    console.log("여기:", test);
    
    return "test";
}

export  {setAccesstoken, getAccesstoken}