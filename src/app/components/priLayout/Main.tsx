'use client';
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react';

const PriMainContent = ({ children }: { children: React.ReactNode }) => {


    // console.log(router);
    // alert(1);
    


    return(
      <>
        {children}
      </>
    )
};
export default PriMainContent;