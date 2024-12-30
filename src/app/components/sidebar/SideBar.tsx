'use client';

import Image from "next/image";
import { IoDocumentsOutline } from "react-icons/io5";
import { IoDocumentOutline } from "react-icons/io5";
import { PiLineVerticalThin } from "react-icons/pi";
import { IoDocumentTextOutline } from "react-icons/io5";
import { CgFileDocument } from "react-icons/cg";
import { TfiWrite } from "react-icons/tfi";

import { useEffect, useState } from "react";
import { transactionAuth } from "@/app/utils/axiosAuth";
import { useRecoilState } from "recoil";
import Link from "next/link";
import { priSearchKeywordState } from "@/app/store/priSearchkeyword";
import { priSearchResArrState } from "@/app/store/priSearch";

import { transaction } from "@/app/utils/axios";
import { loadingBarState } from "@/app/store/loadingBar";
import { errorPageState } from "@/app/store/error";

const SideBar = (props: any) => {
	const [blogInfo, setblogInfo] = useState<any>({});
	
	const [majorCategories, setMajorCategories] = useState<any>([]);
	const [majorCategoryCnt, setMajorCategoryCnt] = useState<any>(0);
	const [subCategories, setSubCategories] = useState<any>([]);
	const [subCategoryCnt, setSubCategoryCnt] = useState<any>(0);

	const [priSearchKeyword, setPriSearchKeyword] = useRecoilState(priSearchKeywordState);
	const [priSearchRes, setPriSearchRes] = useRecoilState(priSearchResArrState);

	const [majorIndex, setMajorIndex] = useState<any>(-1);

	const [chooseMajor, setChooseMajor] = useState<any>("2");
	const [chooseSub, setChooseSub] = useState<any>(0);

	const [loadingBar, setLoadingBarState] = useRecoilState(loadingBarState);
	const [errorPage, setErrorPage] = useRecoilState(errorPageState);


	useEffect(()=>{
		getblogInfo();
	},[]);

	async function getblogInfo(){
		const obj = {
			blog_seq :props.blog_seq,
		}
		const blogInfoRes = await transaction("get", "blog/blogInfo", obj, "", false, true, setLoadingBarState, setErrorPage);
		if(blogInfoRes.sendObj.success === 'y'){

			setblogInfo(blogInfoRes.sendObj.resObj.blogInfo);
			if(Number(blogInfoRes.sendObj.resObj.majorCategoryCnt) > 0){
				setMajorCategoryCnt(blogInfoRes.sendObj.resObj.majorCategoryCnt);
				setMajorCategories(blogInfoRes.sendObj.resObj.majorCategory);
			}

			if(Number(blogInfoRes.sendObj.resObj.subCategoryCnt) > 0){
				setSubCategoryCnt(blogInfoRes.sendObj.resObj.subCategoryCnt);
				setSubCategories(blogInfoRes.sendObj.resObj.subCategory);
			}
		}
		
	}

	async function searchCategories(majorSeqP:any, subSeqP:any, majorNameP:any, subNameP:any){
		
		let obj = {
			blog_seq:props.blog_seq,
			keyword:priSearchKeyword.keyword, 
			majorSeq:majorSeqP,
			majorName:majorNameP, 
			subSeq:subSeqP,
			subName:subNameP,
			currentPage:1,
			searchYn:true
		}

		// console.log(obj);

		setMajorIndex(majorSeqP);
		setChooseMajor(majorSeqP);

		// setChooseMajor(majorSeqP);
		setChooseSub(subSeqP);
		// console.log("side bar 조회", obj);
		setPriSearchKeyword(obj);
		
		// return;
		// const bloglistObj = await transaction("get", "blog/bloglistEa", obj, "", false);

		const bloglistObj = await transaction("get", "blog/bloglistEa", obj, "", false, true, setLoadingBarState, setErrorPage);
		
		if(bloglistObj.sendObj.success === 'y'){
			setPriSearchRes(bloglistObj.sendObj.resObj.list);
			let obj2 = {
				blog_seq:props.blog_seq,
				keyword:priSearchKeyword.keyword, 
				majorSeq:majorSeqP,
				majorName:majorNameP, 
				subSeq:subSeqP,
				subName:subNameP,
				currentPage:2,
				searchYn:true
			}
			setPriSearchKeyword(obj2);
		}
	}

	function changeMajorCategory(e:any){
		
		const majorSeq = Number(e.target.value);

		if(majorSeq > -1){
			const selectedMajorcategory = majorCategories.find((e:any)=>e.seq === majorSeq);
			searchCategories(majorSeq, -1, selectedMajorcategory.categoryNm, "");
		}else{
			searchCategories(-1, -1, "", "");
		}
	}
	function changeSubCategory(e:any){
		const subSeq = Number(e.target.value);
		
		if(subSeq > -1){
			const selectedMajorcategory = majorCategories.find((e:any)=>e.seq === majorIndex);
			const selectedSubcategory = subCategories.find((e:any)=>e.seq === subSeq);
			searchCategories(majorIndex, subSeq, selectedMajorcategory.categoryNm, selectedSubcategory.categoryNm);
		}else{
			const selectedMajorcategory = majorCategories.find((e:any)=>e.seq === majorIndex);
			searchCategories(majorIndex, -1, selectedMajorcategory.categoryNm, "");
		}
		// setChooseSub(Number(e.target.value));

	}

	return (
		<>
		<div className="block w-[100%] 2xl:hidden xl:hidden lg:hidden md:block sm:block " >

			<div className="pt-6
			 mx-[16px] 2xl:ms-[200px] xl:ms-[200px] lg:ms-[200px] md:mx-[16px] sm:mx-[16px]">
				
				
				
				<div className="flex justify-center
				 2xl:justify-start xl:justify-start lg:justify-start md:justify-start sm:justify-center
				">
					<div className="">
						<div className='w-[200px] h-[200px] me-4 ring-2 ring-black rounded-xl relative' >
								{blogInfo.blogimg?
								(<Image 
									src={blogInfo.blogimg}
									quality={30}
									layout="fill"
									style={{ objectFit: "cover" , borderRadius: '12px' }}
									alt='' />):""
								}		
						</div> 
					</div>
					<div className="w-[90%] hidden 
					2xl:hidden xl:hidden lg:block md:block sm:hidden
					">
						<div className="flex justify-start mb-2 w-[90%]">
							<p className="font-bold truncate me-2 ">{blogInfo.blogtitle}</p>
							
						</div>
						<div className="">
							<p className="mb-1 font-bold truncate  ">{blogInfo.name}</p>
						</div>
						{/* <div className=" mt-2 text-xs line-clamp-7 break-all">{blogInfo.introduction}</div> */}
						<div className="w-[90%] ">
								{/* <textarea  
								value={blogInfo.introduction}
								readOnly={true}
								className="overflow-hidden block w-full p-1 h-[150px] resize-none text-sm bg-grey-200 focus:border-black text-gray-900 outline-none rounded
								"/> */}

							<div className="whitespace-pre-line mt-2 text-sm break-all">{blogInfo.introduction}</div>

						</div>

					</div>
				</div>

				<div className="w-[100%] mt-5
					block 2xl:hidden xl:hidden lg:hidden md:hidden sm:block
					">
					<div className="flex justify-start mb-2 w-[90%]">
						<p className="font-bold truncate me-2 ">{blogInfo.blogtitle}</p>
						
					</div>
					<div className="">
						<p className="mb-1 font-bold truncate  ">{blogInfo.name}</p>
					</div>
					{/* <div className=" mt-2 text-xs line-clamp-7 break-all">{blogInfo.introduction}</div> */}
					<div className="w-[90%]">
						{/* <textarea  
						value={blogInfo.introduction + ""}
						
						readOnly={true}
						className="block w-full h-[150px] p-1 resize-none text-xs bg-grey-200 focus:border-black text-gray-900 outline-none rounded
						"/> */}
						<div className="whitespace-pre-line mt-2 text-sm break-all">{blogInfo.introduction}</div>
					</div>

				</div>

				<div className="flex justify-center mt-2 p-1">
						<Link href={"/blog/"+props.blog_seq + "/aboutme"}>
						<button className="border me-2 bg-gray-200 hover:bg-gray-400 text-black text-xs font-bold py-0.5 px-1 my-1 rounded"
						>
							About me
						</button>
						</Link>
						{
						(props.user.id.length > 0 && props.user.blog_seq+"" === props.blog_seq)?
						<>
							<Link href={"/blog/"+props.blog_seq + "/aboutmeupdate"}>
							<button className="border bg-gray-200 hover:bg-gray-400 text-black text-xs font-bold py-0.5 px-1 my-1 rounded"
								>
								AboutMe Update
							</button>
							</Link>
							<Link href={"/blog/"+props.blog_seq + "/blogUpdate"}>
							<button className="border ms-2 bg-gray-200 hover:bg-gray-400 text-black text-xs font-bold py-0.5 px-1 my-1 rounded"
								>
								Blog Update
							</button>
							</Link>
							<Link href={"/blog/"+props.blog_seq + "/write"}>
							<button className="border ms-1 bg-gray-200 hover:bg-gray-400 text-black text-xs font-bold py-0.5 px-1  my-1 rounded"
								>
								Blog Write
							</button>
							</Link>

						</>
							
						:""
						}
				</div>	

			</div>


			<div className="flex justify-start pt-6  
			mx-[16px] 2xl:ms-[200px] xl:ms-[200px] lg:ms-[200px] md:mx-[16px] sm:mx-[16px]
			">
				<p className="font-bold border-b-2 border-b-black w-[100%]">Categories</p>
			</div>
			<div className="flex justify-start pt-6  
			mx-[16px] 2xl:ms-[200px] xl:ms-[200px] lg:ms-[200px] md:mx-[16px] sm:mx-[16px]
			">
				<p className=" border-black w-[100%]">
				<select value={chooseMajor} id="majorCategory" className="border border-gray-300 text-gray-900 text-sm rounded focus:border-black w-[48%] px-3 py-2 outline-none"
					onChange={(e)=>changeMajorCategory(e)}
					>
						<option value="-1">Choose a MajorCategory</option>
						{
							majorCategories.map((item:any, index:any)=>{
								return (
									<option key={index} value={item.seq}>{item.categoryNm}</option>
								)
							})
						}
					</select>
					<select value={chooseSub} id="subCategory" className="border border-gray-300 text-gray-900 text-sm rounded focus:border-black w-[48%] ms-2 px-3 py-2 outline-none"
					onChange={(e)=>changeSubCategory(e)}
					>
						<option>Choose a SubCategory</option>
						{
							subCategories.map((item:any, index:any)=>{
								return (item.m_category_seq===majorIndex)?												
								(
									<option key={index} value={item.seq}>{item.categoryNm}</option>
								):""
							})
						}
					</select>
				</p>
          </div>
		</div> 

		<div className="absolute invisible  ms-4 w-[230px]
		2xl:visible xl:visible lg:visible md:invisible sm:invisible mt-5 rounded-lg
		p-2 border-2 border-black">
			<div className=" ">
				<div className="h-[100%] p-1 border-b">
					<div className="flex justify-between mb-2">
						<p className="font-bold truncate  ">{blogInfo.blogtitle}</p>
						{/* {
							(props.user.id.length > 0 && props.user.blog_seq+"" === props.blog_seq)?
							<div className="group">
								<Link href={"/blog/"+props.blog_seq + "/blogUpdate"}>
									<p className="mt-1 me-1 w-[10px] text-lg hover:text-xl" ><IoDocumentTextOutline /></p>
								</Link>
								<p className="text-center absolute left-[140px] scale-0 transition-all 
								w-[80px] top-[6px] border rounded bg-yellow-50 text-xs text-black 
								group-hover:scale-100">
									Blog Update</p>
							</div>
							:""
						} */}
					</div>
					

					<div className='w-[200px] h-[200px] ring-2 ring-black rounded-xl relative' >
						{blogInfo.blogimg?
						(<Image 
							src={blogInfo.blogimg}
							quality={30}
							layout="fill"
							style={{ objectFit: "cover" , borderRadius: '12px' }}
							alt='' />):""
						}
						
					</div> 
					<div className="flex justify-between border-b">
						<p className="mt-2 mb-1 font-bold truncate  ">{blogInfo.name}</p>
					</div>
					<div className="whitespace-pre-line mt-2 text-xs break-all">{blogInfo.introduction}</div>
				</div>
				
					<div className="flex justify-center border-b p-1">
						<Link href={"/blog/"+props.blog_seq + "/aboutme"}>
						<button className="border me-1 bg-gray-200 hover:bg-gray-400 text-black text-[10px] font-bold py-0.5 px-1 my-1 rounded"
						>
							About me
						</button>
						</Link>
						{
						(props.user.id.length > 0 && props.user.blog_seq+"" === props.blog_seq)?
							<>
								<Link href={"/blog/"+props.blog_seq + "/aboutmeupdate"}>
								<button className="border bg-gray-200 hover:bg-gray-400 text-black text-[10px] font-bold py-0.5  my-1 rounded"
									>
									AboutMe Update
								</button>
								</Link>
								<Link href={"/blog/"+props.blog_seq + "/blogUpdate"}>
								<button className="border ms-1 bg-gray-200 hover:bg-gray-400 text-black text-[10px] font-bold py-0.5  my-1 rounded"
									>
									Blog Update
								</button>
								</Link>
								<Link href={"/blog/"+props.blog_seq + "/write"}>
								<button className="border ms-1 bg-gray-200 hover:bg-gray-400 text-black text-[10px] font-bold py-0.5  my-1 rounded"
									>
									Blog Write
								</button>
								</Link>
							</>
							
						:""
						}
				</div>	
				
				
				
				<div className="mb-10">
					<p className="font-bold mt-1 border-b pb-1 mb-2">Categories</p>
					<div >
						<div className="group flex justify-start mt-1 cursor-pointer"
						onClick={(e)=>searchCategories(-1, -1, "all", "")}
						>
							<p className="text-base me-1 group-hover:text-lg"><CgFileDocument /></p>
							<p className="text-sm font-bold truncate group-hover:text-lg">all</p>
						</div>
					
					</div>
					{
						(majorCategoryCnt>0)?
						majorCategories.map((majoritem:any, majorIndex:any)=>{
							return (
								<div key={majorIndex}>
									<div className="group flex justify-start mt-1 cursor-pointer"
									onClick={(e)=>searchCategories(majoritem.seq, -1, majoritem.categoryNm, "")}
									>
										<p className="text-base me-1 group-hover:text-lg"><IoDocumentsOutline /></p>
										<p className="text-sm font-bold truncate group-hover:text-lg">{majoritem.categoryNm}</p>
									</div>
								{
									subCategories.map((item:any, index:any)=>{
										return (item.m_category_seq===majoritem.seq)?												
										(
											<div key={index} className="group flex justify-start text-sm mt-1 cursor-pointer"
											onClick={(e)=>searchCategories(majoritem.seq, item.seq, majoritem.categoryNm, item.categoryNm)}>
												<p><PiLineVerticalThin /></p>
												<p className="text-base me-1 group-hover:text-lg"><IoDocumentOutline /></p>
												<p className="text-sm truncate group-hover:text-base">{item.categoryNm}</p>
											</div>
										):""
									})
								}
								</div>
							)
						}):"" 
					}
							

				</div>
			</div>
		</div>
		</>
	);

};
export default SideBar;