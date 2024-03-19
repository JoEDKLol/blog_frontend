'use client';
import { signIn } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";




const Login = (props: any) => {
  const { clickModal } = props;
  const router = useRouter()

  //signupmodal 
  function clickSignUpModal(){
    props.clickModal();
    props.clickSignUpModal();
  }

  //passwordmodal 
  function clickPasswordModal(){
    props.clickModal();
    props.clickPasswordModal();
  }



  

  async function onSubmit(event: any) {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;

    const result:any = await signIn('credentials', {
      email,
      password,
      redirect:false,
      callbackUrl:"/"
      // 필요한 경우 다른 필드도 추가할 수 있습니다.
    });

    // console.log(result);
    if (result.error) {
      console.log('오류??');
      // 로그인 실패 시 오류 메시지를 처리할 수 있습니다.
      // console.error(result.error);
    }else{
      console.log(result.url);
      console.log('성공');
      // router.push(result.url); 
      router.push("/blog");
    }
  }

  return(
    <>
      <div className= "border border-black w-[400px] h-[600px] rounded bg-white font-sans"
      // onClick={clickModal}
      >
      {/* <!-- Modal content --> */}
        <form onSubmit={onSubmit} className="flex flex-col w-full h-full p-6 text-center bg-white rounded-3xl">
          
          <div className="flex w-full h-full columns-2">
            <div className=" mb-3 text-3xl text-dark-grey-900 w-full ps-10" >Sign In</div>
            {/* <div className=" mb-3 text-3xl text-dark-grey-900" >Sign In</div> */}
            {/* <div className=" flex justify-center mb-3 text-3xl text-dark-grey-900" >Sign In</div> */}
            <div className="flex justify-center h-[20px]">
                <button type="button" 
                  onClick={()=>{props.clickModal()}}
                  className="bg-white  rounded-md inline-flex items-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                  <svg className="h-[20px] w-[20px]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
          </div>
          <label htmlFor="email" className="mb-2 mt-10 text-m text-start text-grey-900">Email*</label>
          <input id="email" type="email" placeholder="Email" className="border flex items-center w-full px-5 py-3 mr-2 text-m outline-none focus:bg-grey-400 mb-7 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded"/>
          
          <label htmlFor="password" className="mb-2 text-m text-start text-grey-900">Password*</label>
          <input id="password" type="password" placeholder="Password" className="border flex items-center w-full px-5 py-3 mb-3 mr-2 text-m  outline-none focus:bg-grey-400 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded"/>
          
          <div className="flex justify-end mb-8">
            <button onClick={()=>{clickPasswordModal()}} className="font-bold text-grey-700">Forget password?</button>
          </div>

          <button className="border bg-gray-200 hover:bg-gray-400 text-black font-bold py-3 px-4 rounded mb-5">
            Sign In
          </button>

          <div className="flex flex-row justify-center">
            <p className="mb-3 text-sm leading-relaxed text-grey-900">Not registered yet? 
            <button onClick={()=>{clickSignUpModal()}} className="font-bold text-grey-700">Create an Account</button>
            </p>
          </div>
          
          <div className="flex items-center">
            <hr className="h-0 border-b border-solid border-grey-500 grow"/>
            <p className="mx-4 text-grey-600">or</p>
            <hr className="h-0 border-b border-solid border-grey-500 grow"/>
          </div>
          <div className="flex items-center justify-center w-full py-3 mt-4
          text-black font-bold border
          duration-300 rounded text-grey-900 bg-gray-200 hover:bg-gray-400 focus:ring-4 focus:ring-grey-300"
          onClick={
            ()=>signIn('google')
          }>
            {/* <a className="  > */}
              <img className="h-5 mr-2" src="https://raw.githubusercontent.com/Loopple/loopple-public-assets/main/motion-tailwind/img/logos/logo-google.png" alt=""/>
              Sign in with Google
            {/* </a> */}
          </div>
        </form>

      </div>
      
  </>
  )


    
}

export default Login;