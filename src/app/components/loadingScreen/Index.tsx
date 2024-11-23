'use client';

import { useRecoilState } from 'recoil';
import styles from './LoadingScreenlayout.module.scss';
import { loadingBarState } from '@/app/store/loadingBar';

const LoadingScreen = (props: any) => {

  const [loadingBar, setLoadingBarState] = useRecoilState(loadingBarState);
  
  return(
    <>
    {
      (loadingBar)?(
        <div className= " flex flex-col overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
        <div className={styles.loaderStyle}></div>
      </div>
      ):""
    }
      
    </>
  )


    
}

export default LoadingScreen;