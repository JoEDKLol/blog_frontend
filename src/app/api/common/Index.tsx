"use client";

import { useEffect, useState } from "react";
/*
    모든페이지에서 호출되는 공통 페이지
*/
const CommonTransaction = ({ children }: any) => {

    const [initializing, setInitializing] = useState(false);    
    useEffect(() => {

        setInitializing(true);
        //공통 거래 성공시 true 변경
        /*
            권한 확인
        */

    }, [initializing])

    if (initializing) {
        return <div>{children}</div>;
        
    } else {
        return (
            <div className='w-screen h-screen flex items-center justify-center text-2xl font-bold'>
                로딩중...
            </div>
        );
    }

};

export default CommonTransaction;