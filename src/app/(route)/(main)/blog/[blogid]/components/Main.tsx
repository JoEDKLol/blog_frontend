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

let keywordG = "";
let majorSeqG = -1;
let subSeqG = -1;
let searchYnG = true;

const PriMain = (props: any) => {
  const [setCategory, category] = useState<any>({});
  const [user, setUser] = useRecoilState(userState);
  const [priSearchRes, setPriSearchRes] = useRecoilState(priSearchResArrState);
  const [priSearchKeyword, setPriSearchKeyword] = useRecoilState(priSearchKeywordState);
 

  let currentPage = 0;
  
  
  useEffect(()=>{
    keywordG = priSearchKeyword.keyword;
    majorSeqG = priSearchKeyword.majorSeq;
    subSeqG = priSearchKeyword.subSeq;
    
    // searchYnG = priSearchKeyword.searchYn;
    // console.log(priSearchKeyword.searchYn);

	},[priSearchKeyword]);

  
  async function getBlogLists(cPage:any, blogSeq:any, majorSeq:any, subSeq:any, keyword:any ){
    
    // console.log("cPage:", cPage, "blogSeq:", blogSeq, "majorSeq:",majorSeqG, "subSeq:", subSeqG, "keyword:", keywordG);
    
    let obj = {
      currentPage:cPage,
      blog_seq:blogSeq, 
      majorSeq:majorSeq,
      subSeq:subSeq,
      keyword:keyword,
      searchYn:false
    }

    const bloglistObj = await transaction("get", "blog/bloglistEa", obj, "", false);

    if(cPage > 1){
      if(bloglistObj.sendObj.resObj.list > 0){
        setPriSearchRes(priSearchRes.concat(bloglistObj.sendObj.resObj.list)); 
      }else{
        //다음 조회건수가 없을 경우 처리해야 됨.
        // console.log("다음 조회건수가 없을 경우 처리해야 됨");
        currentPage--;
      }
    }else{
      setPriSearchRes(bloglistObj.sendObj.resObj.list);

    }
      
  }

  const observerEl = useRef<HTMLDivElement>(null);
  const handleObserver = useCallback(   
    
    (entries: IntersectionObserverEntry[]) => {
        const target = entries[0];
        // console.log("여기는 조회됨?", priSearchKeyword);
        if(target.isIntersecting){ //scroll bottom   
          // console.log("여기::",priSearchKeyword);
          if(searchYnG === true){
            currentPage = currentPage+1;
            getBlogLists(currentPage, props.blog_seq, majorSeqG, subSeqG, keywordG);
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
          <div className="flex justify-start pt-6 ms-[0px] ps-28 2xl:ms-[200px] xl:ms-[200px] lg:ms-[200px] md:ms-[0px] sm:ms-[0px]">
            <p className="text-3xl
            ">
            
              {priSearchKeyword.majorName}
              {
                (priSearchKeyword.subName.length>0)?"  >  " + priSearchKeyword.subName:""
              }
              
            </p>
          </div>

          <div className="ms-[0px] px-60 grid place-items-center grid-cols-1 2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1
                        lg:px-20 md:px-20 z-1 
                        2xl:ms-[200px] xl:ms-[200px] lg:ms-[200px] md:ms-[0px] sm:ms-[0px]

          " >
            {/* <button className="
                bg-transparent hover:bg-gray-500 text-black-700 font-semibold hover:text-white py-1 px-4 mr-2 border border-black-500 hover:border-transparent rounded"
                onClick={()=>getBlogLists(1, 14, -1, -1, "")}
                >조회테스트
            </button> */}
            {
            priSearchRes.map((item:any, index:any)=>{
              return (
                
                <Link key={index} href={"/blog/"+item.blog_seq + "/" + item.seq}>
                <div className="mx-1">
                  <div  className="rounded-lg overflow-hidden shadow-lg hover:bg-[#eaedee] p-2 mt-5 h-[400px] w-[300px]">
                    <div className="">
                      {item.pic ? (
                        <div className='ring-1 ring-gray-300 rounded-xl h-32 relative' >
                            <Image 
                            src={item.pic}
                            quality={30}
                            layout="fill"
                            style={{ objectFit: "cover" , borderRadius: '8px' }}
                            alt='' />
                        </div>) : ""
                      }
                        
                    </div> 
                    <div className=""><p className=" text-xs my-4 ">{item.regdate}</p></div>
                    <div className="">
                      <div className="font-bold text-xl mb-2 truncate">{item.title}</div>
                      
                      {item.pic ? (
                        <div className=" m-1 h-[120px] my-4 break-all line-clamp-5">
                          {item.content.replace(/(<([^>]+)>)/gi, '').replace(/&nbsp;/gi, ' ')}
                        </div>  
                      ):(
                        <div className=" m-1 h-[248px] my-4 break-all line-clamp-5">
                          {item.content.replace(/(<([^>]+)>)/gi, '').replace(/&nbsp;/gi, ' ')}
                        </div>

                      )
                      
                    
                      }
                    </div>
                    <div className="">태그</div>
                  </div>
                </div>  
                </Link>
                
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