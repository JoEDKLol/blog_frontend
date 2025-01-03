'use client';

import { userState } from "@/app/store/user";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import dynamic from "next/dynamic";
import 'react-quill/dist/quill.snow.css';
import ReactQuill, { ReactQuillProps } from 'react-quill';
import { transactionFile } from "@/app/utils/axiosFile";
import { transactionAuth } from "@/app/utils/axiosAuth";
import { transaction } from "@/app/utils/axios";
import { useRouter } from "next/navigation";
import { loadingBarState } from "@/app/store/loadingBar";
import Confirm from "@/app/components/confirmModal";
import { errorPageState } from "@/app/store/error";
import { errorFilePageState } from '@/app/store/errorFile';

	
	interface ForwardedQuillComponent extends ReactQuillProps {
		forwardedRef: React.Ref<ReactQuill>;
	}
	let tempNum:any;
	const QuillNoSSRWrapper = dynamic(
		async () => {
			const { default: QuillComponent } = await import('react-quill')
			const { default: ImageCompress } = await import('quill-image-compress');
			const { ImageResize } = await import('quill-image-resize-module-ts'); //2025-01-02 add
			QuillComponent.Quill.register('modules/imageCompress', ImageCompress);
			QuillComponent.Quill.register('modules/ImageResize', ImageResize);  //2025-01-02 add

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

		const [majorCategories, setMajorCategories] = useState<any>([]);
		const [majorCategoryCnt, setMajorCategoryCnt] = useState<any>(0);
		const [subCategories, setSubCategories] = useState<any>([]);
		const [subCategoryCnt, setSubCategoryCnt] = useState<any>(0);
		const [majorIndex, setMajorIndex] = useState<any>(-1);
		const [chooseMajor, setChooseMajor] = useState<any>();
		const [chooseSub, setChooseSub] = useState<any>();

		const [blogDetail, setBlogDetail] = useState<any>({});
		const [loadingBar, setLoadingBarState] = useRecoilState(loadingBarState);
		const [errorPage, setErrorPage] = useRecoilState(errorPageState);
		const [errorFilePage, seterrorFilePage] = useRecoilState(errorFilePageState);
		

		//confirm
		const [showConfirm, setShowConfirm] = useState(false);
		const [confirmStr, setConfirmStr] = useState({showText:"", exeFunction:"", obj:null as any});
		const [confirmRes, setConfirmRes] = useState(false);

		useEffect(()=>{
			if(confirmRes){ 
				// focusCommentReplyRef.current[replyCommnetIndex]?.focus();
				if(confirmStr.exeFunction === "updateButtenHandler") updateButtenHandler();
				setConfirmRes(false);
			}
		},[confirmRes])
	
		function confirmScreen(showText:string, exeFunction:string, obj:any){
			setShowConfirm(!showConfirm);
			setConfirmStr({showText:"", exeFunction:"", obj:null}); 
			setConfirmStr({showText:showText, exeFunction:exeFunction, obj:obj});
		}

		useEffect(()=>{
			let totalByte = 0;
			for(let i =0; i < title.length; i++) {
				let currentByte = title.charCodeAt(i);
				if(currentByte > 128){
					totalByte += 2;
				}else {
					totalByte++;
				}

				if(totalByte > 200){
					setTitle(title.substring(0, i));
					break;
				}
			}			
		},[title]);
		
        useEffect(()=>{
            getBlogDetail();
			getCategoryInfo();
		},[])

		async function getBlogDetail(){
			const obj = {
				blog_seq:props.blog_seq,
				seq:props.seq
			}
	
			const bloglistObj = await transaction("get", "blog/blogDetail", obj, "", false, true, setLoadingBarState, setErrorPage);

			
			if(bloglistObj.sendObj.success === 'y'){
				setContent(bloglistObj.sendObj.resObj.blogDetail.content);
				setTitle(bloglistObj.sendObj.resObj.blogDetail.title);
				tempNum = bloglistObj.sendObj.resObj.blogDetail.temp_num;
				setBlogDetail(bloglistObj.sendObj.resObj.blogDetail);
				setMajorIndex(bloglistObj.sendObj.resObj.blogDetail.m_category_seq);
			}
		}

		async function getCategoryInfo(){
			
			const obj = {
				user_id : user.id,
				email : user.email,
				blog_seq :user.blog_seq,
			}
			const blogInfoRes = await transaction("get", "blog/blogInfo", obj, "", false, true, setLoadingBarState, setErrorPage); 
			
			if(blogInfoRes.sendObj.success === 'y'){
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
		
		const imageHandler = async (imageBase64URL:any, imageBlob:any, editor:any) => {
			
			// return;
			const obj = {
				user_id : user.id,
				email : user.email,
				randomNum : tempNum
			}
			const imgUploadRes = await transactionFile("blog/fileUpload", imageBlob, obj, "", false, true, setLoadingBarState, setErrorPage);
			
			if(imgUploadRes.sendObj.success === "y"){
				const range = editor.getSelection();
      			editor.insertEmbed(range.index, "image", `${imgUploadRes.sendObj.resObj.img_url}`, "user");
			}else{
				seterrorFilePage({screenYn:true, contents:imgUploadRes.sendObj.resObj.errMassage});
				
			}
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

				ImageResize : {
					modules: ["Resize", "DisplaySize"],
				},
				
				imageCompress: {
					quality: 0.9,
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

		async function updateButtenHandler(){
			// const title = event.target.title.value;
			const obj = {
				user_id : user.id,
				email : user.email,
				title:title,
				content:content,
				blog_seq:user.blog_seq,
				randomNum : tempNum,
				seq:props.seq,
				m_category_seq:chooseMajor,
				s_category_seq:chooseSub
			}
			
			// console.log(obj);

			const updateRes = await transactionAuth("post", "blog/update", obj, "", false, true, setLoadingBarState, setErrorPage);
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

		function changeMajorCategory(e:any){
			setMajorIndex(Number(e.target.value));
			setChooseMajor(Number(e.target.value));
		}
		function changeSubCategory(e:any){
			setChooseSub(Number(e.target.value));
		}
		function movetoPriList(){
			router.push('/blog/' + user.blog_seq + "?refresh=refresh");
		}

		return (
			
			<>

			{writeSuc ? 
				(<div className="grid place-items-center grid-cols-1">
					<div className="flex justify-center  w-[470px]
					2xl:w-[570px] xl:w-[570px] lg:w-[570px] md:w-[570px] sm:w-[470px] mt-40 mb-4
					">
						<p className="text-xl font-bold">update successed</p>
					</div>
					<div className="flex justify-center  w-[470px]
					2xl:w-[570px] xl:w-[570px] lg:w-[570px] md:w-[570px] sm:w-[470px] 
					">
						<button className="border bg-gray-200 hover:bg-gray-400 text-black font-bold py-1 px-4 rounded"
						onClick={()=>movetoboard()}
						>
							Board Detail
						</button>

						<button className="ms-2 border bg-gray-200 hover:bg-gray-400 text-black font-bold py-1 px-4 rounded"
						onClick={()=>movetoPriList()}
						>
							Board list
						</button>

					</div>
					
				</div>):
			
			
				(<div className="grid place-items-center grid-cols-1">

					<div className="font-bold w-[100%] h-[30px] text-start visible ps-2
						2xl:h-[0px] xl:h-[0px] lg:h-[0px] md:h-[0px] sm:h-[30px]
						2xl:invisible xl:invisible lg:invisible md:invisible sm:visible
						">
					Title</div>
					<div className="flex justify-center 
					border-b border-gray-200 pb-2 mb-2 w-[100%]
					2xl:w-[80%] xl:w-[80%] lg:w-[80%] md:w-[80%] sm:w-[100%]
					">
						<div className="font-bold w-[0px] invisible
						2xl:w-[100px] xl:w-[100px] lg:w-[100px] md:w-[100px] sm:w-[0px]
						2xl:visible xl:visible lg:visible md:visible sm:invisible
						">Title
						</div>
						<div className="w-[100%] ">
						<input ref={focusTitle} 
						onChange={(e)=>title_onchangeHandler(e)}
						value={title}
						autoComplete="off" id="title" type="text"  className="border w-full px-3 py-2 text-sm bg-grey-200 focus:border-black text-gray-900 outline-none rounded"/>
						</div>
					</div>

					<div className="font-bold w-[100%] h-[30px] text-start visible ps-2
						2xl:h-[0px] xl:h-[0px] lg:h-[0px] md:h-[0px] sm:h-[30px]
						2xl:invisible xl:invisible lg:invisible md:invisible sm:visible
						">
					Category</div>

					<div className="flex justify-center 
					border-b border-gray-200 pb-2 mb-2 w-[100%]
					2xl:w-[80%] xl:w-[80%] lg:w-[80%] md:w-[80%] sm:w-[100%]
					">
						<div className="font-bold w-[0px] invisible
						2xl:w-[100px] xl:w-[100px] lg:w-[100px] md:w-[100px] sm:w-[0px]
						2xl:visible xl:visible lg:visible md:visible sm:invisible
						">Category</div> 
						<div className="flex justify-between w-[100%]">
							<select id="majorCategory" value={majorIndex} className="border border-gray-300 text-gray-900 text-sm rounded focus:border-black w-[49%] mx-1 px-3 py-2 outline-none"
							onChange={(e)=>changeMajorCategory(e)}
							>
								<option >Choose a MajorCategory</option>
								{
									majorCategories.map((item:any, index:any)=>{
										return (
											(item.seq == blogDetail.m_category_seq)?<option selected value={item.seq}>{item.categoryNm}</option>
											:<option key={index} value={item.seq}>{item.categoryNm}</option>
											// <option value={item.seq}>{item.categoryNm}</option>
										)
									})
								}
							</select>
							<select id="subCategory" value={chooseSub} className="border border-gray-300 text-gray-900 text-sm rounded focus:border-black w-[49%] mx-1 ms-2 px-3 py-2 outline-none"
							onChange={(e)=>changeSubCategory(e)}
							>
								<option>Choose a SubCategory</option>
								{
									subCategories.map((item:any, index:any)=>{  
										// return (
										// 	<option value={item.seq}>{item.m_category_seq}{majorIndex}</option>
										// )
										return (item.m_category_seq==majorIndex)?												
										(
											(item.seq == blogDetail.s_category_seq)?<option selected value={item.seq}>{item.categoryNm}</option>
											:<option key={index} value={item.seq}>{item.categoryNm}</option>
											// <option value={item.seq}>{item.categoryNm}</option>
										):""
									})
								}
							</select>
						</div>
					</div>
					<div className="font-bold w-[100%] h-[30px] text-start visible ps-2
						2xl:h-[0px] xl:h-[0px] lg:h-[0px] md:h-[0px] sm:h-[30px]
						2xl:invisible xl:invisible lg:invisible md:invisible sm:visible
						">
					Content</div>
					<div className="flex justify-center pb-2 border-b mb-2 w-[100%]
					2xl:w-[80%] xl:w-[80%] lg:w-[80%] md:w-[80%] sm:w-[100%]
					">	
						<div className="font-bold w-[0px] invisible
						2xl:w-[100px] xl:w-[100px] lg:w-[100px] md:w-[100px] sm:w-[0px]
						2xl:visible xl:visible lg:visible md:visible sm:invisible
						">Content</div>	 
						<div className="h-[400px] w-[100%]">  
							<QuillNoSSRWrapper 
							theme="snow" 
							style={{height: "90vw"}}
							forwardedRef={quillRef}
							value={content}
							onChange={setContent}
							modules={
								modules
							}
							/>
							<div className="flex justify-end">
								<button className=" mt-20 border bg-gray-200 hover:bg-gray-400 text-black font-bold py-1 px-4 rounded mb-5
								2xl:mt-14 xl:mt-14 lg:mt-14 md:mt-20 sm:mt-14"
								// onClick={()=>updateButtenHandler()}
								onClick={()=>confirmScreen("Would you like to update?", "updateButtenHandler", null)}
								
								>
									Update
								</button>
							</div>	
						</div>
					</div>
					{/* <div className="flex justify-end  w-[470px]
					2xl:w-[570px] xl:w-[570px] lg:w-[570px] md:w-[570px] sm:w-[470px]
					">
						<button className="border bg-gray-200 hover:bg-gray-400 text-black font-bold py-1 px-4 rounded mb-5"
						onClick={()=>writeButtenHandler()}
						>
							Write
						</button>
					</div> */}
				</div>)
			}
			{showConfirm && <Confirm confirmStr={confirmStr} setShowConfirm={setShowConfirm} setConfirmRes={setConfirmRes}/>}
			</>	
			
		)

	};
	export default QuillEditor;


