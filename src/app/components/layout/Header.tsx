'use client';

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Modal from "../modal/Indes";
import Login from "../login/Index";

const MainHeader = (props: any) => {

  let [menu, setMenu] = useState("hidden")
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    // setTheme(document.body.className as Theme);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  function onclickMenuButton(e:any){
    if(menu === "hidden"){
      setMenu("");
    }else{
      setMenu("hidden");
    }
    
  }

  const handleScroll = () => {
    if (window.scrollY > 0) {
      headerRef.current?.classList.add('shadow-[0_5px_7px_0px_#ececec]');
      return;
    }
    headerRef.current?.classList.remove('shadow-[0_5px_7px_0px_#ececec]');
  };

  // 모달 버튼 클릭 유무를 저장할 state
  const [showModal, setShowModal] = useState(false)
    
	// 버튼 클릭시 모달 버튼 클릭 유무를 설정하는 state 함수
  // const loginOnclickHandler = () => setShowModal(!showModal)
  function loginOnclickHandler(){
    setShowModal(!showModal);
  }

  // function setShowModel(){
  //   setShowModal(!showModal);
  // }
  

  return (
      <>
          {/* <head><title>Lola's Home</title></head> */}
          <header
            ref={headerRef}
            className="sticky top-0 left-0 w-full z-990 h-30 font-mono transition duration-500 bg-white dark:bg-[#111111]"
          >
            <nav className="flex items-center justify-between flex-wrap p-3">
              <div className="flex items-center flex-shrink-0 text-dark mr-6">
                <span className="font-semibold text-xl tracking-tight">Lola's Home</span>
                
                <div className="relative pl-10  text-gray-600">
                  <input type="search" name="serch" placeholder="Search" className="w-80 border bg-white h-10 px-5 pr-10 rounded text-sm focus:outline-none"/>
                  <button type="submit" className="absolute right-0 top-0 mt-3 mr-4">
                    <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 56.966 56.966" width="512px" height="512px">
                      <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z"/>
                    </svg>
                  </button>
                </div>
              </div>
              <div>
                <button className="bg-transparent hover:bg-gray-500 text-black-700 font-semibold hover:text-white py-1 px-4 mr-2 border border-black-500 hover:border-transparent rounded"
                  onClick={()=>loginOnclickHandler()}
                >Sign In
                </button>
                <button className="bg-cyan-200 hover:bg-cyan-800 text-black-700 font-semibold hover:text-white py-1 px-4 border border-black-500 hover:border-transparent rounded"
                  onClick={()=>loginOnclickHandler()}
                >Sign Up
                </button>
              </div>
              
              {showModal && <Modal children={<Login clickModal={loginOnclickHandler}></Login>} />}
              
            
              



              {/* </div> */}
              {/* <div className="block lg:hidden">
                <button className="flex items-center px-3 py-2 border rounded text-black-200 border-black-400 hover:text-black hover:border-black"
                  id="menuButton"
                  onClick={e=>onclickMenuButton(e)}
                >
                  <svg className="fill-current h-3 w-3" viewBox="0 0 20 20">
                    <title>Menu</title>
                    <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/>
                  </svg>
                </button>
              </div>
              <div className={"w-full block rflex-gow lg:flex lg:items-center lg:w-auto lg:visible "  + menu }>
                <div className="text-sm lg:flex-grow ">
                  <a href="#responsive-header" className="block mt-4 lg:inline-block lg:mt-0 text-black-200 hover:text-white mr-4">
                    Home
                  </a>
                  <a href="#responsive-header" className="block mt-4 lg:inline-block lg:mt-0 text-black-200 hover:text-white">
                    Blog
                  </a>
                </div>
                <div>
                  <a href="#" className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white mt-4 lg:mt-0">Download</a>
                </div>
              </div> */}
            </nav>
          </header>
      </>
            
            
    );
};
export default MainHeader;