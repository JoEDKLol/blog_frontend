'use client';

import { transaction } from "@/app/utils/axios";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";




const MainContent = ({ children }: { children: React.ReactNode }) => {
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
      setblogList(blogListDB); 
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

  return(
    <>
      <div className="px-60 grid place-items-center grid-cols-1 2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1
                    lg:px-20 md:px-20 z-1 
      " >
        {
        blogList.map((item:any, index:any)=>{
          return (
            
              <Link key={index} href={"/blog/"+item.blog_seq + "/" + item.seq}>
              <div className="">
                <div  className="rounded-lg overflow-hidden shadow-lg hover:bg-[#eaedee] p-2 mt-5 h-[400px] w-[300px]">
                  <div className="">
                      <div className='ring-1 ring-gray-300 rounded-xl h-32 relative' >
                          <Image 
                          src={item.pic}
                          quality={30}
                          layout="fill"
                          style={{ objectFit: "cover" , borderRadius: '8px' }}
                          alt='' />
                      </div>
                  </div> 
                  <div className=""><p className=" text-xs my-4 ">{item.regdate}</p></div>
                  <div className="">
                    <div className="font-bold text-xl mb-2 truncate">{item.title}</div>
                    
                    <div className=" m-1 h-[120px] my-4 break-all line-clamp-5">
                      {item.content.replace(/(<([^>]+)>)/gi, '').replace(/&nbsp;/gi, ' ')}
                    </div>
                  </div>
                  <div className="">태그</div>
                </div>
              </div>  
              </Link>  
             
          )
        })
        }
        

        {/* <div className="2xl:columns-3 xl:columns-3 lg:columns-2 md:columns-2 sm:columns-1 columns-1 w-3/4 " >
          
          {
            blogList.map((item:any, index:any)=>{
              return (
                <Link key={index} href={"blog/"+item.title}>
                <div className="group flex justify-center pt-3 h-[500px] ">
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
                </Link>
              )
            })
          }
          
        </div> */}
      
      </div>
      <div ref={observerEl} className="h-1"/>
      {/* <div ref={bottom} /> */}
    </>
  )
};
export default MainContent;