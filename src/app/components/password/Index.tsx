'use client';
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { checkEmail, checkPassword } from '../../utils/checkUserValidation';
import { useRef, useState } from "react";
import { transaction } from '@/app/utils/axios';
import { getRandomNumber } from '@/app/utils/common'
import { sendEmail } from "@/app/utils/email";
import { useRecoilState } from "recoil";
import { loadingBarState } from "@/app/store/loadingBar";
import { errorPageState } from "@/app/store/error";

const Password = (props: any) => {
  const { clickModal } = props;
  const router = useRouter()
  
  interface pwChgBody {
    email:string,
    number:string,
    password:string,
    repassword:string
  }


  // let [userObj, setUserObj] = useState<signUpBody|null>(null);
  let [emailMsg, setEmailMsg] = useState<string|null>(null);
  let [numberMsg, setNumberMsg] = useState<string|null>(null); 
  let [passwordMsg, setPasswordMsg] = useState<string|null>(null); 
  let [rePasswordMsg, setRePasswordMsg] = useState<string|null>(null); 

  let [pwObj, setPwObj] = useState<pwChgBody>({email:"",number:"",password:"",repassword:""})
  
  let [emailObjDisable, setEmailObjDisable] = useState<any>({objDisable:false, classHover:"hover:bg-gray-400"});
  let [numberObjDisable, setNumberObjDisable] = useState<any>({objDisable:true, classHover:""});
  let [passwordObjDisable, setPasswordObjDisable] = useState<any>({objDisable:true, classHover:""});
  
  let [changePwSuccess, setChangePwSuccess] = useState<string|null>("flex");
  let [changePwSuccessAf, setChangePwSuccessAf] = useState<string|null>("hidden");
  
  const [loadingBar, setLoadingBarState] = useRecoilState(loadingBarState);
  const [errorPage, setErrorPage] = useRecoilState(errorPageState);
  
  const focusEmail = useRef<HTMLInputElement>(null);
  const focusNumber = useRef<HTMLInputElement>(null);
  const focusPassword = useRef<HTMLInputElement>(null);
  const focusRepassword = useRef<HTMLInputElement>(null);

  //signupmodal 
  function clickSignInModal(){
    props.clickModal();
    props.clickSignInModal();
  }

  function onchangeHandler(e:any){
    setPwObj({...pwObj, [e.target.id]:e.target.value})
  }

  function changePasswordClickHandler(e:any){
    e.preventDefault();
    // console.log("여기");
    setPasswordMsg("");
    setRePasswordMsg("");

    const retObj = checkPassword(pwObj);

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
      focusPassword.current?.focus();
      setPasswordMsg(retObj.str);
      return;
    }

    transaction("post", "updatePassword", pwObj, updatePasswordCallback, true, true, setLoadingBarState, setErrorPage);
  }

  function updatePasswordCallback(obj:any){
    if(obj.sendObj.success === 'y'){
      setChangePwSuccess("hidden");
      setChangePwSuccessAf("flex");
    }else{
      setPasswordMsg(obj.sendObj.message);
    }
  }
