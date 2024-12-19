'use client';

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Modal from "../modal/Indes";
import Login from "../login/Index";
import SignUp from "../signup/Index";
import Password from "../password/Index";

import { useRouter, useSearchParams } from "next/navigation";
import { useRecoilState } from "recoil";
import { userState } from "@/app/store/user";
import { signOut } from "next-auth/react";
import { transaction } from "@/app/utils/axios";
import { searchResArrState } from "@/app/store/search";
import { searchKeywordState } from "@/app/store/searchkeyword";
import { loadingBarState } from "@/app/store/loadingBar";
import { errorPageState } from "@/app/store/error";
import { TbHome } from "react-icons/tb";
import { TbHomeStar } from "react-icons/tb";
import { TbHomeMove } from "react-icons/tb";
import { PiSignOutFill } from "react-icons/pi";
import { PiSignInBold } from "react-icons/pi";
import { LuPenLine } from "react-icons/lu";

const MainHeader = (props: any) => {
  const router = useRouter();
  let [menu, setMenu] = useState("hidden")
  const headerRef = useRef<HTMLElement>(null);
  const [user, setUser] = useRecoilState(userState);
  
  const [searchRes, setSearchRes] = useRecoilState(searchResArrState);
  const [searchKeyword, setSearchKeyword] = useRecoilState(searchKeywordState);
  
  const [searchText, setSearchText] = useState<any>();

  const searchParams = useSearchParams()
  const search = searchParams.get('refresh')
  const [loadingBar, setLoadingBarState] = useRecoilState(loadingBarState);
  const [errorPage, setErrorPage] = useRecoilState(errorPageState);
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    // setTheme(document.body.className as Theme);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // useEffect(() => {
  //   if(search === "refresh"){
  //     // priSearch();
  //   }
  // }, [searchParams]);

  // function onclickMenuButton(e:any){
  //   if(menu === "hidden"){
  //     setMenu("");
  //   }else{
  //     setMenu("hidden");
  //   }
    
  // }

  const handleScroll = () => {
    if (window.scrollY > 0) {
      headerRef.current?.classList.add('shadow-[0_5px_7px_0px_#ececec]');
      return;
    }
    headerRef.current?.classList.remove('shadow-[0_5px_7px_0px_#ececec]');
  };

  // 모달 버튼 클릭 유무를 저장할 state
  const [showModal, setShowModal] = useState(false)
  const [showModal2, setShowModal2] = useState(false)
  const [showModal3, setShowModal3] = useState(false)
    
	// 버튼 클릭시 모달 버튼 클릭 유무를 설정하는 state 함수
  // const loginOnclickHandler = () => setShowModal(!showModal)
  function loginOnclickHandler(){
    setShowModal(!showModal);
  }

  function siginUpOnclickHandler(){
    // router.push("/");
    setShowModal2(!showModal2);
  }

  function passwordOnclickHandler(){
    setShowModal3(!showModal3);
  }

  async function logoutOnclickHandler(){
    signOut();
    sessionStorage.removeItem("myblog-accesstoken");
    const retObj = await transaction("get", "logout", {}, "", false, true, setLoadingBarState, setErrorPage);
  }

  function movetoMyBlogOnclickHandler(){
    router.push('/blog/' + user.blog_seq + "?refresh=refresh")
  }

  function searchTextOnchangeHandler(e:any){
    setSearchText(e.target.value);
    // setPriSearchKeyword({...priSearchKeyword, keyword:e.target.value});
  }

  function searchTextOnKeyDownHandler(e:any){
    if(e.key === 'Enter') {
      priSearch();
    }
  }

  function priSearch(){
    setSearchKeyword(
      {
        keyword:searchText,
        currentPage:searchKeyword.currentPage,
        searchYn:searchKeyword.searchYn,
      } 
    )

    getBlogLists();
  }

  async function getBlogLists(){
    // console.log("여기 조회됨")
    let obj = {
      keyword:searchText,
      currentPage:1,
      searchYn:true
    }
    setSearchKeyword(obj);
    
    const bloglistObj = await transaction("get", "blog/bloglist", obj, "", false, true, setLoadingBarState, setErrorPage);
    
    if(bloglistObj.sendObj.success === 'y'){
      setSearchRes(bloglistObj.sendObj.resObj.list);
    }

    
    let obj2 = {
      keyword:searchText,
      currentPage:2,
      searchYn:true
    }
    
    setSearchKeyword(obj2);
  }

  return (
      <>
          {/* <head><title>Lola's Home</title></head> */}
          <header
            ref={headerRef}
            className=" sticky top-0 left-0 w-full z-40 h-30 font-mono transition duration-500 bg-white dark:bg-[#111111]"
          >
            <nav className="flex items-center justify-between flex-wrap p-3">
              <div className="flex items-center flex-shrink-0 text-dark mr-6">
                <p className="font-semibold text-sm tracking-tight hidden
                2xl:block xl:block lg:block md:block sm:hidden
                 px-2 py-2 rounded-md border
                  border-yellow-800 
                 bg-gradient-to-r from-yellow-600 via-yellow-200 to-yellow-200
                ">Lola's Blog
                </p>

                <p className="font-semibold tracking-tight block
                2xl:hidden xl:hidden lg:hidden md:hidden sm:block
                 px-1 py-1 rounded-md border
                  border-yellow-800 
                 bg-gradient-to-r from-yellow-600 via-yellow-200 to-yellow-200
                 
                ">
                  <span className="text-2xl"><TbHome/></span>
                </p>

                {/* <p className="font-semibold text-sm tracking-tight block
                2xl:hidden xl:hidden lg:hidden md:hidden sm:block
                 px-2 py-2 rounded-full border-2 border-yellow-800 bg-yellow-100
                ">L
                </p> */}
                
                <div className="relative pl-1  text-gray-600">
                  <input type="search" name="serch" placeholder="Search" className="w-[150px] 
                  2xl:w-[300px] xl:w-[300px] lg:w-[300px] md:w-[300px] sm:w-[260px]
                  border bg-white h-10 px-5 pr-10 rounded text-sm focus:outline-none"
                  onChange={(e)=>searchTextOnchangeHandler(e)}
                  onKeyDown={(e)=>searchTextOnKeyDownHandler(e)}

                  />
                  <button type="submit" className="absolute right-0 top-0 mt-3 mr-4"
                  onClick={(e)=>priSearch()}>
                    <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 56.966 56.966" width="512px" height="512px">
                      <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z"/>
                    </svg>
                  </button>
                </div>
              </div>
              <div className="flex justify-end">
                {
                (user.id)?
                <>
                <button className="group hidden 2xl:block xl:block lg:block md:block sm:hidden
                bg-transparent hover:bg-gray-500 text-black-700 font-semibold  py-1 px-2 mr-2 border border-black hover:border-transparent rounded"
                onClick={()=>movetoMyBlogOnclickHandler()}
                >
                <span className="group-hover:text-white block black text-gray-700">MyBlog</span>
                </button>
                <p className="block 2xl:hidden xl:hidden lg:hidden md:hidden sm:block 
                border border-black text-2xl mr-1 rounded hover:bg-gray-500
                cursor-pointer p-1
                "
                onClick={()=>movetoMyBlogOnclickHandler()}
                ><span><TbHomeStar /></span></p>

                <button className="group hidden 2xl:block xl:block lg:block md:block sm:hidden
                bg-transparent hover:bg-gray-500 text-black-700 font-semibold   py-1 px-2 mr-2 border border-black hover:border-transparent rounded"
                onClick={()=>logoutOnclickHandler()}

                >
                <span className="group-hover:text-white block black text-gray-700">Logout</span>
                </button>
                <p className="block 2xl:hidden xl:hidden lg:hidden md:hidden sm:block 
                border border-black text-2xl rounded hover:bg-gray-500
                cursor-pointer p-1
                "
                onClick={()=>logoutOnclickHandler()}
                ><span><PiSignOutFill /></span></p>
                </>
                

                :
                <>
                <button className="group hidden 2xl:block xl:block lg:block md:block sm:hidden
                bg-transparent hover:bg-gray-500 text-black-700 font-semibold   py-1 px-2 mr-2 border border-black hover:border-transparent rounded"
                onClick={()=>loginOnclickHandler()}
                >
                <span className="group-hover:text-white block black text-gray-700">Sign In</span>
                </button>
                <p className="block 2xl:hidden xl:hidden lg:hidden md:hidden sm:block mr-1
                border border-black text-2xl rounded hover:bg-gray-500
                cursor-pointer p-1
                "
                onClick={()=>loginOnclickHandler()}
                ><span><PiSignInBold /></span></p>

                <button className="group hidden 2xl:block xl:block lg:block md:block sm:hidden
                bg-transparent hover:bg-gray-500 text-black-700 font-semibold   py-1 px-2 border border-black hover:border-transparent rounded"
                  onClick={()=>siginUpOnclickHandler()}
                >
                <span className="group-hover:text-white block black text-gray-700">Sign Up</span>
                </button>
                <p className="block 2xl:hidden xl:hidden lg:hidden md:hidden sm:block 
                border border-black text-2xl rounded hover:bg-gray-500
                cursor-pointer p-1
                "
                onClick={()=>siginUpOnclickHandler()}
                ><span><LuPenLine /></span></p>
                </>
                }
                
                
              </div>
              
              {showModal && <Modal children={<Login clickModal={loginOnclickHandler} clickSignUpModal={siginUpOnclickHandler} clickPasswordModal={passwordOnclickHandler}></Login>} />}
              {showModal2 && <Modal children={<SignUp clickModal={siginUpOnclickHandler} clickSignInModal={loginOnclickHandler}></SignUp>} />}
              {showModal3 && <Modal children={<Password clickModal={passwordOnclickHandler} clickSignInModal={loginOnclickHandler}></Password>} />}


            </nav>
          </header>
      </>
            
            
    );
};
export default MainHeader;