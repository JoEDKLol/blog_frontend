'use client';

import { usePathname } from "next/navigation";
import PriBlogListDetail from "./Main";

const Layout = (props: any) => {

  const path:any = usePathname();
  const blog_seq = path.split("/")[2];
  const seq = path.split("/")[3];
  return(
    <>  
      <PriBlogListDetail blog_seq={blog_seq} seq={seq}/>
    </>
  );
};

export default Layout