'use client';
import { signIn } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { checkInputData } from '../../utils/checkUserValidation';
import { transaction } from '../../utils/axios';
import { useRecoilState } from "recoil";
import { loadingBarState } from "@/app/store/loadingBar";
import { errorPageState } from "@/app/store/error";


const SignUp = (props: any) => {
  
  const router = useRouter()

  interface signUpBody {
    email:string,
    name:string,
    password:string,
    repassword:string
  }

  // let [userObj, setUserObj] = useState<signUpBody|null>(null);

  let [nameMsg, setNameMsg] = useState<string|null>(null); 
  let [emailMsg, setEmailMsg] = useState<string|null>(null); 
  let [passwordMsg, setPasswordMsg] = useState<string|null>(null); 
  let [rePasswordMsg, setRePasswordMsg] = useState<string|null>(null); 
  let [signupMsg, setSignupMsg] = useState<string|null>(null); 
  let [signupSuccess, setSignupSuccess] = useState<string|null>("flex");
  let [signupSuccessAf, setSignupSuccessAf] = useState<string|null>("hidden");
  
  const [errorPage, setErrorPage] = useRecoilState(errorPageState);
  
  const focusEmail = useRef<HTMLInputElement>(null);
  const focusName = useRef<HTMLInputElement>(null);
  const focusPassword = useRef<HTMLInputElement>(null);
  const focusRepassword = useRef<HTMLInputElement>(null);


  const [loadingBar, setLoadingBarState] = useRecoilState(loadingBarState);

  //signupmodal 
  function clickSignInModal(){
    props.clickModal();
    props.clickSignInModal();
  }


  function signUpClickHandler(event: any){
    event.preventDefault();

    setNameMsg("");
    setEmailMsg("");
    setPasswordMsg("");
    setRePasswordMsg("");
    setSignupMsg("");
    
    const email = event.target.email.value;
    const name = event.target.name.value;
    const password = event.target.password.value;
    const repassword = event.target.repassword.value;

    const checkObj = {
      email:email,
      name:name,
      password:password,
      repassword:repassword
    }
  
    const retObj = checkInputData(checkObj);
    console.log(retObj);
    
    if(retObj.yn === false && retObj.field === "email"){
      focusEmail.current?.focus()
      setEmailMsg(retObj.str)
      return;
    }

    if(retObj.yn === false && retObj.field == "name"){
      focusName.current?.focus();
      setNameMsg(retObj.str);
      return;
    }

    if(retObj.yn === false && retObj.field == "password"){
      focusPassword.current?.focus();
      setPasswordMsg(retObj.str);
      return;
    }

    if(retObj.yn === false && retObj.field === "repassword"){
      focusRepassword.current?.focus();
      setRePasswordMsg(retObj.str);
      return;
    }
    if(retObj.yn === false && retObj.field === "pw_regex"){
      // focusRepassword.current.focus();
      setPasswordMsg(retObj.str);
      return;
    }

    signupApi(checkObj);
  }

  async function signupApi(obj:any){
    await transaction("post", "signup", obj, signupApiCallback, true, true, setLoadingBarState, setErrorPage);
    
  }

  function signupApiCallback(obj:any){
   
    if(obj.sendObj.success === 'y'){
      setSignupSuccess("hidden");
      setSignupSuccessAf("flex")
    }

    if(obj.sendObj.success === 'n'){
      setSignupMsg("The email already exists.");      
    }
  }


  return(
    <>
      <div className= "border border-black w-[400px] h-[600px] rounded bg-white font-sans">
      {/* <!-- Modal content --> */}
        <form onSubmit={(e)=>signUpClickHandler(e)} 
        className={"flex-col w-full h-full p-6 text-center bg-white rounded-3xl " + signupSuccess} autoComplete="none" >
          <div className=" flex w-full h-[50px] columns-2">
            <div className=" mb-3 text-3xl text-dark-grey-900 w-full ps-10" >Sign Up</div>
            {/* <div className=" mb-3 text-3xl text-dark-grey-900" >Sign In</div> */}
            {/* <div className=" flex justify-center mb-3 text-3xl text-dark-grey-900" >Sign In</div> */}
            <div className="flex justify-center h-[20px]">
              <button type="button" 
                onClick={()=>{props.clickModal()}}
                className="bg-white  rounded-md inline-flex items-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                <svg className="h-[20px] w-[20px]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          <label htmlFor="email" className="mb-2 mt-3 text-m text-start text-grey-900">Email*
          <span className="ps-1 text-red-500 text-sm">{emailMsg}</span>
          </label>
          <input 
          ref={focusEmail}
          autoComplete="off" id="email" type="email" placeholder="Email" className=" border flex items-center w-full px-5 py-3 mr-2 text-m  focus:bg-grey-400 mb-3 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded"/>
          
          <label htmlFor="name" className="mb-2 text-m text-start text-grey-900">name*
          <span className="ps-1 text-red-500 text-sm">{nameMsg}</span>
          </label>
          <input 
          ref={focusName} 
          autoComplete="off" id="name" type="text" placeholder="name"  className="border flex items-center w-full px-5 py-3 mb-3 mr-2 text-m  focus:bg-grey-400 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded"/>
          
          <label htmlFor="password" className="mb-2 text-m text-start text-grey-900">Password*
          <span className="ps-1 text-red-500 text-sm">{passwordMsg}</span>
          </label>
          <input 
          ref={focusPassword} 
          autoComplete="new-password" id="password" type="password" placeholder="Password" className="border flex items-center w-full px-5 py-3 mb-3 mr-2 text-m  focus:bg-grey-400 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded"/>
          
          <label htmlFor="repassword" className="mb-2 text-m text-start text-grey-900">Repassword*
          <span className="ps-1 text-red-500 text-sm">{rePasswordMsg}</span>
          </label>
          <input 
          ref={focusRepassword} 
          autoComplete="new-password" id="repassword" type="password" placeholder="Repassword" className=" border flex items-center w-full px-5 py-3 mb-3 mr-2 text-m  focus:bg-grey-400 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded"/>

          <button 
          // onClick={(e)=>signUpClickHandler(e)}
          className="border bg-gray-200 hover:bg-gray-400 text-black font-bold py-3 px-4 mt-3 rounded mb-5">
            Sign Up
          </button>
          
          <div><span className=" text-red-500">{signupMsg}</span></div>
          <div className="flex flex-row justify-center">
            <p className="mb-3 text-sm leading-relaxed text-grey-900">Already have an account? 
            <button onClick={()=>{clickSignInModal()}} className="font-bold text-grey-700">SignIn</button></p>
            {/* <a  className="font-bold text-grey-700">Create an Account</a> */}
          </div>
        </form>



        <div className={"flex-col w-full h-full p-6 text-center " + signupSuccessAf}>
          <div className=" flex w-full h-[50px] columns-2">
            <div className=" mb-3 text-3xl text-dark-grey-900 w-full ps-10" >Sign Up</div>
            {/* <div className=" mb-3 text-3xl text-dark-grey-900" >Sign In</div> */}
            {/* <div className=" flex justify-center mb-3 text-3xl text-dark-grey-900" >Sign In</div> */}
            <div className="flex justify-center h-[20px]">
              <button type="button" 
                onClick={()=>{props.clickModal()}}
                className="bg-white  rounded-md inline-flex items-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                <svg className="h-[20px] w-[20px]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button> 
            </div>
          </div>  
          <p className='text-lg pt-16 pb-5'>
            Sign up is complete.     
          </p>
          <div className="flex flex-row justify-center">
            <button onClick={()=>{clickSignInModal()}} className="font-bold text-grey-700">Go to Sign in page</button>
          </div>
        </div>
        

      </div>
      
  </>
  )


    
}

export default SignUp;