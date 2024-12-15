'use client';

import { userState } from "@/app/store/user";
import { transaction } from "@/app/utils/axios";
import { transactionAuth } from "@/app/utils/axiosAuth";
import { getDate } from "@/app/utils/common";
import dynamic from "next/dynamic";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactQuill, { ReactQuillProps } from "react-quill";
import 'react-quill/dist/quill.snow.css';
import { useRecoilState } from "recoil";
import { BiHomeAlt2 } from "react-icons/bi";
import Link from "next/link";
import { loadingBarState } from "@/app/store/loadingBar"; 


import { BiLike } from "react-icons/bi"; //<BiLike />
import { BiSolidLike } from "react-icons/bi"; //<BiSolidLike />
import { MdSubdirectoryArrowRight } from "react-icons/md"; //<MdSubdirectoryArrowRight />
import Confirm from "@/app/components/confirmModal";
import { errorPageState } from "@/app/store/error";


 

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
		readOnly:boolean,
		style:string, 
		updateYn:boolean,
		replies:[
			_id:any,
		],
		replyYn:boolean,
		reply:string,
		repliescnt:number,
		currentReplaySeq:number,
}

let currentPageG = 0;
let currentSeqG = 0;
let blogCommentArr = [] as any;
let showCommentG = false;

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
	const [showComment, setShowComment] = useState<boolean>(false);

	const [bottomCommentButton, setBottomCommentButton] = useState<boolean>(false);
	const [bottomCommentBox, setBottomCommentBox] = useState<boolean>(false);
	const [blogListLike , setBlogListLike] = useState<boolean>(false);

	const focusComment = useRef<HTMLTextAreaElement>(null);
	const commentRegRef = useRef<HTMLDivElement>(null);
	const focusBottomCommentBox = useRef<HTMLTextAreaElement>(null);

	const focusCommentListRef = useRef<null[] | HTMLTextAreaElement[]>([]);
	const focusCommentReplyListRef = useRef<null[] | HTMLTextAreaElement[]>([]);
	const focusCommentReplyRegRef = useRef<null[] | HTMLTextAreaElement[]>([]);
	const focusCommentReplyRef = useRef<null[] | HTMLTextAreaElement[]>([]);

	const [loadingBar, setLoadingBarState] = useRecoilState(loadingBarState);
	const [errorPage, setErrorPage] = useRecoilState(errorPageState);
	
	const [updateCommnetIndex, setUpdateCommentIndex] = useState<any>(-1);
	const [replyRegCommnetIndex, setReplyRegCommnetIndex] = useState<any>(-1);
	const [replyCommnetIndex, setReplyCommnetIndex] = useState<any>(-1);

	//confirm
	const [showConfirm, setShowConfirm] = useState(false);
	const [confirmStr, setConfirmStr] = useState({showText:"", exeFunction:"", obj:null as any});
	const [confirmRes, setConfirmRes] = useState(false);

	const path:any = usePathname();
  const blog_seq = path.split("/")[2];

	useEffect(()=>{
		getBlogDetail();
	},[])

	useEffect(()=>{
    blogCommentArr = commentLists;
	},[commentLists]);
	
	useEffect(()=>{
		if(showComment){
			focusComment.current?.focus();

		}
		showCommentG = showComment;
	},[showComment])

	useEffect(()=>{
		if(bottomCommentBox){
			focusBottomCommentBox.current?.focus();

		}
	},[bottomCommentBox])

	// focusCommentListRef
	useEffect(()=>{
		if(updateCommnetIndex > -1){
			focusCommentListRef.current[updateCommnetIndex]?.focus();
		}
	},[updateCommnetIndex])

	useEffect(()=>{
		if(replyRegCommnetIndex > -1){
			focusCommentReplyRegRef.current[replyRegCommnetIndex]?.focus();
		}
	},[replyRegCommnetIndex])

	useEffect(()=>{
		if(replyCommnetIndex > -1){
			focusCommentReplyRef.current[replyCommnetIndex]?.focus();
		}
	},[replyCommnetIndex])

	useEffect(()=>{
    if(user.id){
			// console.log("해당 블로그상세에서 해당 유저ID로 좋아요 있는지 조회 ");
			searchLike();
		}
	},[user]);

	useEffect(()=>{
		
		let totalByte = 0;
		for(let i =0; i < blogComment.length; i++) {
			let currentByte = blogComment.charCodeAt(i);
			if(currentByte > 128){
				totalByte += 2;
			}else {
				totalByte++;
			}

			if(totalByte > 1000){
				setBlogComment(blogComment.substring(0, i));
				break;
			}
		}
	},[blogComment]);

	

	useEffect(()=>{
		if(confirmRes){ 
			// focusCommentReplyRef.current[replyCommnetIndex]?.focus();
			if(confirmStr.exeFunction === "deleteHandler") deleteHandler();
			if(confirmStr.exeFunction === "commentWriteHandler") commentWriteHandler();
			if(confirmStr.exeFunction === "showReplyClickHandler")
				showReplyClickHandler(confirmStr.obj.id, confirmStr.obj.index, confirmStr.obj.replyYn, confirmStr.obj.seq);
			if(confirmStr.exeFunction === "commentUpdateYn")
				commentUpdateYn(confirmStr.obj.id, confirmStr.obj.index, confirmStr.obj.updateYn);
			if(confirmStr.exeFunction === "deleteComment")
				deleteComment(confirmStr.obj.id);
			if(confirmStr.exeFunction === "replyUpdateYn")
				replyUpdateYn(confirmStr.obj.id, confirmStr.obj.replyId, confirmStr.obj.replyIndex, confirmStr.obj.replyUpdateYn);
			if(confirmStr.exeFunction === "deleteReply")
				deleteReply(confirmStr.obj.id, confirmStr.obj.replyId);

			
			
			setConfirmRes(false);
		}
	},[confirmRes])

	async function getBlogDetail(){
		
		const obj = {
			blog_seq:props.blog_seq,
			seq:props.seq
		}

		console.log(obj);

		const bloglistObj = await transaction("get", "blog/blogDetail", obj, "", false, true, setLoadingBarState, setErrorPage);
		
		if(bloglistObj.sendObj.success === "y"){
			setBlogDetailObj(bloglistObj.sendObj.resObj.blogDetail);
			setMajorCaName(bloglistObj.sendObj.resObj.majorCaName);
			setSubCaName(bloglistObj.sendObj.resObj.subCaName);
			currentSeqG = 0;
			commentSearchUseSeq(currentSeqG);
		}else{
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


	function confirmScreen(showText:string, exeFunction:string, obj:any){

		if(exeFunction === "showReplyClickHandler" && !obj.replyYn){
			//id:item._id, index:index, replyYn:item.replyYn, seq:item.seq
			showReplyClickHandler(obj.id, obj.index, obj.replyYn, obj.seq);
		}else if(exeFunction === "commentUpdateYn" && !obj.updateYn){
			commentUpdateYn(obj.id, obj.index, obj.updateYn);
		}else if(exeFunction === "replyUpdateYn" && !obj.replyUpdateYn){
			replyUpdateYn(obj.id, obj.replyId, obj.replyIndex, obj.replyUpdateYn);
		}else{
			setShowConfirm(!showConfirm);
			setConfirmStr({showText:"", exeFunction:"", obj:null}); 
			setConfirmStr({showText:showText, exeFunction:exeFunction, obj:obj});
		}
		
	}

	async function deleteHandler(){

		const obj = {
			user_id : user.id,
			email : user.email,
			blog_seq :props.blog_seq,
			seq:props.seq
		}
		const blogDeleteRes = await transactionAuth("post", "blog/bloglistdelete", obj, "", false, true, setLoadingBarState, setErrorPage); 
		
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
			blog_seq :props.blog_seq,
			blog_list_seq:props.seq,
			comment : blogComment
		}
		// console.log(obj);
		const blogCommentWriteRes = await transactionAuth("post", "blog/commentwrite", obj, "", false, true, setLoadingBarState, setErrorPage); 

		if(blogCommentWriteRes.sendObj.success === 'y'){
			setShowComment(false);

			blogCommentWriteRes.sendObj.resObj.readOnly = true;
			blogCommentWriteRes.sendObj.resObj.style = " border-none outline-none bg-slate-50 ";
			blogCommentWriteRes.sendObj.resObj.updateYn = false;
			blogCommentWriteRes.sendObj.resObj.replyYn = false;
			blogCommentWriteRes.sendObj.resObj.currentReplaySeq = 0;
			blogCommentWriteRes.sendObj.resObj.replies = [];

			blogCommentArr.unshift(blogCommentWriteRes.sendObj.resObj)
			setCommentLists(blogCommentArr);
			setBottomCommentBox(false);
			setBlogComment("");

		}else{
			
		}
	}

	async function commentSearchUseSeq(seq:any){
		const obj = {
			blog_seq :props.blog_seq,
			blog_list_seq:props.seq,
			currentSeq:seq
		}
		const blogCommentSearchSeqRes = await transaction("get", "blog/commentsseq", obj, "", false, true, setLoadingBarState, setErrorPage); 

		if(blogCommentSearchSeqRes.sendObj.success === 'y'){
			if(blogCommentSearchSeqRes.sendObj.resObj.blogComments.length > 0){
			
				for(let i = 0; i < blogCommentSearchSeqRes.sendObj.resObj.blogComments.length; i++){
					blogCommentSearchSeqRes.sendObj.resObj.blogComments[i].readOnly = true;
					blogCommentSearchSeqRes.sendObj.resObj.blogComments[i].style = " border-none outline-none bg-slate-50 ";
					blogCommentSearchSeqRes.sendObj.resObj.blogComments[i].updateYn = false;
					blogCommentSearchSeqRes.sendObj.resObj.blogComments[i].replyYn = false;
					blogCommentSearchSeqRes.sendObj.resObj.blogComments[i].currentReplaySeq = 0;
					blogCommentSearchSeqRes.sendObj.resObj.blogComments[i].replies = [];
				}
	
				if(seq > 0){
					setCommentLists(blogCommentArr.concat(blogCommentSearchSeqRes.sendObj.resObj.blogComments));
				}else{
					setCommentLists(blogCommentSearchSeqRes.sendObj.resObj.blogComments);
				}
				currentSeqG = blogCommentSearchSeqRes.sendObj.resObj.lastCommentSeq;
	
			}
		}
		
		
	}

	const observerEl = useRef<HTMLDivElement>(null);
  	const handleObserver = useCallback(   
		
		(entries: IntersectionObserverEntry[]) => {
			const target = entries[0];
			
			if(target.isIntersecting){ //스크롤이 가장 밑에 닿았을경우
				if(currentSeqG !== 0){
					commentSearchUseSeq(currentSeqG);
				}				
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
			blog_list_seq:props.seq,
		}
		const commentDeleteRes = await transactionAuth("post", "blog/commentdelete", obj, "", false, true, setLoadingBarState, setErrorPage); 
		
		if(commentDeleteRes.sendObj.success === 'y'){
			// console.log("삭제 성공");
			const deleteComentIndex = commentLists.findIndex(element => element._id === comment_id);
			// console.log(commentLists[deleteComentIndex]);
			
			commentLists[deleteComentIndex].deleteyn = "y";
			setCommentLists([...commentLists]);

		}
	}

	function showCommentClickHandler(){
		if(showComment){
			setShowComment(false);
			
		}else{
			setShowComment(true);
			// focusComment.current?.focus();
		}
	} 

	useEffect(() => {
    if (!commentRegRef.current) return;
    window.addEventListener("scroll", yScrollEvent);
    return () => {
      window.removeEventListener("scroll", yScrollEvent);
    };
  }, [commentRegRef.current]);

  const yScrollEvent = () => {
    const scroll = commentRegRef.current?.getBoundingClientRect();
    // console.log(scroll?.top);
    // setHideElement(scroll?.top <= 85);
		if(scroll?.top){
			if(showCommentG){
				if(scroll?.top < -60){
					// console.log("하단에 댓글 등록 버튼 보이도록 처리");
					setBottomCommentButton(true);
				}else{
					// console.log("하단에 댓글 등록 버튼 안보이도록 처리");
					setBottomCommentButton(false);
					setBottomCommentBox(false);
				}
			}else{
				if(scroll?.top < 85){
					// console.log("하단에 댓글 등록 버튼 보이도록 처리");
					setBottomCommentButton(true);
				}else{
					// console.log("하단에 댓글 등록 버튼 안보이도록 처리");
					setBottomCommentButton(false);
					setBottomCommentBox(false);
				}
			}
		}
  };

	function bottomCommentClickHandler(){
		if(bottomCommentBox){
			setBottomCommentBox(false);
		}else{
			// focusBottomCommentBox.current?.focus();
			setBottomCommentBox(true);
		}
	}

	async function searchLike(){

		const obj ={
			user_id : user.id,
			blog_list_seq:props.seq,
		}
		const searchBlogListLikeUpdateRes = await transaction("get", "blog/searchbloglistlike", obj, "", false, true, setLoadingBarState, setErrorPage);
		// console.log(searchBlogListLikeUpdateRes);

		if(searchBlogListLikeUpdateRes.sendObj.success === 'y'){
			setBlogListLike((searchBlogListLikeUpdateRes.sendObj.resObj.like_yn === 'y')?true:false);
		}

	}

	async function blogListLikeUpdate(likeYn:any){
		const obj ={
			user_id : user.id,
			blog_list_seq:props.seq,
			like_yn : likeYn,
			email : user.email
		}
		const blogListLikeUpdateRes = await transactionAuth("post", "blog/bloglistlikeupdate", obj, "", false, true, setLoadingBarState, setErrorPage);
		// console.log(blogListLikeUpdateRes.sendObj);

		if(blogListLikeUpdateRes.sendObj.success === 'y'){
			setBlogListLike((blogListLikeUpdateRes.sendObj.resObj.like_yn === 'y')?true:false);
		}

	}

	function likeOnclickHandler(){
		if(blogListLike){
			blogListLikeUpdate("n"); 
			// setBlogListLike(false);
			
			
		}else{
			blogListLikeUpdate("y");
			// setBlogListLike(true);
		}


	}

	async function commentUpdateYn(id:any, index:any, updateYn:boolean){
		
		const choosenIndex = commentLists.findIndex((val) => val._id === id)

		if(updateYn === false){
			commentLists[choosenIndex].readOnly = false;
			commentLists[choosenIndex].style = "";
			commentLists[choosenIndex].updateYn = true;	
			setCommentLists([...commentLists]);
			setUpdateCommentIndex(index); //textarea focus
		}else{
			const obj ={
				comment_id : id,
				comment :commentLists[choosenIndex].comment, 
				email : user.email
			}
		
			const blogCommentUpdateRes = await transactionAuth("post", "blog/commentupdate", obj, "", false, true, setLoadingBarState, setErrorPage);
			// console.log(blogListLikeUpdateRes.sendObj);
	
			if(blogCommentUpdateRes.sendObj.success === 'y'){
				
				commentLists[choosenIndex].readOnly = true;
				commentLists[choosenIndex].style = " border-none outline-none bg-slate-50 ";
				commentLists[choosenIndex].updateYn = false;
				setCommentLists([...commentLists]);
				setUpdateCommentIndex(-1);
			}
		}

		
	}

	function blogCommentListOnchangeHandler(e:any, id:any){
		const choosenIndex = commentLists.findIndex((val) => val._id === id)
		
		let totalByte = 0;
		for(let i =0; i < e.target.value.length; i++) {
			let currentByte = e.target.value.charCodeAt(i);
			if(currentByte > 128){
				totalByte += 2;
			}else {
				totalByte++;
			}

			if(totalByte > 1000){
				// setBlogComment(e.target.value.substring(0, i));
				// commentLists[choosenIndex].comment = e.target.value.substring(0, i);
				// setCommentLists([...commentLists]);
				commentLists[choosenIndex].comment = e.target.value.substring(0, i);
				setCommentLists([...commentLists]);
				break;
			}else{
				commentLists[choosenIndex].comment = e.target.value;
				setCommentLists([...commentLists]);	
			}
		}

		// commentLists[choosenIndex].comment = e.target.value;
		// setCommentLists([...commentLists]);
				
	}

	function blogReplyListOnchangeHandler(e:any, id:any){
		const choosenIndex = commentLists.findIndex((val) => val._id === id)
		// commentLists[choosenIndex].reply = e.target.value;
		// setCommentLists([...commentLists]);
		let totalByte = 0;
		for(let i =0; i < e.target.value.length; i++) {
			let currentByte = e.target.value.charCodeAt(i);
			if(currentByte > 128){
				totalByte += 2;
			}else {
				totalByte++;
			}

			if(totalByte > 1000){
				commentLists[choosenIndex].reply = e.target.value.substring(0, i);;
				setCommentLists([...commentLists]);
				break;
			}else{
				commentLists[choosenIndex].reply = e.target.value;
				setCommentLists([...commentLists]);	
			}
		}
	}

	async function showReplyClickHandler(id:any, index:any, replyYn:boolean, seq:any){
		
		const choosenIndex = commentLists.findIndex((val) => val._id === id)
		
		if(replyYn){
		
			const obj ={
				blog_seq :props.blog_seq,
				blog_list_seq:props.seq,
				blog_comment_seq : seq,
				blog_comment_id : id,
				//writer info
				email : user.email,
				blog_id : user.blog_id, 
				reply : commentLists[choosenIndex].reply,
				
			}

			const blogReplyWriteRes = await transactionAuth("post", "blog/replywrite", obj, "", false, true, setLoadingBarState, setErrorPage);	
		
			

			if(blogReplyWriteRes.sendObj.success === 'y'){

				commentLists[choosenIndex].repliescnt = blogReplyWriteRes.sendObj.resObj.repliescnt;
				commentLists[choosenIndex].replyYn = false;
				commentLists[choosenIndex].reply="";
				setReplyRegCommnetIndex(-1);

				if(commentLists[choosenIndex].currentReplaySeq > 0){


					blogReplyWriteRes.sendObj.resObj.blogApplies.readOnly = true;
					blogReplyWriteRes.sendObj.resObj.blogApplies.style = " border-none outline-none bg-slate-50 ";
					blogReplyWriteRes.sendObj.resObj.blogApplies.updateYn = false;

					commentLists[choosenIndex].replies.unshift(blogReplyWriteRes.sendObj.resObj.blogApplies);
				}

				setCommentLists([...commentLists]);
			}

		}else{
			commentLists[choosenIndex].replyYn = true;
			setCommentLists([...commentLists]);
			setReplyRegCommnetIndex(choosenIndex);
		}
	}

	function showReplyCancleClickHandler(id:any, index:any, replyYn:boolean, seq:any){
		const choosenIndex = commentLists.findIndex((val) => val._id === id);
		commentLists[choosenIndex].replyYn = false;
		setCommentLists([...commentLists]);
		setReplyRegCommnetIndex(-1);
	}

	async function showRepliest(id:any, seq:any, currentReplaySeq:any){
		const obj = {
			blog_comment_seq : seq,
			currentReplaySeq:currentReplaySeq
		}
		
		const blogCommentSearchSeqRes = await transaction("get", "blog/replyseq", obj, "", false, true, setLoadingBarState, setErrorPage); 
		// console.log(blogCommentSearchSeqRes);
		if(blogCommentSearchSeqRes.sendObj.success === 'y'){
			if(blogCommentSearchSeqRes.sendObj.resObj.blogReplies.length > 0){

				const replies = blogCommentSearchSeqRes.sendObj.resObj;
				const choosenIndex = commentLists.findIndex((val) => val._id === id);
				let preReplies:any = commentLists[choosenIndex].replies;
				
				for(let i = 0; i < replies.blogReplies.length; i++){
					replies.blogReplies[i].readOnly = true;
					replies.blogReplies[i].style = " border-none outline-none bg-slate-50 ";
					replies.blogReplies[i].updateYn = false;
				}

				preReplies = preReplies.concat(replies.blogReplies);
				commentLists[choosenIndex].replies = preReplies;
				commentLists[choosenIndex].currentReplaySeq = replies.lastReplySeq;

				setCommentLists([...commentLists]);  
			}
		}
	}

	async function replyUpdateYn(commentId:any, reply_id:any, replyIndex:any, replyUpdateYn:any){
		const choosenIndex = commentLists.findIndex((val) => val._id === commentId);
		const choosenReplyIndex = commentLists[choosenIndex].replies.findIndex((value) => value._id === reply_id);
		
		if(replyUpdateYn === false){
			commentLists[choosenIndex].replies[choosenReplyIndex].readOnly = false;
			commentLists[choosenIndex].replies[choosenReplyIndex].style = "";
			commentLists[choosenIndex].replies[choosenReplyIndex].updateYn = true;	
			setCommentLists([...commentLists]);  
			setReplyCommnetIndex(replyIndex); //textarea focus
		}else{

			const obj ={
				reply_id : reply_id,
				reply :commentLists[choosenIndex].replies[choosenReplyIndex].reply, 
				email : user.email
			}

			const blogReplyUpdateRes = await transactionAuth("post", "blog/replyupdate", obj, "", false, true, setLoadingBarState, setErrorPage);
			
			if(blogReplyUpdateRes.sendObj.success === 'y'){
				
				commentLists[choosenIndex].replies[choosenReplyIndex].readOnly = true;
				commentLists[choosenIndex].replies[choosenReplyIndex].style = " border-none outline-none bg-slate-50 ";
				commentLists[choosenIndex].replies[choosenReplyIndex].updateYn = false;
				setCommentLists([...commentLists]);
				setReplyCommnetIndex(-1); //textarea focus
			}
		}
	}
	
	function blogReplyUpdateOnchangeHandler(e:any, commentId:any, reply_id:any){
		const choosenIndex = commentLists.findIndex((val) => val._id === commentId);
		const choosenReplyIndex = commentLists[choosenIndex].replies.findIndex((value) => value._id === reply_id);
		commentLists[choosenIndex].replies[choosenReplyIndex].reply = e.target.value;
		setCommentLists([...commentLists]);

		let totalByte = 0;
		for(let i =0; i < e.target.value.length; i++) {
			let currentByte = e.target.value.charCodeAt(i);
			if(currentByte > 128){
				totalByte += 2;
			}else {
				totalByte++;
			}

			if(totalByte > 1000){
				commentLists[choosenIndex].replies[choosenReplyIndex].reply = e.target.value.substring(0, i);
				setCommentLists([...commentLists]);
				break;
			}else{
				commentLists[choosenIndex].replies[choosenReplyIndex].reply = e.target.value;
				setCommentLists([...commentLists]);
			}
		}



	}

	async function deleteReply(comment_id:any, reply_id:any){
		const obj = {
			comment_id : comment_id,
			reply_id : reply_id,
			email : user.email,
		}

		const replyDeleteRes = await transactionAuth("post", "blog/replydelete", obj, "", false, true, setLoadingBarState, setErrorPage); 
		
		if(replyDeleteRes.sendObj.success === 'y'){

			const deleteComentIndex = commentLists.findIndex(element => element._id === comment_id);
			const choosenReplyIndex = commentLists[deleteComentIndex].replies.findIndex((value) => value._id === reply_id);
			
			commentLists[deleteComentIndex].replies[choosenReplyIndex].deleteyn = "y";
			commentLists[deleteComentIndex].repliescnt = replyDeleteRes.sendObj.resObj.repliescnt;
			setCommentLists([...commentLists]);

		}
	}
	 

	return(
		<>
			<div className="" >
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
					
						
						<div className="flex justify-between w-[90vw] ">
							{
							(user.id.length > 0)?
							<div className="flex justify-start">
								<div>
									<button className="tracking-tight border bg-gray-200 hover:bg-gray-400 text-black font-bold py-1 px-4 rounded mb-5"
									onClick={()=>showCommentClickHandler()}
									>
										comment
									</button>
								</div>
								<div className="flex justify-normal ">
									<p className="text-[20px] pt-2 ms-2 cursor-pointer"
									onClick={()=>likeOnclickHandler()}
									>
										{
											(blogListLike)?<BiSolidLike />:<BiLike />
										}
										
									</p>
								</div>
							</div>
							:""
							}

							{
							(user.id.length > 0 && user.blog_seq+"" === props.blog_seq)?
							
							<div className="flex justify-end ">
								<button className="tracking-tight border bg-gray-200 hover:bg-gray-400 text-black font-bold py-1 px-4 rounded mb-5"
								onClick={()=>updatePageMove()}
								>
									Update page
								</button>
								<button className="ms-2 tracking-tight border bg-gray-200 hover:bg-gray-400 text-black font-bold py-1 px-4 rounded mb-5"
								// onClick={()=>deleteHandler()}
								onClick={()=>confirmScreen("Would you like to delete?", "deleteHandler", null)}
								>
									Delete
								</button>
							</div>
							:""
							}
						</div>
						
					
					<div ref={commentRegRef}></div>
					{
						(showComment)?(
							<div  className="items-center bottom-0"> 
								<div className="w-[90vw] ">
									{/* <p className="font-bold">comment</p>  */}
									<div className="w-[100%] ">
									<textarea   
									ref={focusComment} 
									onChange={(e)=>blogCommentOnchangeHandler(e)}
									value={blogComment}
									id="introduction" rows={4}  className="resize-none border w-full px-3 py-1 text-sm bg-grey-200 focus:border-black text-gray-900 outline-none rounded"/>
									</div>
									<div className="flex justify-end">
									<button className="ms-2 tracking-tight border bg-gray-200 hover:bg-gray-400 text-black font-bold py-1 px-4 rounded mb-5"
										// onClick={()=>commentWriteHandler()}
										onClick={()=>confirmScreen("Would you like to comment-write?", "commentWriteHandler", null)}
										

									>
									Comment Write
									</button>
									</div>
								</div>
							</div>
						):""
					}
					
					<div className="w-[90vw] mt-3">
						<p className="font-bold">Comments</p>
					</div>

					<div className="h-[100%]"> 
						{
							(commentLists.length > 0)?
								commentLists.map((item:any, index:any)=>{
									return(
										
										(item.deleteyn === 'y' && item.repliescnt === 0)?
										(
											<div key={index} className="mt-1 p-1 w-[90vw] h-[150px] border ">
												<div className="flex justify-center items-center w-[100%] h-[100%] bg-slate-50">
													<p className="font-bold" >deleted</p> 
												</div>
											</div>
										)
										:(<div key={index} className="mt-1 p-1 w-[90vw] border ">
												<div className="flex justify-start h-[30px]">
													<p className="mx-2 my-2 text-[12px] w-[70%]">
														<Link href={"/blog/"+item.blog_seq}>
														<span className="font-bold">{item.bloginfo.name}</span>
														{
															(item.blog_seq === item.bloginfo.seq)?
															<span className="mx-1 font-bold tracking-tight p-1 border-yellow-300 rounded bg-yellow-100">
															writer
															</span>
															:""
														}
														</Link>
														
														<span className=" hidden
														2xl:inline-block xl:inline-block lg:inline-block md:inline-block sm:hidden
														">
														{` (`+getDate(item.regdate) + `)`}
														</span>
														

														

														{
															(user.id.length > 0)?
															<>
																{
																	(item.deleteyn === 'y' && item.repliescnt > 0)?
																	""
																	:
																	<button className=" ms-1 
																	tracking-tight border bg-gray-200 hover:bg-gray-400 text-black font-bold text-[12px]  px-1 rounded"
																	// onClick={()=>showReplyClickHandler(item._id, index, item.replyYn, item.seq)}
																	onClick={()=>confirmScreen("Would you like to reply-write?", "showReplyClickHandler", {id:item._id, index:index, replyYn:item.replyYn, seq:item.seq})}
																	>
																	{
																		(item.replyYn)?"reply-write":"reply"
																	}
																</button>
																}
																

																{
																	(item.replyYn)?
																	<button className=" ms-1 
																	tracking-tight border bg-gray-200 hover:bg-gray-400 text-black font-bold text-[12px]  px-1 rounded"
																	onClick={()=>showReplyCancleClickHandler(item._id, index, item.replyYn, item.seq)}
																	>
																	X
																</button>
																	:""
																}
																{
																
																}
															</>
															:""
															
														}

														{
															(item.repliescnt > 0)?
															<button className=" ms-1 
																tracking-tight border bg-green-200 hover:bg-green-400 text-black font-bold text-[12px]  px-1 rounded"
																onClick={()=>showRepliest(item._id, item.seq, item.currentReplaySeq)}
																>
																{item.repliescnt}
															</button>
														:""	
														}

													</p>
													
													<div className="w-[49%]">

														<div className="flex justify-end ">
															<p className="me-1">
															
															
															{
																(item.deleteyn === 'y' && item.repliescnt > 0)?""
																:(user.email === item.email)?(
																	<button className="
																	tracking-tight border bg-gray-200 hover:bg-gray-400 text-black font-bold text-[12px]  px-1 rounded"
																	// onClick={()=>commentUpdateYn(item._id, index, item.updateYn)}
																	onClick={()=>confirmScreen("Would you like to comment-update?", "commentUpdateYn", {id:item._id, index:index, updateYn:item.updateYn})}
																	>
																		{
																			(item.updateYn)?"update-save":"update"
																		}

																	</button>
																):""

															}
															
															</p>
															
															<p className="me-1">

																{
																(item.deleteyn === 'y' && item.repliescnt > 0)?""
																:(user.email === item.email)?(
																	<button className="
																	tracking-tight border bg-gray-200 hover:bg-gray-400 text-black font-bold text-[12px]  px-1 rounded"
																	// onClick={()=>deleteComment(item._id)}
																	onClick={()=>confirmScreen("Would you like to delete?", "deleteComment", {id:item._id})}
																	>
																		delete
																	</button>
																):""
																}

															{/* {
																(user.email === item.email)?(
																	<button className="
																	tracking-tight border bg-gray-200 hover:bg-gray-400 text-black font-bold text-[12px]  px-1 rounded"
																	onClick={()=>deleteComment(item._id)}
																	>
																		delete
																	</button>
																):""
															} */}
															
															
															</p>
														</div>
													</div>
												</div>
												{
													(item.replyYn)?
													<textarea className={`mx-2 mt-1 text-sm break-all w-[98%] h-[105px] p-1 
													resize-none border  `} spellCheck={false} 
													ref={(element) => {focusCommentReplyRegRef.current[index] = element;}}
													onChange={(e)=>blogReplyListOnchangeHandler(e, item._id)}
													// value={item.reply}
													/>
													:""
												}
												
												{
													(item.deleteyn === 'y' && item.repliescnt > 0)?

													<div>
														<div className="mt-1 p-1 w-[98%] h-[105px] border ">
															<div className="flex justify-center items-center w-[100%] h-[100%] bg-slate-50">
																<p className="font-bold" >deleted</p> 
															</div>
														</div>
													</div>

													:<textarea className={`mx-2 mt-1 text-sm break-all w-[98%] h-[105px] p-1 
														resize-none border ` + item.style} spellCheck={false} 
														ref={(element) => {focusCommentListRef.current[index] = element;}}
														readOnly={item.readOnly}
														onChange={(e)=>blogCommentListOnchangeHandler(e, item._id)}
														value={item.comment}
														/>

												}

												
												
												{
													(item.replies.length > 0)?
														item.replies.map((replyItem:any, replyIndex:any)=>
														{
															return  (


																(replyItem.deleteyn === 'y')?
																(
																	<div key={replyIndex} className="mt-1 p-1 w-[90vw] h-[140px] ">
																		<div className="ms-2 flex justify-start w-[98%] h-[100%]">
																			<p className=" flex items-center w-[40px] ">
																				<span className="text-[20px]">
																				<MdSubdirectoryArrowRight />
																				</span>
																			</p>
																			<div className="flex justify-center items-center w-[100%] h-[100%] bg-slate-50">
																				<p className="font-bold" >deleted</p> 
																			</div>
																		</div>
																		
																	</div>
																)
																:

																

																<div key={replyIndex} className="ms-2 flex justify-start w-[98%]">
																	<p className=" flex items-center w-[40px] ">
																		<span className="text-[20px]">
																		<MdSubdirectoryArrowRight />
																		</span>
																		
																	</p>
																	<div className=" w-[100%]">

																		<div className="flex justify-start">
																			<p className="my-2 text-[12px] w-[50%]">
																				<Link href={"/blog/"+replyItem.bloginfo.seq}>
																				<span className="font-bold">{replyItem.bloginfo.name}</span>
																				{
																					(item.email === replyItem.email)?
																					<span className="mx-1 font-bold tracking-tight p-1 border-yellow-300 rounded bg-yellow-100">
																					writer
																					</span>
																					:""
																				}
																				</Link>
																				
																				<span className=" hidden
																				2xl:inline-block xl:inline-block lg:inline-block md:inline-block sm:hidden
																				">
																				{` (`+getDate(replyItem.regdate) + `)`}
																				</span>
																			</p>
																			<p className="flex justify-end my-2 w-[50%]">
																				
																				
																				{
																					(user.email === replyItem.email)?(
																						
																							<button className="me-1
																							tracking-tight border bg-gray-200 hover:bg-gray-400 text-black font-bold text-[12px]  px-1 rounded"
																							// onClick={()=>replyUpdateYn(item._id, replyItem._id, replyIndex, replyItem.updateYn)}
																							onClick={()=>confirmScreen("Would you like to reply-update?", "replyUpdateYn", {id:item._id, replyId:replyItem._id, replyIndex:replyIndex, replyUpdateYn:replyItem.updateYn})}
																							>
																								{
																									(replyItem.updateYn)?"update-save":"update"
																								}

																							</button>
																							
																					):""
																				}
																				
																				
																				{
																					(user.email === replyItem.email)?( 
																						
																							<button className="me-1
																							tracking-tight border bg-gray-200 hover:bg-gray-400 text-black font-bold text-[12px]  px-1 rounded"
																							// onClick={()=>deleteReply(item._id, replyItem._id,)}
																							onClick={()=>confirmScreen("Would you like to delete?", "deleteReply", {id:item._id, replyId:replyItem._id})}
																							>
																								delete
																							</button>
																						
																					):""
																				}
																				
																				
																				

																			</p>
																		</div> 
																		<textarea className={`text-sm break-all w-[100%] h-[105px] p-1 
																		resize-none border ` + replyItem.style} spellCheck={false} 
																		ref={(element) => {focusCommentReplyRef.current[replyIndex] = element;}}
																		readOnly={replyItem.readOnly}
																		onChange={(e)=>blogReplyUpdateOnchangeHandler(e, item._id, replyItem._id)}
																		value={replyItem.reply}
																		/>
																	</div>
																</div>
															)
														})

													:""
												}

												{
												(item.repliescnt > 0)?
												<div className="flex justify-end">
													<button className=" ms-1 me-3 mt-2
														tracking-tight border bg-green-200 hover:bg-green-400 text-black font-bold text-[12px]  px-1 rounded"
														onClick={()=>showRepliest(item._id, item.seq, item.currentReplaySeq)}
														>
														view replies
													</button>
												</div>	
												:""	
												}

									</div>)
									)
								})
							: ""
						}

					</div>
					{/* <div className="h-[70px]"></div>  */}
					{
					((user.id.length > 0 && user.blog_seq+"" === props.blog_seq) && bottomCommentButton)?
					<div className="sticky z-60 bottom-3 ">
						<div className="flex justify-end w-[97vw] ">
							<button className="font-bold border border-yellow-600 text-[20px] 
							rounded-full bg-yellow-200 px-2 cursor-pointer"
							onClick={()=>bottomCommentClickHandler()}
							>C</button>
						</div>
					</div> 
					:""
					}
					{
						((user.id.length > 0 && user.blog_seq+"" === props.blog_seq) && bottomCommentBox)?(
							<div className="sticky items-center bottom-5 z-50 border border-black bg-slate-100 px-3"> 
								<div className="w-[77vw] ">
									<p className="font-bold">comment</p> 
									<div className="w-[100%] ">
									<textarea  
									ref={focusBottomCommentBox} 
									onChange={(e)=>blogCommentOnchangeHandler(e)}
									value={blogComment}
									id="introduction" rows={4}  className="resize-none border w-full px-3 py-1 text-sm bg-grey-200 focus:border-black text-gray-900 outline-none rounded"/>
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
			{/* <div ref={scrollRef} className="bg-slate-600">test</div>  */}
			<div ref={observerEl} className="h-1"/>
		</div>

		{showConfirm && <Confirm confirmStr={confirmStr} setShowConfirm={setShowConfirm} setConfirmRes={setConfirmRes}/>}
              

		</>
	)
};
export default PriBlogListDetail;

