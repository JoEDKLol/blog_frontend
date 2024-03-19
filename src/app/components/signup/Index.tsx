'use client';
import { signIn } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";




const SignUp = (props: any) => {
  const { clickModal } = props;
  const router = useRouter()

  //signupmodal 
  function clickSignInModal(){
    props.clickModal();
    props.clickSignInModal();
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
        <form onSubmit={onSubmit} className="flex flex-col w-full h-full p-6 text-center bg-white rounded-3xl" autoComplete="none" >
          <div className=" flex w-full h-[50px] columns-2">
            <div className=" mb-3 text-3xl text-dark-grey-900 w-full ps-10" >Sign Up</div>
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
          
          <label htmlFor="email" className="mb-2 mt-3 text-m text-start text-grey-900">Email*</label>
          <input autoComplete="off" id="email" type="email" placeholder="Email" className=" border flex items-center w-full px-5 py-3 mr-2 text-m  focus:bg-grey-400 mb-3 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded"/>
          
          <label htmlFor="name" className="mb-2 text-m text-start text-grey-900">name*</label>
          <input autoComplete="off" id="name" type="text" placeholder="name"  className="border flex items-center w-full px-5 py-3 mb-3 mr-2 text-m  focus:bg-grey-400 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded"/>
          
          <label htmlFor="password" className="mb-2 text-m text-start text-grey-900">Password*</label>
          <input autoComplete="new-password" id="password" type="password" placeholder="Password" className="border flex items-center w-full px-5 py-3 mb-3 mr-2 text-m  focus:bg-grey-400 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded"/>
          
          <label htmlFor="repassword" className="mb-2 text-m text-start text-grey-900">Repassword*</label>
          <input autoComplete="new-password" id="repassword" type="password" placeholder="Repassword" className=" border flex items-center w-full px-5 py-3 mb-3 mr-2 text-m  focus:bg-grey-400 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded"/>

          <button className="border bg-gray-200 hover:bg-gray-400 text-black font-bold py-3 px-4 mt-3 rounded mb-5">
            Sign Up
          </button>

          <div className="flex flex-row justify-center">
            <p className="mb-3 text-sm leading-relaxed text-grey-900">Already have an account? 
            <button onClick={()=>{clickSignInModal()}} className="font-bold text-grey-700">SignIn</button></p>
            {/* <a  className="font-bold text-grey-700">Create an Account</a> */}
          </div>
          
         

        </form>

      </div>
      
  </>
  )


    
}

export default SignUp;