2



  //email에 인증번호 전송 
  function sendClickHandler(e:any){
    e.preventDefault();
    setEmailMsg("");
    setNumberMsg("");
    const retObj = checkEmail(pwObj);
    if(!retObj.yn){
      focusEmail.current?.focus();
      setEmailMsg(retObj.str);
      return;
    }
    emailVerifySendApi();
  }
  //이메일 인증 이력 저장
  function emailVerifySendApi(){
    transaction("post", "emailverify", pwObj, emailVerifySendApiCallback, true, true, setLoadingBarState, setErrorPage);
  }

  function emailVerifySendApiCallback(obj:any){
    if(obj.sendObj.success === 'y'){
      const templateParams = {
        to_email: pwObj.email,
        number: getRandomNumber(6),
        id:obj.sendObj.resObj.id,
      };
      sendEmail(templateParams, sendEmailCallback);
    }

    if(obj.sendObj.success === 'n'){
      focusEmail.current?.focus();
      setEmailMsg(obj.sendObj.message);
    }
  }

  function sendEmailCallback(res:string, yn:string, obj:object){
    if(yn==="y"){
      //DB에 인증한 이메일에 보내 번호 저장 
      transaction("post", "emailverifysave", obj, emailverifysaveApiCallback, true, true, setLoadingBarState, setErrorPage);
    }else{
      setEmailMsg(res);
    }
  }

  function emailverifysaveApiCallback(obj:any){
    if(obj.sendObj.success === 'y'){
      //email input 비활성화
      //email send 버튼 비활성화
      //인증번호 INPUT 및 버튼 활성화
      //console.log("db number save")
      focusNumber.current?.focus();
      setEmailObjDisable({objDisable:true, classHover:""});
      setNumberObjDisable({objDisable:false, classHover:"hover:bg-gray-400"});

    }else{
      setEmailMsg("email db save error");
    }
  }

  function verifyClickHandler(e:any){
    e.preventDefault();
    //01. db에 저장된 인증번호 확인
    //02. 확인되면 비활성화 및 password, repassword 창 활성화 및 change password 버튼 활성화
    // console.log(pwObj);
    setNumberMsg("");
    transaction("post", "emailverifynumber", pwObj, verifyClickHandlerCallback, true, true, setLoadingBarState, setErrorPage);
  }

  function verifyClickHandlerCallback(obj:any){
    
    if(obj.sendObj.success === 'y'){
      focusPassword.current?.focus();
      // console.log("여기로 온다.");
      setNumberObjDisable({objDisable:true, classHover:""});
      setPasswordObjDisable({objDisable:false, classHover:"hover:bg-gray-400"});
    }else{
      setNumberMsg(obj.sendObj.message);
    }
  }



  return(
    <>
      <div className= "border border-black w-[400px] h-[600px] rounded bg-white font-sans"
      // onClick={clickModal}
      >
      {/* <!-- Modal content --> */}
        <form onSubmit={(e)=>changePasswordClickHandler(e)} 
        className={"flex-col w-full h-full p-6 text-center bg-white rounded-3xl " + changePwSuccess} autoComplete="none" >
          <div className=" flex w-full h-[50px] columns-2">
            <div className=" mb-3 text-3xl text-dark-grey-900 w-full ps-10" >Change password</div>
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
          
          <label htmlFor="email" className="mb-2 mt-3 text-m text-start text-grey-900">Email
          <span className="ps-1 text-red-500 text-sm">{emailMsg}</span>
          </label>
          <div className="flex w-full columns-2">
            <input 
            disabled={emailObjDisable.objDisable}
            ref={focusEmail} 
            onChange={(e)=>onchangeHandler(e)}
            autoComplete="off" id="email" type="email" placeholder="Email" 
            className=" border flex items-center w-full px-5 py-3 mr-2 text-m  focus:bg-grey-400 mb-3 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded"/>
            <button
            disabled={emailObjDisable.objDisable}
            onClick={(e)=>{sendClickHandler(e)}}
            className={"border bg-gray-200  text-black font-bold px-3 py-3 mb-3 rounded " + emailObjDisable.classHover}>
            Send
            </button>
          </div>
          <label htmlFor="number" className="mb-2 text-m text-start text-grey-900">Number
          <span className="ps-1 text-red-500 text-sm">{numberMsg}</span>
          </label>
          <div className="flex w-full columns-2">
            <input 
            ref={focusNumber} 
            onChange={(e)=>onchangeHandler(e)}
            disabled={numberObjDisable.objDisable} 
            autoComplete="off" id="number" type="text" placeholder="Number"  className="border flex items-center w-full px-5 py-3 mb-3 mr-2 text-m  focus:bg-grey-400 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded"/>
            <button
            onClick={(e)=>{verifyClickHandler(e)}}
            disabled={numberObjDisable.objDisable}
            className={"border bg-gray-200  text-black font-bold px-3 py-3 mb-3 rounded " + numberObjDisable.classHover}>
            Verify
            </button>
          </div>
          
          <label htmlFor="password" className="mb-2 text-m text-start text-grey-900">Password
          <span className="ps-1 text-red-500 text-sm">{passwordMsg}</span>
          </label>
          <input
          ref={focusPassword} 
          onChange={(e)=>onchangeHandler(e)}
          disabled={passwordObjDisable.objDisable} 
          autoComplete="new-password" id="password" type="password" placeholder="Password" className="border flex items-center w-full px-5 py-3 mb-3 mr-2 text-m  focus:bg-grey-400 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded"/>
          
          <label htmlFor="repassword" className="mb-2 text-m text-start text-grey-900">Repassword
          <span className="ps-1 text-red-500 text-sm">{rePasswordMsg}</span>
          </label>
          <input 
          ref={focusRepassword} 
          onChange={(e)=>onchangeHandler(e)}
          disabled={passwordObjDisable.objDisable} 
          autoComplete="new-password" id="repassword" type="password" placeholder="Repassword" className=" border flex items-center w-full px-5 py-3 mb-3 mr-2 text-m  focus:bg-grey-400 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded"/>

          <button 
          disabled={passwordObjDisable.objDisable}
          className={"border bg-gray-200  text-black font-bold py-3 px-4 mt-3 rounded mb-5" + passwordObjDisable.classHover} >
          Change Password
          </button>

          <div className="flex flex-row justify-center">
            <p className="mb-3 text-sm leading-relaxed text-grey-900">Already have an account? 
            <button 
            onClick={()=>{clickSignInModal()}} className="font-bold text-grey-700">SignIn</button></p>
            {/* <a  className="font-bold text-grey-700">Create an Account</a> */}
          </div>
        </form>

        <div className={"flex-col w-full h-full p-6 text-center " + changePwSuccessAf}>
          <div className=" flex w-full h-[50px] columns-2">
            <div className=" mb-3 text-3xl text-dark-grey-900 w-full ps-10" >Change password</div>
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
          Password change was successful.
          </p>
          <div className="flex flex-row justify-center">
            <button onClick={()=>{clickSignInModal()}} className="font-bold text-grey-700">Go to Sign in page</button>
          </div>
        </div>

      </div>
      
  </>
  )


    
}

export default Password;