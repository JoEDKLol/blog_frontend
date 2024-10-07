'use client';

import MainContent from "../components/Main";
import { usePathname } from "next/navigation";

const Layout = (props: any) => {

  const path:any = usePathname();
  const blog_seq = path.split("/")[2];

  return(
    <>  
      <MainContent blog_seq={blog_seq}/>
    </>
  );
};

export default Layout