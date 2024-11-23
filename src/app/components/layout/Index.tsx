'use client';

import SocialLogin from "@/app/(route)/(sociallogin)/sociallogin/page";
import MainHeader from "./Header";
import MainContent from "./Main";

import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react';
import SocialLoginFail from "@/app/(route)/(sociallogin)/socialloginfail/page";
import PriHeader from "../priLayout/Header";
import PriMain from "./PriMain";
import LoadingScreen from "../loadingScreen/Index";
import { useRecoilState } from "recoil";
import { loadingBarState } from "@/app/store/loadingBar";

const LayoutIndex = ({ children }: { children: React.ReactNode }) => {
  type typeMainHome = boolean;
  let [mainHome, setMainHome] = useState<typeMainHome>(true);
  const path:any = usePathname();
  const path2:string = path.substr(0,5);
  const childRef = useRef(null);
  // const [loadingBar, setLoadingBarState] = useRecoilState(loadingBarState);
  //loading bar

  useEffect(() => {
    // console.log(path2);
    if(path === "/"){
      setMainHome(true);
    }else{
      setMainHome(false);
    }    
  }, [path]);

  return (
    <>
    {/* {children} */}
    {
      (path === "/")?
      <><LoadingScreen/><MainHeader></MainHeader><MainContent>{children}</MainContent></>
      :(path2 === "/blog")?<>
      <LoadingScreen/>
      <PriHeader></PriHeader><PriMain>{children}</PriMain>
      </>
      // :(path2 === "/blog")?<>{children}</>
      :(path === "/sociallogin")?<>{children}</>
      :(path === "/socialloginfail")?<>{children}</>
      :''
    }     
    </>)
};

export default LayoutIndex;