'use client';

import PriHeader from "../priLayout/Header";
import PriMainContent from "../priLayout/Main";
import MainHeader from "./Header";
import MainContent from "./Main";

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react';

const LayoutIndex = ({ children }: { children: React.ReactNode }) => {
  type typeMainHome = boolean;
  let [mainHome, setMainHome] = useState<typeMainHome>(true);
  const path:any = usePathname();

  useEffect(() => {
    if(path === "/"){
      setMainHome(true);
    }else{
      setMainHome(false);
    }    
  }, [path]);
  return (
    <>
    {
      (mainHome)?
      <>
      {(path === "/")?
        <><MainHeader></MainHeader><MainContent>{children}</MainContent></>
        :<>
        {
          (path === "/blog" || path === "/home")?
          <><PriHeader></PriHeader><PriMainContent>{children}</PriMainContent></>:''
        }
        </>
      }
      </>:<>{children}</>
    }     
    </>)
};

export default LayoutIndex;