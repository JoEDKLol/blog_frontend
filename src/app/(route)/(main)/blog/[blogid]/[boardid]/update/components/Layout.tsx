'use client';

import MainContent from "../components/Main";
import { usePathname } from "next/navigation";

const Layout = (props: any) => {

  const path:any = usePathname();
  const blog_seq = path.split("/")[2];
  const seq = path.split("/")[3];

  return(
    <>  
      <MainContent blog_seq={blog_seq} seq={seq}/>
    </>
  );
};

export default Layout