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

	useEffect(()=>{
		getblogInfo();
	},[]);

	async function getblogInfo(){
		const obj = {
			blog_seq :props.blog_seq,
		}
		const blogInfoRes = await transactionAuth("get", "blog/blogInfo", obj, "", false);
		
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

		console.log(obj);

		setMajorIndex(majorSeqP);
		setChooseMajor(majorSeqP);

		// setChooseMajor(majorSeqP);
		setChooseSub(subSeqP);
		// console.log("side bar 조회", obj);
		setPriSearchKeyword(obj);
		
		// return;
		const bloglistObj = await transaction("get", "blog/bloglistEa", obj, "", false);
		

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

	function changeMajorCategory(e:any){
		
		const majorSeq = Number(e.target.value);
		// console.log(majorCategories.find((e:any)=>e.seq === majorSeq));
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
		<div className="block w-[100%] 2xl:hidden xl:hidden lg:hidden md:block sm:block" >
			<div className="flex justify-start pt-6  ps-16 ms-[0px] 2xl:ms-[200px] xl:ms-[200px] lg:ms-[200px] md:ms-[0px] sm:ms-[0px]">
				<p className="font-bold border-b-2 border-b-black w-[90%]">Categories</p>
			</div>
			<div className="flex justify-start pt-6  ps-16 ms-[0px] 2xl:ms-[200px] xl:ms-[200px] lg:ms-[200px] md:ms-[0px] sm:ms-[0px]">
				<p className=" border-black w-[90%]
				">
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
			<div className="">
				<div className="h-[100%] p-1 border-b">
					<p className="mt-1 mb-1 font-bold truncate  ">{blogInfo.blogtitle}</p>
					<div className='w-[100%] h-[200px] ring-2 ring-black rounded-xl relative' >
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
						<p className="mt-1 mb-1 font-bold truncate  ">{blogInfo.name}</p>
						{
							(props.user.id.length > 0 && props.user.blog_seq+"" === props.blog_seq)?
							<div className="flex justify-center">
								<Link href={"/blog/"+props.blog_seq + "/blogUpdate"}>
									<p className="mt-2 w-[10px] text-lg hover:text-xl" ><IoDocumentTextOutline /></p>
								</Link>
								{/* <Link href={"/blog/"+props.blog_seq + "/blogUpdate"}>
									<p className="mt-2 ms-3 w-[10px] text-[19px] hover:text-xl" ><TfiWrite /></p>
								</Link> */}
							</div>
							:""
						}
						
					</div>
					<div className=" mt-2 text-xs line-clamp-7 break-all">{blogInfo.introduction}</div>
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