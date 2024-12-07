'use client';
import styles from './confirmModal.module.scss';
const Confirm = (props: any) => {
	
	function confirmOnClickHandler(confirmYn:boolean){
		if(confirmYn){
			props.setConfirmRes(true);
		}else{
			props.setConfirmRes(false);
		}

		props.setShowConfirm(false);
	}

  return (
    <>
		<div id="default-modal" 
		tabIndex={-1} aria-hidden="true" className=
		{" flex flex-col overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"}>
    	{/* {props.children} */}
            <div className=' w-[250px] h-[120px] border border-black rounded bg-white'>
                <div className='h-[70px] flex justify-center items-center'>
									<p className='mx-2'>
											{props.confirmStr.showText}
									</p>
								</div>
								
								<div className='flex justify-center items-end'>
									<p>
										<button className='tracking-tight border bg-gray-200 hover:bg-gray-400 text-black font-bold py-1 px-4 rounded  me-4'
										onClick={()=>confirmOnClickHandler(true)}
										>Yes</button>
										<button className='tracking-tight border bg-gray-200 hover:bg-gray-400 text-black font-bold py-1 px-4 rounded '
										onClick={()=>confirmOnClickHandler(false)}
										>No</button>
									</p>
								</div>
                
            </div>
						
		</div>
    </>)
};

export default Confirm;