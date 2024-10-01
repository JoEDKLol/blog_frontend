'use client';

import { transaction } from "@/app/utils/axios";
import { useCallback, useEffect, useRef, useState } from "react";
// import { useObserver } from "../../utils/useObserver"



// import { Button } from 'primereact/button';
const MainContent = ({ children }: { children: React.ReactNode }) => {
  const loaderRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [blogList,setblogList] = useState<any>([]);
  // const [currentPage,setCurrentPage] = useState<any>(0);
  
  
  let currentPage = 0;
  let searchYn = true;
  let blogListDB:any = [];
 
  

  async function getBlogLists(cPage:any){
    // console.log("page:",cPage);
    let obj = {
      currentPage:cPage

    }
    const bloglistObj = await transaction("get", "blog/bloglist", obj, "", false);
    
    if(bloglistObj.sendObj.resObj.list.length > 0){
      blogListDB = blogListDB.concat(bloglistObj.sendObj.resObj.list)
      setblogList([...blogListDB]); 
    }else{
      //다음 조회건수가 없을 경우 처리해야 됨.
      searchYn = false; 
    }
  }

  const observerEl = useRef<HTMLDivElement>(null);
  const handleObserver = useCallback(   
    
    (entries: IntersectionObserverEntry[]) => {
        const target = entries[0];
        // if (target.isIntersecting && pagination?.hasNextPage) {
        //     pagination.gotoPage(pagination.current + 1);
        // }
        if(target.isIntersecting){ //스크롤이 가장 밑에 닿았을경우   
          /*
          1. 다음 페이지가 있을경우 back 에서 전달하도록 처리
          */ 
          if(searchYn === true){
            currentPage = currentPage+1;
            getBlogLists(currentPage);
          }
        }
         
    },
    []
  );

  useEffect(() => {
      const observer = new IntersectionObserver(handleObserver, { threshold: 0 });
      const currentEl = observerEl.current;
      if (currentEl) {
          observer.observe(currentEl);
      }
      return () => {
          if (currentEl) {
              observer.unobserve(currentEl);
          }
      };
  }, [handleObserver]);

  function test(obj:any){
    console.log(obj);
  }

  return(
    <>
      <div className="flex justify-center" >
        <div className="2xl:columns-3 xl:columns-3 lg:columns-2 md:columns-2 sm:columns-1 columns-1 w-3/4 " >
          
          {
            blogList.map((item:any, index:any)=>{
              return (

                <div key={index} className="group flex justify-center pt-3 h-96 "
                onClick={()=>test(item)}
                >
                  <div className="max-w-sm rounded overflow-hidden shadow-lg hover:bg-[#eaedee]">
                    <div className="px-6 pt-4 pb-2">
                      <div className="font-bold text-xl mb-2 truncate w-96">{item.title}</div>
                      <p className="text-gray-700 text-base h-72 text-ellipsis overflow-hidden">
                        {item.content}
                      </p>
                    </div>
                    <div className="px-6 h-8 pb-2">
                      <div>{item.regdate}</div>
                    </div>
                  </div>
                </div>
              )
            })
          }
          
        </div>
      </div>
      <div ref={observerEl} className="h-1"/>
      {/* <div ref={bottom} /> */}
    </>
  )
};
export default MainContent;