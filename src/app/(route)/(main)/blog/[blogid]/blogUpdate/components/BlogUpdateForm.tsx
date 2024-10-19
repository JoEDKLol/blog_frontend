import { userState } from "@/app/store/user";
import { transactionFile } from "@/app/utils/axiosFile";
import { getRandomNumber } from "@/app/utils/common";
import imageCompression from "browser-image-compression";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import sharp from "sharp";



const randomNum = getRandomNumber(10);
const BlogUpdateForm = (props: any) => {
	const [user, setUser] = useRecoilState(userState);
	const [img, setImg] = useState<any>();
	const [majorCategories, setMajorCategories] = useState<any>([]);
	const [subCategories, setSubCategories] = useState<any>([]);

	useEffect(()=>{
		let arrTest=[];
		arrTest.push({name:"name1"});
		arrTest.push({name:"name2"});
		arrTest.push({name:"name3"});
		console.log(arrTest);
		setMajorCategories(arrTest);
	},[])

	async function fileUploadHandler(e:any){

		// - 백앤드 이미지 저장 사용 temp 저장 후 url 반환 
    // - 저장 누르면 해당 temp 삭제 및 실제 저장
		// - 새로운 이미지 선택시 기존 temp 삭제 및 새로 temp 저장 
		// - 사이즈 조정 
		const file = e.target.files[0];
		
    if(!file) return;


		const options = {
			maxSizeMB: 0.2, // 이미지 최대 용량
			maxWidthOrHeight: 1920, // 최대 넓이(혹은 높이)
			useWebWorker: true,
		};

		try {

			const compressedFile = await imageCompression(file, options);
			
			const obj = {
				user_id : user.id,
				email : user.email,
				randomNum : randomNum
			}
	
			const imgUploadRes = await transactionFile("blog/fileUpload", compressedFile, obj, "", false);
			console.log(imgUploadRes.sendObj);
	
			if(imgUploadRes.sendObj.success === 'y'){
				setImg(imgUploadRes.sendObj.resObj.img_url);
			}else{
	
			}


		} catch (error) {
			console.log(error)
		}


		
		// 

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
				<div className="mb-2">
					<div className='ring-1 w-[230px] h-[225px] ring-gray-300 rounded-xl relative ' >
						{img ? (
							
									<Image 
									src={img}
									quality={30}
									layout="fill"
									style={{ objectFit: "cover" , borderRadius: '8px' }}
									alt='' />
							) : ""
						}
					</div>
				</div>
				<div className="flex justify-center border-b border-gray-200 pb-2 mb-2">
					<label className="w-[130px] border hover:bg-gray-400 text-black font-bold py-1 px-4 rounded bg-gray-200" htmlFor="file_input">
							Upload File
					</label>
					<input className="w-[340px]
					2xl:w-[440px] xl:w-[440px] lg:w-[440px] md:w-[440px] sm:w-[340px]
					text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer
					invisible
					" id="file_input" type="file"
					accept="image/*" 
					onChange={(e)=>fileUploadHandler(e)}
					>
					</input>
					
				</div>
				<div className="font-bold w-[470px] h-[30px] text-start visible ps-2
							2xl:h-[0px] xl:h-[0px] lg:h-[0px] md:h-[0px] sm:h-[30px]
							2xl:invisible xl:invisible lg:invisible md:invisible sm:visible
							">
				Categories</div>
				<div className="flex justify-center border-b border-gray-200 pb-2 mb-2">
					<div className="font-bold w-[0px] invisible
					2xl:w-[100px] xl:w-[100px] lg:w-[100px] md:w-[100px] sm:w-[0px]
					2xl:visible xl:visible lg:visible md:visible sm:invisible
					">Categories
					</div>
					<div className="flex justify-center w-[470px]">
						<div className="w-[235px] border-e border-gray-200 text-bold">Major
						
							<div className="relative flex flex-col w-[225px] mt-1 rounded-lg bg-white shadow-sm border border-slate-200">
								<nav className="flex flex-col p-1">
									
									{
										// blogList.map((item:any, index:any)=>{
										majorCategories.map((item:any, index:any)=>{
											return (
											<div key={index}
											role="button"
											className="text-slate-800 flex items-center rounded-md p-1 transition-all hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100"
											>
											{item.name}
											</div>
											)
									})
										
									}
									
									
									{/* <div
										role="button"
										className="text-slate-800 flex items-center rounded-md p-1 transition-all hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100"
									>
										Inbox
									</div> */}
									
									{/* <div
									role="button"
									className="text-slate-800  flex w-full items-center rounded-md p-3 transition-all hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100"
									>
										Trash
									</div> */}
									{/* <div
										role="button"
										className="text-slate-800 flex w-full items-center rounded-md p-3 transition-all hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100"
									>
										Settings
									</div> */}
								</nav>
							</div>
							
						</div>
						<div className="w-[235px] ms-2 text-bold">Sub

						</div>
					</div>
				</div>

			 </div>
		</>
	)
};
export default BlogUpdateForm;