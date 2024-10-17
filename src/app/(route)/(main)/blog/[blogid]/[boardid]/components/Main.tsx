'use client';

import { transaction } from "@/app/utils/axios";
import DOMPurify from "dompurify";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import ReactQuill, { ReactQuillProps } from "react-quill";
import 'react-quill/dist/quill.snow.css';

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
	
	const [blogDetailObj, setBlogDetailObj] =  useState<any>([]);
	const quillRef = useRef<any>(ReactQuill);

	useEffect(()=>{
		getBlogDetail();
	},[])

	async function getBlogDetail(){
		const obj = {
			blog_seq:props.blog_seq,
			seq:props.seq
		}

		const bloglistObj = await transaction("get", "blog/blogDetail", obj, "", false);
		setBlogDetailObj(bloglistObj.sendObj.resObj.blogDetail);
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


	return(
		<>


			<div className="grid place-items-center grid-cols-1">
				<div className="flex justify-start border-b w-[90vw] border-gray-200 pb-2 mb-2">
					{blogDetailObj.title}
				</div>
				<div className="flex justify-start border-b w-[90vw] border-gray-200 pb-2 mb-2">
					<p className="w-[50%] truncate border-r border-gray-200">대분류</p>
					<p className="w-[50%] truncate ms-2">소분류</p>
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
				<div className="flex justify-end  w-[90vw]">
					<button className="border bg-gray-200 hover:bg-gray-400 text-black font-bold py-1 px-4 rounded mb-5"
					onClick={()=>updatePageMove()}
					>
						Update
					</button>
				</div>
			</div>
		</>
	)
};
export default PriBlogListDetail;

