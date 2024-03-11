'use client';

import PriHeader from "../priLayout/Header";
import PriMainContent from "../priLayout/Main";
import MainHeader from "./Header";
import MainContent from "./Main";

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react';

const LayoutIndex = ({ children }: { children: React.ReactNode }) => {
  let [mainHome, setMainHome] = useState(true);
  const router = usePathname();

  useEffect(() => {
    if(router === "/"){
      setMainHome(true);
    }else{
      setMainHome(false);
    }    
  }, []);
  return (
    <>
    {
      (mainHome)?
      <>
      <MainHeader></MainHeader><MainContent>{children}</MainContent>
      </>
      :
      <>
      <PriHeader></PriHeader>
      <PriMainContent>{children}</PriMainContent>
      </>
    }     
    </>)
};

export default LayoutIndex;