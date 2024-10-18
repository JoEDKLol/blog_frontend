'use client';

// import MainContent from "../components/Main";
import { usePathname } from "next/navigation";
import PriBlogUpdate from "./Main";

const Layout = (props: any) => {

  const path:any = usePathname();
  const blog_seq = path.split("/")[2];

  return(
    <>  
      <PriBlogUpdate blog_seq={blog_seq}></PriBlogUpdate>
    </>
  );
};

export default Layout