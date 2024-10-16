'use client';

import { transaction } from "@/app/utils/axios";
import DOMPurify from "dompurify";
import dynamic from "next/dynamic";
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
					<div className="h-[370px]">  
						<QuillNoSSRWrapper 
						theme="snow" 
						style={{
							height: "70vh"
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
				<div className="flex justify-end  w-[470px]
				2xl:w-[570px] xl:w-[570px] lg:w-[570px] md:w-[570px] sm:w-[470px]
				">
				</div>
			</div>
		</>
	)
};
export default PriBlogListDetail;

