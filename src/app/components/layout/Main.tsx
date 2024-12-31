'use client';

import { searchResArrState } from "@/app/store/search";
import { searchKeywordState } from "@/app/store/searchkeyword";
import { transaction } from "@/app/utils/axios";
import { getDate } from "@/app/utils/common";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { BiHomeAlt2 } from "react-icons/bi";
import { useRecoilState } from "recoil";
import { TiDocumentText } from "react-icons/ti";
import { BiLike } from "react-icons/bi"; //<BiLike />
import { BiSolidLike } from "react-icons/bi"; //<BiSolidLike />
import { loadingBarState } from "@/app/store/loadingBar";
import { errorPageState } from "@/app/store/error";

let keywordG = "";
let searchYnG = true;
let currentPage = 0;

let blogListDB = [] as any;

const MainContent = ({ children }: { children: React.ReactNode }) => {
  const [blogList,setblogList] = useState<any>([]);
  // const [currentPage,setCurrentPage] = useState<any>(0);
  const [searchRes, setSearchRes] = useRecoilState(searchResArrState);
  const [searchKeyword, setSearchKeyword] = useRecoilState(searchKeywordState);
  
  const path:any = usePathname();
  const blog_seq = path.split("/")[2];

  const searchParams = useSearchParams()
  const search = searchParams.get('refresh')
  const [loadingBar, setLoadingBarState] = useRecoilState(loadingBarState);
  const [errorPage, setErrorPage] = useRecoilState(errorPageState);
  // let currentPage = 0;
  // let searchYn = true;
  // let blogListDB:any = [];
 
  useEffect(()=>{
    keywordG = searchKeyword.keyword;
    currentPage = searchKeyword.currentPage;
  
	},[searchKeyword]);

  useEffect(()=>{
    blogListDB = searchRes;
	},[searchRes]);

  useEffect(() => {
    if(search === "refresh"){
      getBlogLists(1, "");
    }
  }, [searchParams]);

  async function getBlogLists(cPage:any, keyword:any){
    // console.log("currentPage:::", currentPage);
    // console.log("page:",cPage, "keyword:", keyword);
    currentPage = cPage;
    let obj = { 
      currentPage:cPage,
      keyword:keyword,
      searchYn:false
    }
    
    
    // console.log("조회전:::", currentPage);
    const bloglistObj = await transaction("get", "blog/bloglist", obj, "", false, true, setLoadingBarState, setErrorPage);
    // console.log("중간:::", currentPage);
    if(bloglistObj.sendObj.success === 'y'){
      if(cPage > 1){
        // console.log("최초에는 안옴");
        if(bloglistObj.sendObj.resObj.list.length > 0){
          setSearchRes(blogListDB.concat(bloglistObj.sendObj.resObj.list)); 
          currentPage++;
          setSearchKeyword({...searchKeyword, currentPage});
          
        }else{
          //다음 조회건수가 없을 경우 처리해야 됨.
          // console.log("다음 조회건수가 없을 경우 처리해야 됨");
          // console.log("여기는 아니지?");
          // currentPage--;
        }
      }else{
      
        // console.log("최초조회:::", currentPage);
        setSearchRes(bloglistObj.sendObj.resObj.list);
        currentPage++;

        let obj2 = {
          keyword:keyword,
          currentPage:currentPage,
          searchYn:true
        }
        setSearchKeyword(obj2);

      }
    }
      

    // if(bloglistObj.sendObj.resObj.list.length > 0){
    //   blogListDB = blogListDB.concat(bloglistObj.sendObj.resObj.list)
    //   setblogList(blogListDB); 
    // }else{
    //   //다음 조회건수가 없을 경우 처리해야 됨.
    //   searchYn = false; 
    // }
  }

  const observerEl = useRef<HTMLDivElement>(null);
  const handleObserver = useCallback(   
    
    (entries: IntersectionObserverEntry[]) => {
        const target = entries[0];
        if(target.isIntersecting){ //스크롤이 가장 밑에 닿았을경우   
          /*
          1. 다음 페이지가 있을경우 back 에서 전달하도록 처리
          */ 
          // console.log("currentPage::", currentPage);
          if(searchYnG === true){
            if(search === "refresh" && currentPage !== 1){
              getBlogLists(currentPage, keywordG);
            }else if(search !== "refresh"){
              getBlogLists(currentPage, keywordG);
            }
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
  const router = useRouter();
  function movetoblog(blogSeq:any){
    router.push('/blog/' + blogSeq + "?refresh=refresh")
  }

  return(
    <>
      <div className="px-20 grid place-items-center grid-cols-1 2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1
                    lg:px-20 md:px-20 z-1 
      " >
        {
        searchRes.map((item:any, index:any)=>{
          return (
            
              
              <div key={index} className="">
                <div  className="rounded-lg overflow-hidden shadow-2xl border-black border p-2 mt-5 h-[400px] w-[300px]">
                  <div className="flex justify-between border-b border-black mb-2">
                    <p className=" text-xs my-2 ">{getDate(item.regdate)}</p>
                    {/* <Link href={"/blog/"+item.blog_seq}> */}
                    <div className="flex justify-end w-[50%] pt-2">
                        <p className="text-[16px] me-1"><TiDocumentText /></p>
                        <p className="text-xs me-2">{item.commentscnt}</p>
                        <p className="text-[16px] me-1"><BiSolidLike /></p>
                        <p className="text-xs">{item.likecnt}</p>
                      </div>

                    <p className="hover:text-lg my-2 cursor-pointer"
                      onClick={(e)=>movetoblog(item.blog_seq)}>
                      <span><BiHomeAlt2 /></span> 
                    </p>
                    {/* </Link> */}
                  </div>

                  <Link href={"/blog/"+item.blog_seq + "/" + item.seq}>
                  <div className="group ">
                    <div className="">
                      {item.pic ? (
                        <div className='ring-1 ring-black rounded-xl h-36 relative' >
                            <Image 
                            src={item.pic}
                            quality={30}
                            layout="fill"
                            style={{ objectFit: "cover" , borderRadius: '12px' }}
                            alt='' />
                        </div>) : ""
                      }
                        
                    </div> 
                    
                    <div className="">
                      <div className="font-bold text-xl mb-2 mt-1 group-hover:text-2xl truncate">{item.title}</div>
                      
                      {item.pic ? (
                        <div className="whitespace-pre-line m-1 h-[120px] my-4 break-words line-clamp-5">
                          {item.content.replace(/(<([^>]+)>)/gi, '').replace(/&nbsp;/gi, ' ').replace(/&lt;/gi, '<').replace(/&gt;/gi, '>')}
                        </div>  
                      ):(
                        <div className="whitespace-pre-line m-1 h-[264px] my-4 break-words line-clamp-[11]">
                          {item.content.replace(/(<([^>]+)>)/gi, '').replace(/&nbsp;/gi, ' ').replace(/&lt;/gi, '<').replace(/&gt;/gi, '>')}
                        </div>

                      )
                      }
                    </div>
                  </div> 
                  </Link>
                  <div className="border-t border-black ">
                    {/* <p className="mt-2">태그</p> */}
                  </div>
                </div>
              </div>   
             
          )
        })
        }
        
      
      </div>
      <div ref={observerEl} className="h-1"/>
      {/* <div ref={bottom} /> */}
    </>
  )
};
export default MainContent;