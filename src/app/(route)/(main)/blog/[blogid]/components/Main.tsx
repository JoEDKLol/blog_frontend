'use client';

import SideBar from "@/app/components/sidebar/SideBar";

import { transaction } from "@/app/utils/axios";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { userState } from "@/app/store/user";
import { useRecoilState } from "recoil";
import { priSearchKeywordState } from "@/app/store/priSearchkeyword";
import { priSearchResArrState } from "@/app/store/priSearch";
import { getDate } from "@/app/utils/common";
import { usePathname, useSearchParams } from "next/navigation";
import { TiDocumentText } from "react-icons/ti";
import { BiLike } from "react-icons/bi"; //<BiLike />
import { BiSolidLike } from "react-icons/bi"; //<BiSolidLike />
import { loadingBarState } from "@/app/store/loadingBar";
let keywordG = "";
let majorSeqG = -1;
let subSeqG = -1;
let searchYnG = true;
let currentPage = 0;

let blogList = [] as any;

const PriMain = (props: any) => {
  const [user, setUser] = useRecoilState(userState);
  const [priSearchRes, setPriSearchRes] = useRecoilState(priSearchResArrState);
  const [priSearchKeyword, setPriSearchKeyword] = useRecoilState(priSearchKeywordState);
 

  
  const path:any = usePathname();
  const blog_seq = path.split("/")[2];

  const searchParams = useSearchParams()
  const search = searchParams.get('refresh')
  const [loadingBar, setLoadingBarState] = useRecoilState(loadingBarState);
  
  
  useEffect(()=>{
    keywordG = priSearchKeyword.keyword;
    majorSeqG = priSearchKeyword.majorSeq;
    subSeqG = priSearchKeyword.subSeq;
    currentPage = priSearchKeyword.currentPage;
  
	},[priSearchKeyword]);

  
  useEffect(()=>{
    blogList = priSearchRes;
	},[priSearchRes]);

  useEffect(() => {
    if(search === "refresh"){
      getBlogLists(1, props.blog_seq, -1, -1, "");
    }
  }, [searchParams]);
  
  async function getBlogLists(cPage:any, blogSeq:any, majorSeq:any, subSeq:any, keyword:any ){
    // console.log(blogList);
    // console.log("cPage:", cPage, "blogSeq:", blogSeq, "majorSeq:",majorSeqG, "subSeq:", subSeqG, "keyword:", keywordG);
    currentPage = cPage;
    let obj = { 
      currentPage:cPage,
      blog_seq:blogSeq, 
      majorSeq:majorSeq,
      subSeq:subSeq,
      keyword:keyword,
      searchYn:false
    }

    const bloglistObj = await transaction("get", "blog/bloglistEa", obj, "", false, true, setLoadingBarState);

    if(cPage > 1){
      if(bloglistObj.sendObj.resObj.list.length > 0){
        setPriSearchRes(blogList.concat(bloglistObj.sendObj.resObj.list)); 
        currentPage++;
        setPriSearchKeyword({...priSearchKeyword, currentPage});
        
      }else{
        //다음 조회건수가 없을 경우 처리해야 됨.
        // console.log("다음 조회건수가 없을 경우 처리해야 됨");
        // console.log("여기는 아니지?");
        // currentPage--;
      }
    }else{
      // console.log("최초조회:::", cPage);
      setPriSearchRes(bloglistObj.sendObj.resObj.list);
      currentPage++;
      let obj2 = {
        blog_seq:blog_seq,
        keyword:keyword,
        majorSeq:majorSeq,
        majorName:"",
        subSeq:subSeq,
        subName:"",
        currentPage:currentPage,
        searchYn:true
      }
      setPriSearchKeyword(obj2);

    }
      
  }

  const observerEl = useRef<HTMLDivElement>(null);
  const handleObserver = useCallback(   
    
    (entries: IntersectionObserverEntry[]) => {
        const target = entries[0];
        
        if(target.isIntersecting){ //scroll bottom   
         
          if(searchYnG === true){
            // /currentPage = currentPage+1;
            // console.log(currentPage);
            // getBlogLists(currentPage, props.blog_seq, majorSeqG, subSeqG, keywordG);
            if(search === "refresh" && currentPage !== 1){
              getBlogLists(currentPage, props.blog_seq, majorSeqG, subSeqG, keywordG);
            }else if(search !== "refresh"){
              getBlogLists(currentPage, props.blog_seq, majorSeqG, subSeqG, keywordG);
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

  return(
    <>
      <div className="">
        
        <SideBar user={user} blog_seq={props.blog_seq} getBlogLists={getBlogLists} priSearchKeyword={priSearchKeyword} setPriSearchKeyword={setPriSearchKeyword} />
         
        <div className="">
          <div className="flex justify-start pt-3 ms-[0px] ps-16 2xl:ms-[200px] xl:ms-[200px] lg:ms-[200px] md:ms-[0px] sm:ms-[0px]">
            <p className="font-bold  px-2 py-2 border-b-2 border-b-black w-[90%]
            ">
              {
                (!priSearchKeyword.majorName)?
                "all":""
              }
              
              {priSearchKeyword.majorName}
              {
                (priSearchKeyword.subName.length>0)?"  >  " + priSearchKeyword.subName:""
              }
              
            </p>
          </div>

          <div className="ms-[0px] px-64 grid place-items-center grid-cols-1 2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1
                        2xl:px-16 xl:px-16 lg:px-20 md:px-20 z-1 
                        2xl:ms-[200px] xl:ms-[200px] lg:ms-[200px] md:ms-[0px] sm:ms-[0px]

          " >
            {
            priSearchRes.map((item:any, index:any)=>{
              return (
                
                
                <div key={index} className="mx-1">
                  <div  className="rounded-lg overflow-hidden shadow-2xl border-black border p-2 mt-5 h-[400px] w-[300px]">
                    <div className="flex justify-between border-b border-black mb-2">
                      <p className=" text-xs my-2 ">{getDate(item.regdate)}</p>
                      
                      <div className="flex justify-end w-[50%] pt-2">
                        <p className="text-[16px] me-1"><TiDocumentText /></p>
                        <p className="text-xs me-2">{item.commentscnt}</p>
                        <p className="text-[16px] me-1"><BiSolidLike /></p>
                        <p className="text-xs">{item.likecnt}</p>
                      </div>
                    </div>

                    <Link  href={"/blog/"+item.blog_seq + "/" + item.seq}>
                    <div className="group">
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
                        <div className="font-bold text-xl mb-2 truncate group-hover:text-2xl">{item.title}</div>
                        
                        {item.pic ? (
                          <div className=" m-1 h-[120px] my-4 break-all line-clamp-5">
                            {item.content.replace(/(<([^>]+)>)/gi, '').replace(/&nbsp;/gi, ' ')}
                          </div>  
                        ):(
                          <div className=" m-1 h-[264px] my-4 break-all line-clamp-5">
                            {item.content.replace(/(<([^>]+)>)/gi, '').replace(/&nbsp;/gi, ' ')}
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
        </div>
      </div>
    </>
  )
};
export default PriMain;