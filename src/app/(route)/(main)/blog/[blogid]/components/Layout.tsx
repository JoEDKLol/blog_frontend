'use client';

import { usePathname } from "next/navigation";
import PriMain from "./Main";

const Layout = (props: any) => {

  const path:any = usePathname();
  const blog_seq = path.split("/")[2];

  return(
    <>  
      <PriMain blog_seq={blog_seq}/>
    </>
  );
};

export default Layout