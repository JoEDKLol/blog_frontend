'use client';

import { useRecoilState } from 'recoil';
import styles from './LoadingScreenlayout.module.scss';
import { loadingBarState } from '@/app/store/loadingBar';
import { errorFilePageState } from '@/app/store/errorFile';

const ErrorFilePage = (props: any) => {

  const [errorFilePage, seterrorFilePage] = useRecoilState(errorFilePageState);
  function closeButtonHandler(){
    seterrorFilePage({screenYn:false, contents:""});
  }
  return(
    <>
    {
      (errorFilePage.screenYn)?(
        <div className= " flex flex-col overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full h-[calc(100%-1rem)] max-h-full">
        <div className="flex justify-center items-center w-[300px] h-[200px] border border-black bg-white rounded">
          <div className=''>
            <p className='text-center text-3xl mb-3'>File Upload Fail</p>
            <p className='text-center text-xl mb-3' >{errorFilePage.contents}</p>
            <p className='text-center'>
              <button className='className="border bg-gray-200 hover:bg-gray-400 text-black text-xl font-bold py-1 px-3 my-2 rounded'
              onClick={(e)=>{closeButtonHandler()}}
              >
                Close
              </button>
            </p>
          </div>
        </div>
      </div>
      ):""
    }
      
    </>
  )


    
}

export default ErrorFilePage;