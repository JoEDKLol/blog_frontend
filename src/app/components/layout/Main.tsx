'use client';

import { transaction } from "@/app/utils/axios";
import { useCallback, useEffect, useRef, useState } from "react";
// import { useObserver } from "../../utils/useObserver"



// import { Button } from 'primereact/button';
const MainContent = ({ children }: { children: React.ReactNode }) => {
  const loaderRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [blogList,setblogList] = useState<any>([]);
  useEffect(()=>{
    
    getBlogLists();
    
  }, [])

  async function getBlogLists(){
    let obj = {
      currentPage:1

    }
    const bloglistObj = await transaction("get", "blog/bloglist", obj, "", false);
    // console.log(bloglistObj.sendObj.resObj);
    setblogList(bloglistObj.sendObj.resObj);
  }
  // const { pagination, resData } = useMap();

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
          console.log("test");
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


  return(
    <>
      <div className="flex justify-center" >
        <div className="2xl:columns-3 xl:columns-3 lg:columns-2 md:columns-2 sm:columns-1 columns-1 w-3/4 " >
          
          {
            blogList.map((item:any, index:any)=>{
              return (

                <div key={index} className="group flex justify-center pt-1 h-64 ">
                  <div className="max-w-sm rounded overflow-hidden shadow-lg hover:bg-[#eaedee]">
                    <div className="px-6 pt-4 pb-2">
                      <div className="font-bold text-xl mb-2 truncate w-64">{item.title}</div>
                      <p className="text-gray-700 text-base h-40 text-ellipsis overflow-hidden">
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