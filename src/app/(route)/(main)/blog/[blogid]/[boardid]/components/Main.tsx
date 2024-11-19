'use client';

import { userState } from "@/app/store/user";
import { transaction } from "@/app/utils/axios";
import { transactionAuth } from "@/app/utils/axiosAuth";
import { getDate } from "@/app/utils/common";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactQuill, { ReactQuillProps } from "react-quill";
import 'react-quill/dist/quill.snow.css';
import { useRecoilState } from "recoil";
import { BiHomeAlt2 } from "react-icons/bi";
import Link from "next/link";

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

export interface commentListsArr {
		_id:string,
    blog_list_seq:number,
    blog_seq:number,
		seq:number,
		email:string,
    comment:string,
    deleteyn:string,
    regdate:string,
    reguser:string,
    upddate:string,
    upduser:string,
	
}

const PriBlogListDetail = (props: any) => {
	const [user, setUser] = useRecoilState(userState);
	const [blogDetailObj, setBlogDetailObj] = useState<any>([]);
	const quillRef = useRef<any>(ReactQuill);

	const [majorCaName, setMajorCaName] = useState<any>(null);
	const [subCaName, setSubCaName] = useState<any>(null);

	const [deleteSuc, setDeleteSuc] = useState<any>(false);
	const [boardYn, setBoardYn]  = useState<any>(true);

	const [blogComment, setBlogComment] = useState<any>("");

	const [commentLists, setCommentLists] = useState<commentListsArr[]>([]); 

	let currentPageG = 0;
	let currentSeqG = 0;

	useEffect(()=>{
		console.log(user);
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
			setMajorCaName(bloglistObj.sendObj.resObj.majorCaName);
			setSubCaName(bloglistObj.sendObj.resObj.subCaName);

			// commentSearch();

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
		router.push('/blog/' + props.blog_seq + "?refresh=refresh")
	}

	function blogCommentOnchangeHandler(e:any){
		setBlogComment(e.target.value);
	}
	
	async function commentWriteHandler(){
		const obj = {
			blog_id : user.blog_id,
			email : user.email,
			blog_seq :user.blog_seq,
			blog_list_seq:props.seq,
			comment : blogComment
		}
		// console.log(obj);
		const blogCommentWriteRes = await transactionAuth("post", "blog/commentwrite", obj, "", false); 

		if(blogCommentWriteRes.sendObj.success === 'y'){
			// setDeleteSuc(true);
		}else{
			
		}
	}

	async function commentSearch(cPage:any){
		
		const obj = {
			blog_seq :props.blog_seq,
			blog_list_seq:props.seq,
			currentPage:cPage
		}
		// console.log(obj);
		const blogCommentSearchRes = await transactionAuth("get", "blog/comments", obj, "", false); 
		console.log(blogCommentSearchRes.sendObj.resObj);
		// if(blogCommentSearchRes.sendObj.success === 'y'){
		// 	// setDeleteSuc(true);
			
		// }else{
			
		// }
		// console.log(blogCommentSearchRes);
		if(cPage > 1){
			if(blogCommentSearchRes.sendObj.resObj.length > 0){
				setCommentLists(commentLists.concat(blogCommentSearchRes.sendObj.resObj));
			}else{
				currentPageG--;
			}
			
		}else{
			setCommentLists(blogCommentSearchRes.sendObj.resObj);
		}
	}

	async function commentSearchUseSeq(seq:any){
		
		const obj = {
			blog_seq :props.blog_seq,
			blog_list_seq:props.seq,
			currentSeq:seq
		}
		// console.log(obj);
		const blogCommentSearchSeqRes = await transactionAuth("get", "blog/commentsseq", obj, "", false); 
		//console.log(blogCommentSearchRes.sendObj.resObj.blogComments);
		// console.log(blogCommentSearchSeqRes.sendObj.resObj.lastCommentSeq);
		
		// if(blogCommentSearchSeqRes.sendObj.resObj.blogComments.length > 0){
		// 	setCommentLists(commentLists.concat(blogCommentSearchSeqRes.sendObj.resObj));
		// 	currentSeqG = blogCommentSearchSeqRes.sendObj.resObj.lastCommentSeq;
		// }
		
		// if(blogCommentSearchSeqRes.sendObj.success === 'y'){
		// 	// setDeleteSuc(true);
		// }
			


		// }
		// console.log(blogCommentSearchRes);
		// if(cPage > 1){
		// 	if(blogCommentSearchRes.sendObj.resObj.length > 0){
		// 		setCommentLists(commentLists.concat(blogCommentSearchRes.sendObj.resObj));
		// 	}else{
		// 		currentPageG--;
		// 	}
			
		// }else{
		// 	setCommentLists(blogCommentSearchRes.sendObj.resObj);
		// }
	}

	const observerEl = useRef<HTMLDivElement>(null);
  	const handleObserver = useCallback(   
		
		(entries: IntersectionObserverEntry[]) => {
			const target = entries[0];
			
			if(target.isIntersecting){ //스크롤이 가장 밑에 닿았을경우
				currentPageG++;
				// commentSearch(currentPageG);
				commentSearchUseSeq(currentSeqG);
				/*currentSeqG
			1. 다음 페이지가 있을경우 back 에서 전달하도록 처리
			*/ 
			//   if(searchYnG === true){
			//     getBlogLists(currentPage, keywordG);
			//   }
				
			}
			
		},
		[]
  	);

	useEffect(() => {
		const observer = new IntersectionObserver(handleObserver, { threshold: 0 });
		const currentEl = observerEl.current;
		if (currentEl) {
			observer.observe(currentEl);
		}
		return () => {
			if (currentEl) {
				observer.unobserve(currentEl);
			}
		};
	}, [handleObserver]);
  
	// const router = useRouter();
  function movetoblog(blogSeq:any){
    router.push('/blog/' + blogSeq + "?refresh=refresh")
  }

	async function deleteComment(comment_id:any){
		const obj = {
			comment_id : comment_id,
			user_email : user.email,
		}
		const blogDeleteRes = await transactionAuth("post", "blog/commentdelete", obj, "", false); 
		
		if(blogDeleteRes.sendObj.success === 'y'){
			console.log("삭제 성공");
			const deleteComentIndex = commentLists.findIndex(element => element._id === comment_id);
			console.log(commentLists[deleteComentIndex]);
			
			commentLists[deleteComentIndex].deleteyn = "y";
			setCommentLists([...commentLists]);

		}
	}

	return(
		<>
			<div>
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
				(<div className="grid place-items-center grid-cols-1 ">
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
						<div>
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
							</div>
						:""
					}
					<div className="h-[100%]"> 
						{
							(commentLists.length > 0)?
								commentLists.map((item:any, index:any)=>{
									return(
										
										(item.deleteyn === 'y')?
										(
											
											<div key={index} className="mt-1 p-1 w-[90vw] h-[150px] border ">
												<div className="flex justify-center items-center w-[100%] h-[100%] bg-slate-50">
													<p className="font-bold" >deleted</p> 
												</div>
											</div>
											
										)
										:(<div key={index} className="mt-1 p-1 w-[90vw] h-[150px] border ">
										<div className="flex justify-start">
											<p className="mx-2 my-2 text-[12px] w-[49%]">
												<Link href={"/blog/"+item.blog_seq}>
												<span className="font-bold">{item.bloginfo.name}</span>
												</Link>
												{` (`+getDate(item.regdate) + `)`}
											</p>

											<p className="w-[49%]">
												{/* <button>asdf</button> */}
												<div className="justify-items-end ">
													<p className="me-2">
													{
														(user.email === item.email)?(
															<button className="
															tracking-tight border bg-gray-200 hover:bg-gray-400 text-black font-bold text-[12px]  px-1 rounded"
															onClick={()=>deleteComment(item._id)}
															>
																Delete
															</button>
														):""
													}
													
													
													</p>
												</div>
											</p>
											
										</div>
										
										<textarea className="mx-2 mt-1 text-sm break-all  bg-slate-50 w-[98%] h-[65%] p-1
										resize-none border-none outline-none" spellCheck={false} readOnly
										value={item.comment}
										/>
									</div>)
									)
								})
							: ""
						}
						<div></div>
					<div>

					</div>
						
					</div>
					{
						(user.id)?(
							<div className="sticky items-center bottom-0"> 
								<div className="w-[90vw] ">
									<p className="font-bold">comment</p> 
									<div className="w-[100%] ">
									<textarea  
									// ref={focusTitle} 
									onChange={(e)=>blogCommentOnchangeHandler(e)}
									id="introduction" rows={2}  className="border w-full px-3 py-2 text-sm bg-grey-200 focus:border-black text-gray-900 outline-none rounded"/>
									</div>
									<div className="flex justify-end">
									<button className="ms-2 tracking-tight border bg-gray-200 hover:bg-gray-400 text-black font-bold py-1 px-4 rounded mb-5"
										onClick={()=>commentWriteHandler()}
									>
									Comment Write
									</button>
									</div>
								</div>
							</div>
						):""
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
						onClick={()=>movetoPriList()}
						>
							Board Lists
						</button>
					</div>
					
				</div>
				)

			
			}
			<div ref={observerEl} className="h-1"/>
		</div>
		</>
	)
};
export default PriBlogListDetail;

