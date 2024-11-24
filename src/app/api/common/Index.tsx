"use client";

import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { accesstokenState } from "@/app/store/token";
import { useRouter,usePathname } from "next/navigation";
import { transaction } from "@/app/utils/axios";
import { userState } from "@/app/store/user";
import { transactionAuth } from "@/app/utils/axiosAuth";
import { getAccessToken, storeAccessToken } from "@/app/utils/common";
import { loadingBarState } from "@/app/store/loadingBar";
/*
    모든페이지에서 호출되는 공통 페이지
*/
const CommonTransaction = ({ children }: any) => {

    const [initializing, setInitializing] = useState(false);    
    
    const [user, setUser] = useRecoilState<any>(userState);
    const path:any = usePathname();
    const router = useRouter();
    const [loadingBar, setLoadingBarState] = useRecoilState(loadingBarState);

    //페이지이동감지
    // console.log("토큰검증");
    useEffect(() => {
        setInitializing(false);
        // console.log("여기 확인 됨??");
        if(!getAccessToken()){
            getAccessTokenApi();
            // console.log(retObj);
        }else{
            //토큰검증
            // console.log("토큰검증");
            getAccessTokenCheck();
            // transactionAuth("get", "checkaccessToken", {}, "");

        }

        setInitializing(true);

    }, [path]);
    
    async function getAccessTokenApi(){
        const retObj = await transaction("get", "getAccessToken", {}, "", false, true, setLoadingBarState);
        if(retObj.sendObj.code === "2000"){
            
            //유저정보는 리코일에
            //access토큰 정보는 session storege클래스에 담아준다.
            storeAccessToken(retObj.accessToken);
            setUser(retObj.sendObj.resObj);
        }else{
            //access token get 실패
            //로그인 필요함.
            setUser({id:"",  email:"", blog_seq:""});
        }
    }

    async function getAccessTokenCheck(){
        
        const retObj = await transactionAuth("post", "checkaccessToken", {}, "", false, true, setLoadingBarState);
        
        if(retObj.sendObj.success){
            setUser(retObj.sendObj.resObj);
        }else{
            getAccessTokenApi();
        }
    }

    // useEffect(() => {
    //     // console.log("페이지 이동시 체크 됨??");
    //     // setInitializing(true);
    //     //페이지 이동 시 토큰 검증 처리
    //     /*
    //         권한 확인
    //     */
    // }, [initializing])

    return <>{children}</>;
    // if (initializing) {
    //     return <>{children}</>;
        
    // } else {
    //     return (
    //         <>
    //         {/* <div className='w-screen h-screen flex items-center justify-center text-2xl font-bold'>
    //              checking authorize...
    //         </div> */}
    //         </>
    //     );
    // }

};

export default CommonTransaction;