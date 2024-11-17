'use client';

import { userState } from "@/app/store/user";
import { transaction } from "@/app/utils/axios";
import { transactionAuth } from "@/app/utils/axiosAuth";
import DOMPurify from "dompurify";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import ReactQuill, { ReactQuillProps } from "react-quill";
import 'react-quill/dist/quill.snow.css';
import { useRecoilState } from "recoil";

interface ForwardedQuillComponent extends ReactQuillProps {
	forwardedRef: React.Ref<ReactQuill>;
}
const QuillNoSSRWrapper = dynamic(
	async () => {
		const { default: QuillComponent } = await import('react-quill')
		const { default: ImageCompress } = await import('quill-image-compress');
		QuillComponent.Quill.register('modules/imageCompress', ImageCompress);
		const Quill = ({ forwardedRef, ...props }: ForwardedQuillComponent) => (
			<QuillComponent ref={forwardedRef} {...props} />
		)
		return Quill
	},
	{ loading: () => <div>...loading</div>, ssr: false },
)


const PriBlogListDetail = (props: any) => {
	const [user, setUser] = useRecoilState(userState);
	const [blogDetailObj, setBlogDetailObj] =  useState<any>([]);
	const quillRef = useRef<any>(ReactQuill);

	const [majorCaName, setMajorCaName] = useState<any>(null);
	const [subCaName, setSubCaName] = useState<any>(null);

	const [deleteSuc, setDeleteSuc] = useState<any>(false);
	const [boardYn, setBoardYn]  = useState<any>(true);

	useEffect(()=>{
		getBlogDetail();
	},[])

	async function getBlogDetail(){
		const obj = {
			blog_seq:props.blog_seq,
			seq:props.seq
		}

		const bloglistObj = await transaction("get", "blog/blogDetail", obj, "", false);
		
		if(bloglistObj.sendObj.success === "y"){
			setBlogDetailObj(bloglistObj.sendObj.resObj.blogDetail);
			setMajorCaName(bloglistObj.sendObj.resObj.majorCaName)
			setSubCaName(bloglistObj.sendObj.resObj.subCaName)
		}else{
			console.log("There is not a board");
			setBoardYn(false);
			
		}
		
	}

	



	const modules = useMemo( 
		() => (
			{
			toolbar: null,
			
		}),
		[],
	);

	const router = useRouter();
	function updatePageMove(){
		router.push('/blog/' + props.blog_seq + '/' + props.seq + '/update');
	}

	async function deleteHandler(){
		const obj = {
			user_id : user.id,
			email : user.email,
			blog_seq :user.blog_seq,
			seq:props.seq
		}
		const blogDeleteRes = await transactionAuth("post", "blog/bloglistdelete", obj, "", false); 

		if(blogDeleteRes.sendObj.success === 'y'){
			setDeleteSuc(true);
		}else{
			
		}
	}

	function movetoPriList(){
		router.push('/blog/' + props.blog_seq)
	}


	return(
		<>

			{(boardYn)?
				((deleteSuc)?(
					<div className="grid place-items-center grid-cols-1">
					<div className="flex justify-center  w-[470px]
					2xl:w-[570px] xl:w-[570px] lg:w-[570px] md:w-[570px] sm:w-[470px] mt-40 mb-4
					">
						<p className="text-xl font-bold">delete successed</p>
					</div>
					<div className="flex justify-center  w-[470px]
					2xl:w-[570px] xl:w-[570px] lg:w-[570px] md:w-[570px] sm:w-[470px] 
					">
						<button className="border bg-gray-200 hover:bg-gray-400 text-black font-bold py-1 px-4 rounded"
						onClick={()=>movetoPriList()}
						>
							Board Lists
						</button>
					</div>
					
				</div>):
				(<div className="grid place-items-center grid-cols-1">
					<div className="flex justify-start border-b w-[90vw] border-gray-200 pb-2 mb-2">
						{blogDetailObj.title}
					</div>
					<div className="flex justify-start border-b w-[90vw] border-gray-200 pb-2 mb-2">
						<p className="w-[50%] truncate border-r border-gray-200">{majorCaName}</p>
						<p className="w-[50%] truncate ms-2">{subCaName}</p>
					</div>
					<div className="flex justify-center pb-2  mb-2">	
						<div className="">  
							<QuillNoSSRWrapper 
							theme="snow" 
							style={{
								height: "60vh"
								, width: "90vw"
							}}
							forwardedRef={quillRef}
							readOnly
							value={blogDetailObj.content}
							modules={
								modules
							}/>
						</div>
					</div>
					{
						(user.id.length > 0 && user.blog_seq+"" === props.blog_seq)?
						<div className="flex justify-end  w-[90vw]">
						<button className="tracking-tight border bg-gray-200 hover:bg-gray-400 text-black font-bold py-1 px-4 rounded mb-5"
						onClick={()=>updatePageMove()}
						>
							Update page
						</button>
						<button className="ms-2 tracking-tight border bg-gray-200 hover:bg-gray-400 text-black font-bold py-1 px-4 rounded mb-5"
						onClick={()=>deleteHandler()}
						>
							Delete
						</button>
					</div>
						:""
					}
					
				</div>)



				):(<div className="grid place-items-center grid-cols-1">
					<div className="flex justify-center  w-[470px]
					2xl:w-[570px] xl:w-[570px] lg:w-[570px] md:w-[570px] sm:w-[470px] mt-40 mb-4
					">
						<p className="text-xl font-bold">There is not a board</p>
					</div>
					<div className="flex justify-center  w-[470px]
					2xl:w-[570px] xl:w-[570px] lg:w-[570px] md:w-[570px] sm:w-[470px] 
					">
						<button className="border bg-gray-200 hover:bg-gray-400 text-black font-bold py-1 px-4 rounded"
						onClick={()=>movetoboard()}
						>
							Board Lists
						</button>
					</div>
					
				</div>
				)

			
			}

			
		</>
	)
};
export default PriBlogListDetail;

