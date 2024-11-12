'use client';
import { GiHamburgerMenu } from "react-icons/gi";
import { transaction } from "@/app/utils/axios";
import { signOut } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import Modal from "../modal/Indes";
import Login from "../login/Index";
import SignUp from "../signup/Index";
import Password from "../password/Index";
import { userState } from "@/app/store/user";
import { useRecoilState } from "recoil";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { priSearchResArrState } from "@/app/store/priSearch";
import { priSearchKeywordState } from "@/app/store/priSearchkeyword";

const PriHeader = (props: any) => {

  const headerRef = useRef<HTMLElement>(null);
  // 모달 버튼 클릭 유무를 저장할 state
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [showModal3, setShowModal3] = useState(false);
  const [user, setUser] = useRecoilState(userState);
  const [blogInfo, setBlogInfo] = useState<any>({});
  const [searchText, setSearchText] = useState<any>();
  const [priSearchRes, setPriSearchRes] = useRecoilState(priSearchResArrState);
  const [priSearchKeyword, setPriSearchKeyword] = useRecoilState(priSearchKeywordState);

  useEffect(() => {

    window.addEventListener('scroll', handleScroll);
    // setTheme(document.body.className as Theme);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {

    if(user.blog_seq != ""){
      priSearch();
      getBlogInfo();
    }
    
  }, [user]);

  
  const handleScroll = () => {
    if (window.scrollY > 0) {
      headerRef.current?.classList.add('shadow-[0_5px_7px_0px_#ececec]');
      return;
    }
    headerRef.current?.classList.remove('shadow-[0_5px_7px_0px_#ececec]');
  };

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
    const retObj = await transaction("get", "logout", {}, "", false);
  }

  //blog_seq로 블로그 정보를 조회한다.
  async function getBlogInfo(){
    let obj = {
      blog_seq:user.blog_seq
    }
    const blogInfoObj = await transaction("get", "blog/blogInfo", obj, "", false);
    setBlogInfo(blogInfoObj.sendObj.resObj);
  }
  const router = useRouter();

  function mainPage(){
    router.push('/');
  }

  function priSearch(){
    
    const searchObj = {
      blog_seq:user.blog_seq,
      keyword:searchText,
      majorSeq:priSearchKeyword.majorSeq,
      subSeq:priSearchKeyword.subSeq,
      currentPage:priSearchKeyword.currentPage,
      searchYn:true,
    }

    setPriSearchKeyword(
      searchObj 
    )

    getBlogLists();

  }
  
  async function getBlogLists(){
    
    let obj = {
      blog_seq:user.blog_seq,
      keyword:searchText,
      majorSeq:priSearchKeyword.majorSeq,
      subSeq:priSearchKeyword.subSeq,
      currentPage:1
    }
    
 
    // return;
    const bloglistObj = await transaction("get", "blog/bloglistEa", obj, "", false);
    setPriSearchRes(bloglistObj.sendObj.resObj.list); 
    console.log(priSearchKeyword);
  }

  function searchTextOnchangeHandler(e:any){
    setSearchText(e.target.value);
    setPriSearchKeyword({...priSearchKeyword, keyword:e.target.value});
  }

  function searchTextOnKeyDownHandler(e:any){
    if(e.key === 'Enter') {
      priSearch();
    }
  }

  return (
      <>
          <header
            ref={headerRef}
            className="sticky top-0 left-0 w-full z-50 h-30 font-mono transition duration-500 bg-white dark:bg-[#111111]"
          >
          <nav className="flex items-center justify-between flex-wrap p-3">

              <div className="flex items-center flex-shrink-0 text-dark mr-6">
                <Link href={"/blog/"+user.blog_seq}>
                <span className="font-semibold text-xl tracking-tight hidden
                2xl:block xl:block lg:block md:hidden sm:hidden
                ">
                    {blogInfo.name} 
                </span>
                </Link>

                <Link href={"/blog/"+user.blog_seq}>
                <span className="text-xl block 2xl:hidden xl:hidden lg:hidden md:block sm:block">
                  <GiHamburgerMenu />
                </span>
                </Link>

                 
                <div className="relative pl-3  text-gray-600">
                  <input type="search" name="serch" id="serch" placeholder="Search" className="w-[180px] 
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
              <div>
                <button className="
                bg-transparent hover:bg-gray-500 text-black-700 font-semibold hover:text-white py-1 px-4 mr-2 border border-black-500 hover:border-transparent rounded"
                onClick={()=>mainPage()}
                >main
                </button>
                {
                (user.id)?
                <>
                <button className="
                bg-transparent hover:bg-gray-500 text-black-700 font-semibold hover:text-white py-1 px-4 mr-2 border border-black-500 hover:border-transparent rounded"
                  
                onClick={()=>logoutOnclickHandler()}

                >Logout
                </button>
                </>
                :
                <>
                <button className="
                bg-transparent hover:bg-gray-500 text-black-700 font-semibold hover:text-white py-1 px-4 mr-2 border border-black-500 hover:border-transparent rounded"
                  
                onClick={()=>loginOnclickHandler()}

                >Sign In
                </button>
                <button className="
                
                bg-transparent hover:bg-gray-500 text-black-700 font-semibold hover:text-white py-1 px-4 border border-black-500 hover:border-transparent rounded"
                  onClick={()=>siginUpOnclickHandler()}
                >Sign Up
                </button>
                </>
                }
                {/* <Link href={`http://localhost:3000/blog/123`}>
                <button className="
                bg-cyan-200 hover:bg-cyan-800 text-black-700 font-semibold hover:text-white py-1 px-4 border border-black-500 hover:border-transparent rounded"
                  // onClick={()=>siginUpOnclickHandler()}
                >test
                </button>
                </Link>
                <button className="
                bg-cyan-200 hover:bg-cyan-800 text-black-700 font-semibold hover:text-white py-1 px-4 border border-black-500 hover:border-transparent rounded"
                  onClick={()=>siginUpOnclickHandlertest()}
                >test123
                </button>
                <button className="
                bg-cyan-200 hover:bg-cyan-800 text-black-700 font-semibold hover:text-white py-1 px-4 border border-black-500 hover:border-transparent rounded"
                  onClick={()=>siginUpOnclickHandlerhome()}
                >home
                </button> */}

              </div>
              
              {showModal && <Modal children={<Login clickModal={loginOnclickHandler} clickSignUpModal={siginUpOnclickHandler} clickPasswordModal={passwordOnclickHandler}></Login>} />}
              {showModal2 && <Modal children={<SignUp clickModal={siginUpOnclickHandler} clickSignInModal={loginOnclickHandler}></SignUp>} />}
              {showModal3 && <Modal children={<Password clickModal={passwordOnclickHandler} clickSignInModal={loginOnclickHandler}></Password>} />}


            </nav>
          
          
          
          </header>
      </>
            
            
    );
};
export default PriHeader;