import { userState } from "@/app/store/user";
import { transactionFile } from "@/app/utils/axiosFile";
import { getRandomNumber } from "@/app/utils/common";
import imageCompression from "browser-image-compression";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { CiSquarePlus } from "react-icons/ci";
import { RxUpdate } from "react-icons/rx";
import { CiSquareMinus } from "react-icons/ci";
import { transactionAuth } from "@/app/utils/axiosAuth";
import { useRouter } from "next/navigation";


const randomNum = getRandomNumber(10);
let majorUpFlag = false;
let majorIndex = -1;
let subUpFlag = false;
let subIndex = -1;
const BlogUpdateForm = (props: any) => {
	
	const [user, setUser] = useRecoilState(userState);
	const [img, setImg] = useState<any>("");
	const [majorCategories, setMajorCategories] = useState<any>([]);
	const [majorCategoryCnt, setMajorCategoryCnt] = useState<any>(0);
	const [subCategories, setSubCategories] = useState<any>([]);
	const [subCategoryCnt, setSubCategoryCnt] = useState<any>(0);
	const [majorCategoryText, setMajorCategoryText] = useState<any>("");
	const [subCategoryText, setSubCategoryText] = useState<any>("");
	const [subMajorCategoryText, setSubMajorCategoryText] = useState<any>("");
	const [userName, setUserName] = useState<any>("");
	const [blogName, setBlogName] = useState<any>("");
	const [introduction, setIntroduction] = useState<any>("");
	const [blogInfo, setBlogInfo] = useState<any>();	
	const [blogUpSuc, setBlogUpSuc] = useState<any>(false);
	const [imgDelete, setImgDelete] = useState<any>(false);
	
	const focusMajor = useRef<HTMLInputElement>(null);
  	const focusSub = useRef<HTMLInputElement>(null);



	

	// const [majo, setSubCategories] = useState<any>([]);

	useEffect(()=>{
		getblogInfo();
	},[])

	useEffect(()=>{
		// getblogInfo();
		let totalByte = 0;
		if(userName){
			for(let i =0; i < userName.length; i++) {
				let currentByte = userName.charCodeAt(i);
				if(currentByte > 128){
					totalByte += 2;
				}else {
					totalByte++;
				}
	
				if(totalByte > 80){
					setUserName(userName.substring(0, i));
					break;
				}
			}		
		}
		
	},[userName])

	useEffect(()=>{
		// getblogInfo();
		let totalByte = 0;
		if(blogName){
			for(let i =0; i < blogName.length; i++) {
				let currentByte = blogName.charCodeAt(i);
				if(currentByte > 128){
					totalByte += 2;
				}else {
					totalByte++;
				}

				if(totalByte > 80){
					setBlogName(blogName.substring(0, i));
					break;
				}
			}
		}
					
	},[blogName])

	useEffect(()=>{
		// getblogInfo();
		let totalByte = 0;
		if(introduction){
			for(let i =0; i < introduction.length; i++) {
				let currentByte = introduction.charCodeAt(i);
				if(currentByte > 128){
					totalByte += 2;
				}else {
					totalByte++;
				}

				if(totalByte > 500){
					setIntroduction(introduction.substring(0, i));
					break;
				}
			}
		}
					
	},[introduction])

	async function getblogInfo(){
		const obj = {
			user_id : user.id,
			email : user.email,
			blog_seq :user.blog_seq,
		}
		const blogInfoRes = await transactionAuth("get", "blog/blogInfo", obj, "", false); 
		
		setUserName(blogInfoRes.sendObj.resObj.blogInfo.name);
		setBlogName(blogInfoRes.sendObj.resObj.blogInfo.blogtitle);
		setIntroduction(blogInfoRes.sendObj.resObj.blogInfo.introduction);
		setImg(blogInfoRes.sendObj.resObj.blogInfo.blogimg_thumbnailimg);
		setBlogInfo(blogInfoRes.sendObj.resObj.blogInfo);
		
		if(Number(blogInfoRes.sendObj.resObj.majorCategoryCnt) > 0){
			setMajorCategoryCnt(blogInfoRes.sendObj.resObj.majorCategoryCnt);
			setMajorCategories(blogInfoRes.sendObj.resObj.majorCategory);
		}else{
			setMajorCategoryCnt(blogInfoRes.sendObj.resObj.majorCategoryCnt);
			setMajorCategories([]);
		}

		if(Number(blogInfoRes.sendObj.resObj.subCategoryCnt) > 0){
			setSubCategoryCnt(blogInfoRes.sendObj.resObj.subCategoryCnt);
			setSubCategories(blogInfoRes.sendObj.resObj.subCategory);
		}else{
			setSubCategoryCnt(blogInfoRes.sendObj.resObj.subCategoryCnt);
			setSubCategories([]);
		}
	}

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
				randomNum : randomNum, 
				blog_seq : user.blog_seq
			}

			console.log(obj);
	
			const imgUploadRes = await transactionFile("blog/fileUpload", compressedFile, obj, "", false);
			// console.log(imgUploadRes.sendObj);
	
			if(imgUploadRes.sendObj.success === 'y'){
				setImg(imgUploadRes.sendObj.resObj.img_url);
				setImgDelete(false);
			}else{
	
			}


		} catch (error) {
			console.log(error)
		}


		
		// 

	}

	async function addMajorItem(){
		
		if(majorCategoryText == null || majorCategoryText == undefined || majorCategoryText == ""){
			//focus
			focusMajor.current?.focus();
			return;
		}

		const majorCategory = {
			seq:majorIndex,
			blog_id:blogInfo._id,
			email : user.email,
			categoryNm:majorCategoryText,
			order:0,
			// majorIndex:majorIndexR
		}

		const addMajorRes = await transactionAuth("post", "blog/majorAdd", majorCategory, "", false); 
		// console.log(addMajorRes.sendObj.resObj);

		const indexM = majorCategories.findIndex((val:any) => val.seq === addMajorRes.sendObj.resObj.seq);
		
		if(indexM < 0){
			if(majorCategories.length === 0){
				setMajorCategoryCnt(1);
			}
			setMajorCategories([...majorCategories, addMajorRes.sendObj.resObj]);
			
		}
		
		setMajorCategoryText("");
		setSubCategoryText("");
		setSubMajorCategoryText("");
		majorIndex = -1;
		majorUpFlag = false;
	}				

	async function deleteMajorItem(){

		if(majorIndex < 0){
			return;
		}
		
		const majorCategory = {
			seq:majorIndex,
			blog_id:blogInfo._id,
			email : user.email,
			categoryNm:majorCategoryText,
			order:0,
			// majorIndex:majorIndexR
		}

		const deleteMajorRes = await transactionAuth("post", "blog/majorDelete", majorCategory, "", false); 
		// console.log(addMajorRes);

		if(deleteMajorRes.sendObj.success === "y"){
			getblogInfo();
		}

		majorIndex = -1;
		setMajorCategoryText("");
		setSubCategoryText("");
		setSubMajorCategoryText("");
		majorUpFlag = false;
	}

	function majorCategoryTextOnChange(e:any){
		if(!majorUpFlag){
			setMajorCategoryText(e.target.value);
		}else{
			setMajorCategoryText(e.target.value);
			setSubMajorCategoryText(e.target.value);
			
			const indext = majorCategories.findIndex((val:any) => 
				{
					if(val.seq){
						return val.seq === majorIndex
					}else{
						return val.majorIndex === majorIndex
					}
				}
			);
			
			majorCategories[indext].categoryNm = e.target.value;
			setMajorCategories(majorCategories);
		}
	}

	function addMajorItemTextUpdate(seq:any){
		majorUpFlag = true;
		let maJorCNm;
		
		majorIndex = seq;
		maJorCNm = majorCategories.filter((val:any, index:any) => val.seq === majorIndex)[0].categoryNm;
	
		subUpFlag = false;
		subIndex = -1;
		
		setMajorCategoryText(maJorCNm);
		setSubMajorCategoryText(maJorCNm);
		setSubCategoryText("");

	}
	
	function subCategoryTextOnChange(e:any){
		if(!subUpFlag){
			setSubCategoryText(e.target.value);
		}else{
			setSubCategoryText(e.target.value);
			
			const indext = subCategories.findIndex((val:any) => val.seq === subIndex);
			// console.log(indext);
			subCategories[indext].categoryNm = e.target.value;
			setSubCategories(subCategories);
		}
	}

	async function addSubItem(){
		
		if(subCategoryText == null || subCategoryText == undefined || subCategoryText == ""||majorIndex<0){
			focusSub.current?.focus();
			return;
		}

		const subCategory = {
			seq:subIndex,
			m_category_seq:majorIndex,
			blog_id:blogInfo._id,
			email : user.email,
			categoryNm:subCategoryText,
			order:0,
		}

		const addSubRes = await transactionAuth("post", "blog/subAdd", subCategory, "", false);

		const indexS = subCategories.findIndex((val:any) => val.seq === addSubRes.sendObj.resObj.seq);
		// console.log(indexM);

		if(indexS < 0){
			setSubCategories([...subCategories, addSubRes.sendObj.resObj]);
		}

		setSubCategoryText("");
		subUpFlag = false;
		subIndex = -1;
	}

	function addSubItemTextUpdate(seq:any){
		subUpFlag = true;
		subIndex = seq;

		const subCName = subCategories.filter((val:any, index:any)=>val.seq === seq)[0].categoryNm;
		setSubCategoryText(subCName);
	}

	async function deleteSubItem(){

		if(subIndex < 0){
			return; 
		}

		const subCategory = {
			seq:subIndex,
			m_category_seq:majorIndex,
			blog_id:blogInfo._id,
			email : user.email,
			categoryNm:subCategoryText,
			order:0,
		}

		const deleteSubRes = await transactionAuth("post", "blog/subDelete", subCategory, "", false); 
		// console.log(addMajorRes);

		if(deleteSubRes.sendObj.success === "y"){
			getblogInfo();
		}

		setMajorCategoryText("");
		setSubCategoryText("");
		subIndex = -1;
		subUpFlag = false;
	}

	

	async function saveBlogInfo(){
		const obj = {
			user_id : user.id,
			email : user.email,
			name : userName,
			blogtitle : blogName,
			introduction :introduction, 
			blogimg_thumbnailimg :img,
			blogimg : img,
			blog_seq :user.blog_seq,
			majorCategories:majorCategories,
			subCategories:subCategories,
			imgDelete:imgDelete
			// randomNum : randomNum
		}
		
		// console.log(obj);
		// return;
		const blogUpdateRes = await transactionAuth("post", "blog/blogUpdate", obj, "", false);
		// console.log(blogUpdateRes.sendObj.success );

		if(blogUpdateRes.sendObj.success === 'y'){
			// getblogInfo();
			setBlogUpSuc(true);
		}else{

		}
	}

	function blogOnchangeHandler(e:any){
		if(e.target.id === "username") setUserName(e.target.value);
		if(e.target.id === "blogname") setBlogName(e.target.value);
		if(e.target.id === "introduction") setIntroduction(e.target.value);
	}

	function refreshMajorItem(){
		majorUpFlag = false;
		majorIndex = -1;
		setMajorCategoryText("");
		focusMajor.current?.focus();
	}

	function refreshSubItem(){
		subUpFlag = false;
		subIndex = -1;
		setSubCategoryText("");
		focusSub.current?.focus();
	}
	const router = useRouter();
	function movetoPriList(){
		router.push('/blog/' + user.blog_seq)
	}
	
	function deleteImg(){
		setImg("");
		setImgDelete(true);
	}

	return(
		<>
			{
				blogUpSuc?(
					<div className="grid place-items-center grid-cols-1">
						<div className="flex justify-center  w-[470px]
						2xl:w-[570px] xl:w-[570px] lg:w-[570px] md:w-[570px] sm:w-[470px] mt-40 mb-4
						">
							<p className="text-xl font-bold">save successed</p>
						</div>
						<div className="flex justify-center  w-[470px]
						2xl:w-[570px] xl:w-[570px] lg:w-[570px] md:w-[570px] sm:w-[470px] 
						">

							<button className="ms-2 border bg-gray-200 hover:bg-gray-400 text-black font-bold py-1 px-4 rounded"
							onClick={()=>movetoPriList()}
							>
								Board list
							</button>

						</div>
					
					</div>
				):(
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
							onChange={(e)=>blogOnchangeHandler(e)}
							value={userName}
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
							onChange={(e)=>blogOnchangeHandler(e)}
							value={blogName}
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
							onChange={(e)=>blogOnchangeHandler(e)}
							value={introduction}
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
						<div className="me-1">
							<label className="cursor-pointer w-[130px] border hover:bg-gray-400 text-black font-bold py-1 px-4 rounded bg-gray-200" htmlFor="file_input">
									Upload File
							</label>
							<input className="w-[340px]
							2xl:w-[440px] xl:w-[440px] lg:w-[440px] md:w-[440px] sm:w-[340px]
							text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer
							hidden
							" id="file_input" type="file"
							accept="image/*" 
							onChange={(e)=>fileUploadHandler(e)}
							
							>
							</input>

						</div>
						<div>
							<label className="cursor-pointer w-[130px] border hover:bg-gray-400 text-black font-bold py-1 px-4 rounded bg-gray-200"
							htmlFor="img_delete"
							onClick={()=>deleteImg()}
							>
								Delete
							</label>
						</div>
					</div>
					<div className="font-bold w-[470px] h-[30px] text-start visible ps-2
								2xl:h-[0px] xl:h-[0px] lg:h-[0px] md:h-[0px] sm:h-[30px]
								2xl:invisible xl:invisible lg:invisible md:invisible sm:visible
								">
					Categories
					
					
					</div>
					<div className="flex justify-center border-b border-gray-200 pb-2 mb-2">
						<div className="font-bold w-[0px] invisible
						2xl:w-[100px] xl:w-[100px] lg:w-[100px] md:w-[100px] sm:w-[0px]
						2xl:visible xl:visible lg:visible md:visible sm:invisible
						">Categories
						</div>
						<div className="flex justify-center w-[470px]">
							<div className="w-[235px] border-e border-gray-200 text-bold">Major
								<div className="flex justify-center">	
								<input 
								className="relative flex flex-col w-[155px] mt-1 rounded-lg bg-white shadow-sm border border-slate-200
								px-2"
								onChange={(e)=>majorCategoryTextOnChange(e)}
								value={majorCategoryText}
								ref={focusMajor}
								autoComplete="off" id="majorCategoryText" type="text"
								></input>
								<span className="inline-block text-[23px] pt-1 ms-1
								cursor-pointer
								"
								onClick={()=>addMajorItem()}>
								<CiSquarePlus />
								</span>
								<span className="inline-block text-[23px] pt-1 
								cursor-pointer
								"
								onClick={()=>deleteMajorItem()}>
								<CiSquareMinus />
								</span>
								<span className="inline-block text-[17px] ps-1 pt-2
								cursor-pointer
								"
								onClick={()=>refreshMajorItem()}
								>
								<RxUpdate />
								</span>
								</div>
								{
	
									(majorCategoryCnt > 0) ?
									
									<div className="relative flex flex-col w-[225px] mt-1 rounded-lg bg-white shadow-sm border border-slate-200">
										<nav className="flex flex-col p-1">
											{
												majorCategories.map((item:any, index:any)=>{
													return (
													<div key={index} className="flex justify-between">	
														<div 
														role="button" 
														className="w-[225px] text-slate-800 flex items-center rounded-md p-1 transition-all hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100"
														onClick={()=>addMajorItemTextUpdate(item.seq)}
														>
														{item.categoryNm}
														</div>
													</div>
													)
												})
												
											}
											
										</nav>
									</div>
									:""
								}
							</div>
							<div className="w-[235px] ms-2 text-bold">Sub
								<div className="flex justify-center">	
									<input 
									className="relative flex flex-col w-[225px] mt-1 rounded-lg bg-white shadow-sm border border-slate-200
									px-2"
									value={subMajorCategoryText}
									autoComplete="off" id="subCategoryText" type="text"
									disabled
									></input>
									
								</div>
								<div className="flex justify-center">	
									<input 
									className="relative flex flex-col w-[155px] mt-1 rounded-lg bg-white shadow-sm border border-slate-200
									px-2"
									onChange={(e)=>subCategoryTextOnChange(e)}
									value={subCategoryText}
									ref={focusSub}
									autoComplete="off" id="subCategoryText" type="text"
									></input>
									<span className="inline-block text-[23px] pt-1 ms-1
									cursor-pointer
									"
									onClick={()=>addSubItem()}>
									<CiSquarePlus />
									</span>
									<span className="inline-block text-[23px] pt-1 
									cursor-pointer
									"
									onClick={()=>deleteSubItem()}>
									<CiSquareMinus />
									</span>
									<span className="inline-block text-[17px] ps-1 pt-2
									cursor-pointer
									"
									onClick={()=>refreshSubItem()}
									>
									<RxUpdate />
									</span>
								</div>
								{
	
									(subCategories.filter( (val:any, index:any) => val.m_category_seq === majorIndex).length > 0) ? 
	
									<div className="relative flex flex-col w-[225px] mt-1 rounded-lg bg-white shadow-sm border border-slate-200">
										<nav className="flex flex-col p-1">
											{
												subCategories.map((item:any, index:any)=>{
													return (item.m_category_seq===majorIndex)?												
													
													(
													
														<div key={index} className="flex justify-between">	
															<div 
															role="button" 
															className="w-[225px] text-slate-800 flex items-center rounded-md p-1 transition-all hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100"
															onClick={()=>addSubItemTextUpdate(item.seq)}
															>
															{item.categoryNm}
															</div>
														</div>
													):""
												})
												
											}
											
										</nav> 
									</div>
									:""
									}
									
							</div>
	
							
						</div>
								
					</div>
	
					<div className="flex justify-end 
					w-[470px]
					2xl:w-[570px] xl:w-[570px] lg:w-[570px] md:w-[570px] sm:w-[470px]
					mt-2 mb-5">
						<button className="
						border hover:bg-gray-400 text-black font-bold py-1 px-4 rounded bg-gray-200
						"
						onClick={()=>saveBlogInfo()}
						>save
						</button>
					</div>
				 </div>
				)
			}
			 

		</>
	)
};
export default BlogUpdateForm;