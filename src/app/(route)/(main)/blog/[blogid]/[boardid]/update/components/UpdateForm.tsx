'use client';

import { userState } from "@/app/store/user";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import dynamic from "next/dynamic";
import 'react-quill/dist/quill.snow.css';
import ReactQuill, { ReactQuillProps } from 'react-quill';
import { transactionFile } from "@/app/utils/axiosFile";
import { getRandomNumber } from "@/app/utils/common";
import { transactionAuth } from "@/app/utils/axiosAuth";
import { transaction } from "@/app/utils/axios";
import { useRouter } from "next/navigation";
	
	interface ForwardedQuillComponent extends ReactQuillProps {
		forwardedRef: React.Ref<ReactQuill>;
	}
	let tempNum:any;
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

	// export default function QuillEditor(){
	const QuillEditor = (props: any) => {
        
		const focusTitle = useRef<HTMLInputElement>(null);
		const quillRef = useRef<any>(ReactQuill);
		const [content, setContent] = useState<any>("");
		const [user, setUser] = useRecoilState(userState);
		
		const [title, setTitle] = useState<any>("");
		const [writeSuc, setWriteSuc] = useState(false);
		
        useEffect(()=>{
            getBlogDetail();
		},[])

		async function getBlogDetail(){
			const obj = {
				blog_seq:props.blog_seq,
				seq:props.seq
			}
	
			const bloglistObj = await transaction("get", "blog/blogDetail", obj, "", false);
			console.log(bloglistObj.sendObj.resObj.blogDetail);
			setContent(bloglistObj.sendObj.resObj.blogDetail.content);
			setTitle(bloglistObj.sendObj.resObj.blogDetail.title);
			tempNum = bloglistObj.sendObj.resObj.blogDetail.temp_num;
			// console.log(tempNum); 
		}
		
		const imageHandler = async (imageBase64URL:any, imageBlob:any, editor:any) => {
			
			// return;
			const obj = {
				user_id : user.id,
				email : user.email,
				randomNum : tempNum
			}
			const imgUploadRes = await transactionFile("blog/fileUpload", imageBlob, obj, "", false);
			const range = editor.getSelection();
      		editor.insertEmbed(range.index, "image", `${imgUploadRes.sendObj.resObj.img_url}`, "user");
		}

		const modules = useMemo( 
			() => ({
				toolbar: {
					container: [
						[{ header: [1, 2, false] }],
						['bold', 'italic', 'underline', 'strike', 'blockquote'],
						[{ list: 'ordered' }, { list: 'bullet' }],
						["link", "image", "video"],
						['clean'],
						[{ color: [] }, { background: [] }],
						[{ align: [] }],
					],
				},
				imageCompress: {
					quality: 0.7,
					maxWidth: 1000, 
					maxHeight: 1000, 
					debug: false, // default
					suppressErrorLogging: false, 
					// insertIntoEditor : undefined
					insertIntoEditor: (imageBase64URL:any, imageBlob:any, editor:any) => {
						imageHandler(imageBase64URL, imageBlob, editor)
					}
				},
			}),
			[],
		);
		function title_onchangeHandler(e:any){
			setTitle(e.target.value);
		}

		async function writeButtenHandler(){
			// const title = event.target.title.value;
			const obj = {
				user_id : user.id,
				email : user.email,
				title:title,
				content:content,
				blog_seq:user.blog_seq,
				randomNum : tempNum,
				seq:props.seq
			}
			
			console.log(obj);

			const updateRes = await transactionAuth("post", "blog/update", obj, "", false);
			// console.log(imgUploadRes.sendObj.success );

			if(updateRes.sendObj.success === 'y'){
				setWriteSuc(true);
			}else{
				
			}
		}

		const router = useRouter();
		function movetoboard(){
			router.push('/blog/' + user.blog_seq + "/" + props.seq);
		}

		return (
			
			<>

			{writeSuc ? 
				(<div className="grid place-items-center grid-cols-1">
					<div className="flex justify-center  w-[470px]
					2xl:w-[570px] xl:w-[570px] lg:w-[570px] md:w-[570px] sm:w-[470px] mt-40 mb-4
					">
						<p className="text-xl font-bold">write successed</p>
					</div>
					<div className="flex justify-center  w-[470px]
					2xl:w-[570px] xl:w-[570px] lg:w-[570px] md:w-[570px] sm:w-[470px] 
					">
						<button className="border bg-gray-200 hover:bg-gray-400 text-black font-bold py-1 px-4 rounded"
						onClick={()=>movetoboard()}
						>
							Board Detail
						</button>
					</div>
					
				</div>):
			
			
				(<div className="grid place-items-center grid-cols-1">
					<div className="font-bold w-[470px] h-[30px] text-start visible ps-2
						2xl:h-[0px] xl:h-[0px] lg:h-[0px] md:h-[0px] sm:h-[30px]
						2xl:invisible xl:invisible lg:invisible md:invisible sm:visible
						">
					Title</div>
					<div className="flex justify-center border-b border-gray-200 pb-2 mb-2">
						<div className="font-bold w-[0px] invisible
						2xl:w-[100px] xl:w-[100px] lg:w-[100px] md:w-[100px] sm:w-[0px]
						2xl:visible xl:visible lg:visible md:visible sm:invisible
						">Title
						</div>
						<div className="w-[470px] ">
						<input ref={focusTitle} 
						onChange={(e)=>title_onchangeHandler(e)}
						value={title}
						autoComplete="off" id="title" type="text"  className="border w-full px-3 py-2 text-sm bg-grey-200 focus:border-black text-gray-900 outline-none rounded"/>
						</div>
					</div>

					<div className="font-bold w-[470px] h-[30px] text-start visible ps-2
						2xl:h-[0px] xl:h-[0px] lg:h-[0px] md:h-[0px] sm:h-[30px]
						2xl:invisible xl:invisible lg:invisible md:invisible sm:visible
						">
					Category</div>

					<div className="flex justify-center border-b border-gray-200 pb-2 mb-2">
						<div className="font-bold w-[0px]
						2xl:w-[100px] xl:w-[100px] lg:w-[100px] md:w-[100px] sm:w-[0px]
						2xl:visible xl:visible lg:visible md:visible sm:invisible
						">Category</div> 
						<div className="w-[470px]">
							<select id="majorCategory" className="border border-gray-300 text-gray-900 text-sm rounded focus:border-black w-[230px] px-3 py-2 outline-none">
								{/* <option selected>Choose a MajorCategory</option>
								<option value="US">United States</option>
								<option value="CA">Canada</option>
								<option value="FR">France</option>
								<option value="DE">Germany</option> */}
							</select>
							<select id="subCategory" className="border border-gray-300 text-gray-900 text-sm rounded focus:border-black w-[230px] ms-2 px-3 py-2 outline-none">
								{/* <option selected>Choose a SubCategory</option>
								<option value="US">United States</option>
								<option value="CA">Canada</option>
								<option value="FR">France</option>
								<option value="DE">Germany</option> */}
							</select>
						</div>
					</div>
					<div className="font-bold w-[470px] h-[30px] text-start visible ps-2
						2xl:h-[0px] xl:h-[0px] lg:h-[0px] md:h-[0px] sm:h-[30px]
						2xl:invisible xl:invisible lg:invisible md:invisible sm:visible
						">
					Content</div>
					<div className="flex justify-center pb-2 border-b mb-2">	
						<div className="font-bold w-[0px] invisible
						2xl:w-[100px] xl:w-[100px] lg:w-[100px] md:w-[100px] sm:w-[0px]
						2xl:visible xl:visible lg:visible md:visible sm:invisible
						">Content</div>	 
						<div className="h-[370px]">  
							<QuillNoSSRWrapper 
							theme="snow" 
							style={{height: "300px", width: "470px"}}
							forwardedRef={quillRef}
							value={content}
							onChange={setContent}
							modules={
								modules
							}
							/>
						</div>
					</div>
					<div className="flex justify-end  w-[470px]
					2xl:w-[570px] xl:w-[570px] lg:w-[570px] md:w-[570px] sm:w-[470px]
					">
						<button className="border bg-gray-200 hover:bg-gray-400 text-black font-bold py-1 px-4 rounded mb-5"
						onClick={()=>writeButtenHandler()}
						>
							Write
						</button>
					</div>
				</div>)
			}

			</>	
			
		)

	};
	export default QuillEditor;


