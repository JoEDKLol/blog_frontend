'use client';

import SocialLogin from "@/app/(route)/(sociallogin)/sociallogin/page";
import PriHeader from "../priLayout/Header";
import PriMainContent from "../priLayout/Main";
import MainHeader from "./Header";
import MainContent from "./Main";

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react';
import SocialLoginFail from "@/app/(route)/(sociallogin)/socialloginfail/page";

const LayoutIndex = ({ children }: { children: React.ReactNode }) => {
  type typeMainHome = boolean;
  let [mainHome, setMainHome] = useState<typeMainHome>(true);
  const path:any = usePathname();
  const path2:string = path.substr(0,5);

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
      (path === "/")?<><MainHeader></MainHeader><MainContent>{children}</MainContent></>
      :(path2 === "/blog")?<><PriHeader></PriHeader><PriMainContent>{children}</PriMainContent></>
      :(path === "/sociallogin")?<>{children}</>
      :(path === "/socialloginfail")?<>{children}</>
      :''
    }     
    </>)
};

export default LayoutIndex;