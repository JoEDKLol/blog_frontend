import Image from "next/image";
import { useState } from "react";


const BlogUpdateForm = (props: any) => {
	
	const [img, setImg] = useState<any>();
0
	function fileUploadHandler(e:any){

		// - 백앤드 이미지 저장 사용 temp 저장 후 url 반환 
    // - 저장 누르면 해당 temp 삭제 및 실제 저장
		// - 새로운 이미지 선택시 기존 temp 삭제 및 새로 temp 저장 
		// - 사이즈 조정 


	}
	
	return(
		<>
			 <div className="grid place-items-center grid-cols-1">
				<div className="font-bold w-[470px] h-[30px] text-start visible ps-2
							2xl:h-[0px] xl:h-[0px] lg:h-[0px] md:h-[0px] sm:h-[30px]
							2xl:invisible xl:invisible lg:invisible md:invisible sm:visible
							">
				User Name</div>
				<div className="flex justify-center border-b border-gray-200 pb-2 mb-2">
					<div className="font-bold w-[0px] invisible
					2xl:w-[100px] xl:w-[100px] lg:w-[100px] md:w-[100px] sm:w-[0px]
					2xl:visible xl:visible lg:visible md:visible sm:invisible
					">User Name
					</div>
					<div className="w-[470px] ">
					<input 
					// ref={focusTitle} 
					// onChange={(e)=>title_onchangeHandler(e)}
					// value={title}
					autoComplete="off" id="username" type="text"  className="border w-full px-3 py-2 text-sm bg-grey-200 focus:border-black text-gray-900 outline-none rounded"/>
					</div>
				</div>

				<div className="font-bold w-[470px] h-[30px] text-start visible ps-2
							2xl:h-[0px] xl:h-[0px] lg:h-[0px] md:h-[0px] sm:h-[30px]
							2xl:invisible xl:invisible lg:invisible md:invisible sm:visible
							">
				Blog Name</div>
				<div className="flex justify-center border-b border-gray-200 pb-2 mb-2">
					<div className="font-bold w-[0px] invisible
					2xl:w-[100px] xl:w-[100px] lg:w-[100px] md:w-[100px] sm:w-[0px]
					2xl:visible xl:visible lg:visible md:visible sm:invisible
					">Blog Name
					</div>
					<div className="w-[470px] ">
					<input 
					// ref={focusTitle} 
					// onChange={(e)=>title_onchangeHandler(e)}
					// value={title}
					autoComplete="off" id="blogname" type="text"  className="border w-full px-3 py-2 text-sm bg-grey-200 focus:border-black text-gray-900 outline-none rounded"/>
					</div>
				</div>

				<div className="font-bold w-[470px] h-[30px] text-start visible ps-2
							2xl:h-[0px] xl:h-[0px] lg:h-[0px] md:h-[0px] sm:h-[30px]
							2xl:invisible xl:invisible lg:invisible md:invisible sm:visible
							">
				Introduction</div>
				<div className="flex justify-center border-b border-gray-200 pb-2 mb-2">
					<div className="font-bold w-[0px] invisible
					2xl:w-[100px] xl:w-[100px] lg:w-[100px] md:w-[100px] sm:w-[0px]
					2xl:visible xl:visible lg:visible md:visible sm:invisible
					">Introduction
					</div>
					<div className="w-[470px] ">
					<textarea  
					// ref={focusTitle} 
					// onChange={(e)=>title_onchangeHandler(e)}
					// value={title}
					id="introduction" rows={2}  className="border w-full px-3 py-2 text-sm bg-grey-200 focus:border-black text-gray-900 outline-none rounded"/>
					</div>
				</div>
				<div className="">
					{
						(img)?<>
							<Image
                src={URL.createObjectURL(img)} 
                width={80}
                height={80}
                sizes="80px"
                alt={img.name}
                placeholder="blur"
                blurDataURL={URL.createObjectURL(img)}
            />
						</>:""
					}
						
				</div>
				<div className="flex justify-center border-b border-gray-200 pb-2 mb-2">
					<label className="border hover:bg-gray-400 text-black font-bold py-1 px-4 rounded bg-gray-200" htmlFor="file_input">
							Upload File
					</label>
					<input className="w-[470px]
					text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer
					invisible
					" id="file_input" type="file"
					accept="image/*" 
					onChange={(e)=>fileUploadHandler(e)}
					>
					</input>
					
				</div>
				

			 </div>
		</>
	)
};
export default BlogUpdateForm;