'use client';

import { userState } from "@/app/store/user";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import dynamic from "next/dynamic";
import 'react-quill/dist/quill.snow.css';
import ReactQuill, { ReactQuillProps } from 'react-quill';
import { loadingBarState } from "@/app/store/loadingBar";
import Confirm from "@/app/components/confirmModal";
import Image from "next/image";

import { MdEmail } from "react-icons/md"; //<MdEmail />
import { FaLinkedin } from "react-icons/fa"; //<FaLinkedin />
import { FaPhoneSquare } from "react-icons/fa";  //<FaPhoneSquare />
import { FaAddressCard } from "react-icons/fa6";  //<FaAddressCard />
import { transaction } from "@/app/utils/axios";
import { errorPageState } from "@/app/store/error";
	
	interface ForwardedQuillComponent extends ReactQuillProps {
		forwardedRef: React.Ref<ReactQuill>;
	}
	// const randomNum = getRandomNumber(10);
	let randomNum:any; //aboutme 정보가 없으면 새롭게 번호를 가져옴.
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
	// let majorIndex = -1;
	// let subIndex = -1;
	// export default function QuillEditor(){
	const AboutMeForm = (props: any) => {
		// const focusTitle = useRef<HTMLInputElement>(null);
		const quillRef = useRef<any>(ReactQuill);
		const [content, setContent] = useState("");
		const [user, setUser] = useRecoilState(userState);
		
		const [updateSuc, setUpdateSuc] = useState(false);
		

		const [loadingBar, setLoadingBarState] = useRecoilState(loadingBarState);
		const [errorPage, setErrorPage] = useRecoilState(errorPageState);


		//confirm
		const [showConfirm, setShowConfirm] = useState(false);
		const [confirmStr, setConfirmStr] = useState({showText:"", exeFunction:"", obj:null as any});
		const [confirmRes, setConfirmRes] = useState(false);

		const [img, setImg] = useState<any>("");
		const [imgDelete, setImgDelete] = useState<any>(false);
		const [thumbImg, setThumbImg] = useState<any>("");
		const [name, setName] = useState("");
		const [jobTitle, setJobTitle] = useState("");
		const [email, setEmail] = useState("");
		const [phone, setPhone] = useState("");
		const [linkedIn, setLinkedIn] = useState("");
		const [address, setAddress] = useState("");
		const [summary, setSummary] = useState("");
		const [aboutMeId, setAboutMeId] = useState<any>("");
		const [contact, setContact] = useState("");
		const [contactShow, setContactShow] = useState("hidden");
		const [goShow, setGoshow] = useState(false);

		const focusContact = useRef<HTMLInputElement>(null);

		// useEffect(()=>{
		// 	if(confirmRes){ 
		// 		// focusCommentReplyRef.current[replyCommnetIndex]?.focus();
		// 		if(confirmStr.exeFunction === "updateButtenHandler") updateButtenHandler();
		// 		setConfirmRes(false);
		// 	}
		// },[confirmRes])
	
		function confirmScreen(showText:string, exeFunction:string, obj:any){
			setShowConfirm(!showConfirm);
			setConfirmStr({showText:"", exeFunction:"", obj:null}); 
			setConfirmStr({showText:showText, exeFunction:exeFunction, obj:obj});
		}

		//validation
		useEffect(()=>{
			let totalByte = 0;
			for(let i =0; i < name.length; i++) {
				let currentByte = name.charCodeAt(i);
				if(currentByte > 128){
					totalByte += 2;
				}else {
					totalByte++;
				}

				if(totalByte > 100){
					setName(name.substring(0, i));
					break;
				}
			}			
		},[name]);

		useEffect(()=>{
			let totalByte = 0;
			for(let i =0; i < jobTitle.length; i++) {
				let currentByte = jobTitle.charCodeAt(i);
				if(currentByte > 128){
					totalByte += 2;
				}else {
					totalByte++;
				}

				if(totalByte > 100){
					setJobTitle(jobTitle.substring(0, i));
					break;
				}
			}			
		},[jobTitle]);


		useEffect(()=>{
			let totalByte = 0;
			for(let i =0; i < email.length; i++) {
				let currentByte = email.charCodeAt(i);
				if(currentByte > 128){
					totalByte += 2;
				}else {
					totalByte++;
				}

				if(totalByte > 100){
					setEmail(email.substring(0, i));
					break;
				}
			}			
		},[email]);
		
		useEffect(()=>{
			let totalByte = 0;
			for(let i =0; i < phone.length; i++) {
				let currentByte = phone.charCodeAt(i);
				if(currentByte > 128){
					totalByte += 2;
				}else {
					totalByte++;
				}

				if(totalByte > 20){
					setPhone(phone.substring(0, i));
					break;
				}
			}
		},[phone]);

		useEffect(()=>{
			let totalByte = 0;
			for(let i =0; i < linkedIn.length; i++) {
				let currentByte = linkedIn.charCodeAt(i);
				if(currentByte > 128){
					totalByte += 2;
				}else {
					totalByte++;
				}

				if(totalByte > 100){
					setLinkedIn(linkedIn.substring(0, i));
					break;
				}
			}
		},[linkedIn]);

		useEffect(()=>{
			let totalByte = 0;
			for(let i =0; i < address.length; i++) {
				let currentByte = address.charCodeAt(i);
				if(currentByte > 128){
					totalByte += 2;
				}else {
					totalByte++;
				}

				if(totalByte > 100){
					setAddress(address.substring(0, i));
					break;
				}
			}
		},[address]);

		useEffect(()=>{
			let totalByte = 0;
			for(let i =0; i < summary.length; i++) {
				let currentByte = summary.charCodeAt(i);
				if(currentByte > 128){
					totalByte += 2;
				}else {
					totalByte++;
				}

				if(totalByte > 1000){
					setSummary(summary.substring(0, i));
					break;
				}
			}
		},[summary]);

		useEffect(()=>{
			
			if(contact){
				focusContact.current?.focus();
			}

		},[contact]);


		useEffect(()=>{
			getAboutme();
		}, [])

		async function getAboutme(){
			const obj = {
				blog_seq:props.blog_seq,
			}

			const aboutmeRes = await transaction("get", "blog/aboutme", obj, "", false, true, setLoadingBarState, setErrorPage);

			if(aboutmeRes.sendObj.success === "y"){
				const resObj = aboutmeRes.sendObj.resObj;
				
				if(resObj){
					setImg(resObj.aboutme_img)
					setThumbImg(resObj.aboutme_thumbnailimg)
					setName(resObj.aboutme_name)
					setJobTitle(resObj.jobtitle)
					setEmail(resObj.aboutme_email)
					setPhone(resObj.aboutme_phone)
					setLinkedIn(resObj.aboutme_linkedin)
					setAddress(resObj.aboutme_address)
					setSummary(resObj.summary)
					setContent(resObj.content)
					setAboutMeId(resObj._id)
				}
			}
		}


		const modules = useMemo( 
			() => (
				{
				toolbar: null,
				
			}),
			[],
		);

		
		function nameOnchangeHandler(e:any){
			setName(e.target.value);
		}

		function jobTitleOnchangeHandler(e:any){
			setJobTitle(e.target.value);
		}
		
		function emailOnchangeHandler(e:any){
			setEmail(e.target.value);
		}

		function phoneOnchangeHandler(e:any){
			setPhone(e.target.value);
		}

		function linkedInOnchangeHandler(e:any){
			setLinkedIn(e.target.value);
		}

		function addressOnchangeHandler(e:any){
			setAddress(e.target.value);
		}

		function summaryOnchangeHandler(e:any){
			setSummary(e.target.value);
		}

		function contactsClickHandler(sel:any){
			setGoshow(false);

			if(contactShow === "block"){
				setContactShow("hidden");
				return;	
			}

			if(sel==="email") setContact(email);
			if(sel==="linkedIn"){
				setContact(linkedIn); 
				setGoshow(true);
			} 
			if(sel==="phone") setContact(phone);
			if(sel==="address") setContact(address);
			// await navigator.clipboard.writeText(email);
			// const clipboardData = e.clipboardData || window.Clipboard;
			setContactShow("block");
			focusContact.current?.focus();
		}

		async function copyOnclickHandler(){
			await navigator.clipboard.writeText(contact);
			setContactShow("hidden");
			setGoshow(false);
		}

		async function goOnclickHandler(){
			window.open(linkedIn)
			setContactShow("hidden");
			setGoshow(false);
		}

		return (
			
			<>

				<div className="grid place-items-center grid-cols-1">

					<div className="flex-none justify-center my-5 w-[100%] mb-10  
					2xl:justify-start xl:justify-start lg:justify-start md:justify-start sm:justify-center
					2xl:flex xl:flex lg:flex md:flex sm:flex-none
					">
						<div className="flex justify-center mb-5
						2xl:w-[250px] xl:w-[250px] lg:w-[250px] md:w-[250px]
						2xl:ms-5 xl:ms-5 lg:ms-5 md:ms-5 
						">
							<div className="h-[255px]">
								<div className=' ring-1 w-[230px] h-[225px] ring-gray-300 rounded-xl relative border ' >
									{img ? (
										
												<Image 
												src={img}
												quality={30}
												layout="fill"
												style={{ objectFit: "cover" , borderRadius: '10px' }}
												alt='' />
										) : ""
									}
								</div>
								<div className=" flex justify-center justify-items-start px-3 mt-1">
									<p className="text-[32px] me-3 hover:text-[37px] cursor-pointer"
									onClick={(e)=>contactsClickHandler("email")}
									><MdEmail /></p>
									<p className="text-[25px] me-3 hover:text-[30px] cursor-pointer pt-1" 
									onClick={(e)=>contactsClickHandler("phone")}
									>< FaPhoneSquare/></p>
									<p className="text-[25px] me-3 hover:text-[30px] cursor-pointer pt-1"
									onClick={(e)=>contactsClickHandler("linkedIn")}
									><FaLinkedin /></p>
									<p className="text-[28px] hover:text-[33px] cursor-pointer pt-0.5 "
									onClick={(e)=>contactsClickHandler("address")}
									><FaAddressCard /></p>
								</div>

								{
									// (contactShow)?(
										<div className={`mt-1 bg-slate-400 p-0.5 rounded ` + contactShow}>
											
											<div className="flex justify-center ">
												<input 
												value={contact}
												ref={focusContact}
												// onBlur={()=>setContactShow(false)}
												readOnly={true}
												autoComplete="off" id="content" type="text"  className="me-0.5 border w-full p-0.5 text-xs bg-grey-200 focus:border-black text-gray-900 outline-none rounded"/>									
												<button className="border bg-gray-200 hover:bg-gray-400 text-[10px] font-bold p-0.5 rounded"
												onClick={(e)=>copyOnclickHandler()}
												>
													copy
												</button>
												{
													(goShow)?
													<button className="border bg-gray-200 hover:bg-gray-400 text-[10px] font-bold p-0.5 ms-0.5 rounded"
													onClick={(e)=>goOnclickHandler()}
													>
														go
													</button>:""
												}
											</div>
											
										</div>
									// ):""
								}
									

							</div>
							
						</div>


						
						<div className=" w-[100%] mt-10 
						2xl:mt-0 xl:mt-0 lg:mt-0 md:mt-0 sm:mt-10
						">
							<p className="mx-2 mb-2 text-3xl font-bold truncate">{name}</p>
							<p className="mx-2 mb-2 text-xl font-bold truncate">{jobTitle}</p>
							<div className="w-[100%]">
								<div className=" mx-2 whitespace-pre-line mt-2 text-sm break-all">{summary}</div>
							</div>
						</div>
						
					</div>
						
					<div className="flex justify-center pb-2  mb-2 w-[100%]
					2xl:w-[80%] xl:w-[80%] lg:w-[80%] md:w-[80%] sm:w-[100%]
					">	
						<div className="">  
							<QuillNoSSRWrapper 
							theme="snow" 
							style={{
								height: "100vh"
								, width: "95vw"
							}}
							forwardedRef={quillRef}
							readOnly
							value={content}
							modules={
								modules
							}/>
						</div>
						
					</div>
					{/* <div className="mt-16 pe-16 flex justify-end bg-slate-700
					 w-[100%]
					2xl:w-m-10 xl:m-10 lg:m-10 md:m-10 sm:mt-16
					"> */}
						{/* <button className="border bg-gray-200 hover:bg-gray-400 text-black font-bold py-1 px-4 rounded mb-5"
						onClick={()=>writeButtenHandler()}
						>
							Write
						</button> */}
					{/* </div> */}
				</div>
			
			{showConfirm && <Confirm confirmStr={confirmStr} setShowConfirm={setShowConfirm} setConfirmRes={setConfirmRes}/>}
			</>	
			
		)

	};
	export default AboutMeForm;


