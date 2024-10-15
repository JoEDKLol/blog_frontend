'use client';

import { transaction } from "@/app/utils/axios";
import DOMPurify from "dompurify";
import { useEffect, useState } from "react";




const PriBlogListDetail = (props: any) => {
	
	const [content, setContent] = useState<any>(null);

	// console.log(props);

	useEffect(()=>{
		getBlogDetail();
	},[])

	async function getBlogDetail(){
		const obj = {
			blog_seq:props.blog_seq,
			seq:props.seq
		}

		const bloglistObj = await transaction("get", "blog/blogDetail", obj, "", false);
		setContent(bloglistObj.sendObj.resObj.blogDetail.content);

	}

	return(
		<>
			<div className="grid place-items-center grid-cols-1 mt-5">
				게시글 상세보기
				<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content || "") }} />
			</div>
		</>
	)
};
export default PriBlogListDetail;

