import Layout from "./components/Layout";


const BlogBoards = ({ children }: { children: React.ReactNode }) => {
    
    return(
    <>  
      <Layout />{children}
    </>
    );
};

export default BlogBoards