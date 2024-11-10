import Layout from "./components/Layout";


const BlogBoards = ({ children }: { children: React.ReactNode }) => {
    console.log("testsetsetsetswetset");
    
    return(
    <>  
      <Layout />{children}
    </>
    );
};

export default BlogBoards