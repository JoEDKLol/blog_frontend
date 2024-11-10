'use client';

import Image from "next/image";
import { IoDocumentsOutline } from "react-icons/io5";
import { IoDocumentOutline } from "react-icons/io5";
import { PiLineVerticalThin } from "react-icons/pi";
import { IoDocumentTextOutline } from "react-icons/io5";
import { useEffect, useState } from "react";
import { transactionAuth } from "@/app/utils/axiosAuth";
import { useRecoilState } from "recoil";
import { userState } from "@/app/store/user";
import Link from "next/link";

const SideBar = (props: any) => {
	const [user, setUser] = useRecoilState(userState);
	const [blogInfo, setblogInfo] = useState<any>({});
	
	const [majorCategories, setMajorCategories] = useState<any>([]);
	const [majorCategoryCnt, setMajorCategoryCnt] = useState<any>(0);
	const [subCategories, setSubCategories] = useState<any>([]);
	const [subCategoryCnt, setSubCategoryCnt] = useState<any>(0);

	useEffect(()=>{
		getblogInfo();
	},[]);

	async function getblogInfo(){
		const obj = {
			user_id : user.id,
			email : user.email,
			blog_seq :user.blog_seq,
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

	function searchCategories(majorSeq:any, subSeq:any){
		props.getBlogLists(1, user.blog_seq, majorSeq, subSeq);
	}

	return (
		<div className="absolute invisible  ms-4 w-[230px]
		2xl:visible xl:visible lg:visible md:invisible sm:invisible mt-5 rounded-lg
		p-2 border-2 ">
			<div className="">
				<div className="h-[225px] p-1 border-b">
					<p className="mt-1 truncate  ">{blogInfo.blogtitle}</p>
					<div className='ring-1 ring-gray-300 rounded-xl h-32 relative' >
						<Image 
						src=""
						quality={30}
						layout="fill"
						style={{ objectFit: "cover" , borderRadius: '8px' }}
						alt='' />
					</div> 
					<div className="flex justify-between border-b">
						<p className="mt-1 truncate  ">{blogInfo.name}</p>
						{
							(user.id.length > 0 && user.blog_seq+"" === props.blog_seq)?
							<Link href={"/blog/"+props.blog_seq + "/blogUpdate"}>
								<p className="mt-2 w-[10px] hover:text-lg" ><IoDocumentTextOutline /></p>
							</Link>
							:""
						}
					</div>
					<p className="mt-2 text-xs line-clamp-3">{blogInfo.introduction}</p>
				</div>
				
				<div className="mb-20">
					<p className="font-bold mt-1 border-b pb-1 mb-1">Categories</p>
					{
						(majorCategoryCnt>0)?
						majorCategories.map((majoritem:any, majorIndex:any)=>{
							return (
								<div key={majorIndex}>
									<div className="group flex justify-start mt-1 cursor-pointer"
									onClick={(e)=>searchCategories(majoritem.seq, -1)}
									>
										<p className="text-base me-1 group-hover:text-lg"><IoDocumentsOutline /></p>
										<p className="text-sm font-bold truncate group-hover:text-lg">{majoritem.categoryNm}</p>
									</div>
								{
									subCategories.map((item:any, index:any)=>{
										return (item.m_category_seq===majoritem.seq)?												
										(
											<div key={index} className="group flex justify-start text-sm mt-1 cursor-pointer"
											onClick={(e)=>searchCategories(majoritem.seq, item.seq)}>
												<p><PiLineVerticalThin /></p>
												<p className="text-base me-1 group-hover:text-base"><IoDocumentOutline /></p>
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
	);

};
export default SideBar;