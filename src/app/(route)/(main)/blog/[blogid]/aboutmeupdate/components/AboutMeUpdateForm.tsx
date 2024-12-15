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
import { useRouter,usePathname } from "next/navigation";
import { loadingBarState } from "@/app/store/loadingBar";
import Confirm from "@/app/components/confirmModal";

import imageCompression from "browser-image-compression";
import Image from "next/image";

import { InputMask } from '@react-input/mask';
import { errorPageState } from "@/app/store/error";
import { transaction } from "@/app/utils/axios";
	
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
	const AboutMeUpdateForm = (props: any) => {
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
			getAboutme();
		}, [])

		async function getAboutme(){
			const obj = {
				blog_seq:props.blog_seq,
			}

			const aboutmeRes = await transaction("get", "blog/aboutme", obj, "", false, true, setLoadingBarState, setErrorPage);
			// console.log(aboutmeRes.sendObj);

			if(aboutmeRes.sendObj.success === "y"){
				// console.log(aboutmeRes.sendObj.resObj);

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
		async function fileUploadHandler(e:any){

			// - 백앤드 이미지 저장 사용 temp 저장 후 url 반환 
				// - 저장 누르면 해당 temp 삭제 및 실제 저장
			// - 새로운 이미지 선택시 기존 temp 삭제 및 새로 temp 저장 
			// - 사이즈 조정 
			const file = e.target.files[0]; 
			
			if(!file) return;
	
	
			const options = {
				maxSizeMB: 0.2, // 이미지 최대 용량
				maxWidthOrHeight: 1920, // 최대 넓이(혹은 높이)
				useWebWorker: true,
			};
	
			try {
	
				const compressedFile = await imageCompression(file, options);
				
				const obj = {
					user_id : user.id,
					email : user.email,
					randomNum : randomNum, 
					blog_seq : user.blog_seq
				}
	
				
				const imgUploadRes = await transactionFile("blog/fileUpload", compressedFile, obj, "", false, true, setLoadingBarState, setErrorPage);
		
				if(imgUploadRes.sendObj.success === 'y'){
					// console.log(imgUploadRes.sendObj.resObj);
					setImg(imgUploadRes.sendObj.resObj.img_url);
					setImgDelete(false);
					setThumbImg(imgUploadRes.sendObj.resObj.thumbImg_url);
					
				}else{
					
				}
	
	
			} catch (error) {
				console.log(error)
			}

		}

		function deleteImg(){
			setImg("");
			setImgDelete(true);
		}

		const modules = useMemo( 
			() => ({
				toolbar: {
					container: [
						[{ header: [1, 2, false] }],
						['bold', 'italic', 'underline', 'strike', 'blockquote'],
						[{ list: 'ordered' }, { list: 'bullet' }],
						// ["link", "image", "video"],
						['clean'],
						[{ color: [] }, { background: [] }],
						[{ align: [] }],
					],
				},
			}),
			[],
		);

		async function updateButtenHandler(){
			
			const obj = {
				aboutme_id : aboutMeId,
				user_id : user.id,
				user_email : user.email,
				blog_id:user.blog_id,
				blog_seq:user.blog_seq,
				temp_num:randomNum,
				aboutme_thumbnailimg:thumbImg,
				aboutme_img:img,
				name:name,
				jobTitle:jobTitle,
				email:email,
				phone:phone,
				linkedIn:linkedIn,
				address:address,
				summary:summary,
				content:content

			}

			// console.log(obj);
			
			const aboutmeUpdateRes = await transactionAuth("post", "blog/aboutmeupdate", obj, "", false, true, setLoadingBarState, setErrorPage);
			// console.log(aboutmeUpdateRes.sendObj.success );

			if(aboutmeUpdateRes.sendObj.success === 'y'){
				setUpdateSuc(true);
			}else{
				
			}
		}
		const router = useRouter();
		function movetoAboutMe(){
			router.push('/blog/' + props.blog_seq + "/aboutme")
		} 

		// function changeMajorCategory(e:any){
		// 	setMajorIndex(Number(e.target.value));
		// 	setChooseMajor(Number(e.target.value));
		// }
		// function changeSubCategory(e:any){
		// 	setChooseSub(Number(e.target.value));
		// }


		
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

	

		return (
			
			<>

			{updateSuc ? 
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
						onClick={()=>movetoAboutMe()}
						>
							About me
						</button>
					</div>
					
				</div>):
			
			
				(<div className="grid place-items-center grid-cols-1">

					<div className="my-5">
						<div className='ring-1 w-[230px] h-[225px] ring-gray-300 rounded-xl relative border ' >
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
					</div>
					<div className="flex justify-center border-gray-200 pb-2 mb-2">
						<div className="me-1">
							<label className="cursor-pointer w-[130px] border hover:bg-gray-400 text-black font-bold py-1 px-4 rounded bg-gray-200" htmlFor="file_input">
									Upload Img
							</label>
							<input className="w-[340px]
							2xl:w-[440px] xl:w-[440px] lg:w-[440px] md:w-[440px] sm:w-[340px]
							text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer
							hidden
							" id="file_input" type="file"
							accept="image/*" 
							onChange={(e)=>fileUploadHandler(e)}
							
							>
							</input>

						</div>
						<div>
							<label className="cursor-pointer w-[130px] border hover:bg-gray-400 text-black font-bold py-1 px-4 rounded bg-gray-200"
							htmlFor="img_delete"
							onClick={()=>deleteImg()}
							>
								Delete
							</label>
						</div>
					</div>

					{/* <div className="grid place-items-center grid-cols-1"> */}
						<div className="font-bold w-[100%] h-[30px] text-start visible ps-2
									2xl:h-[0px] xl:h-[0px] lg:h-[0px] md:h-[0px] sm:h-[30px]
									2xl:invisible xl:invisible lg:invisible md:invisible sm:visible
									">
						Name</div>
						<div className="flex justify-center border-b border-gray-200 pb-2 mb-2
						w-[100%] 2xl:w-[80%] xl:w-[80%] lg:w-[80%] md:w-[80%] sm:w-[100%]">
							<div className="font-bold w-[0px] invisible
							2xl:w-[100px] xl:w-[100px] lg:w-[100px] md:w-[100px] sm:w-[0px]
							2xl:visible xl:visible lg:visible md:visible sm:invisible
							">Name
							</div>
							<div className="w-[100%] ">
								<input 
								// ref={focusTitle} 
								onChange={(e)=>nameOnchangeHandler(e)}
								value={name}
								autoComplete="off" id="name" type="text"  className="border w-full px-3 py-2 text-sm bg-grey-200 focus:border-black text-gray-900 outline-none rounded"/>
							</div>
						</div>

						<div className="font-bold w-[100%] h-[30px] text-start visible ps-2
								2xl:h-[0px] xl:h-[0px] lg:h-[0px] md:h-[0px] sm:h-[30px]
								2xl:invisible xl:invisible lg:invisible md:invisible sm:visible
								">
						Job Title</div>
						<div className="flex justify-center border-b border-gray-200 pb-2 mb-2
						w-[100%] 2xl:w-[80%] xl:w-[80%] lg:w-[80%] md:w-[80%] sm:w-[100%]">
							<div className="font-bold w-[0px] invisible
							2xl:w-[100px] xl:w-[100px] lg:w-[100px] md:w-[100px] sm:w-[0px]
							2xl:visible xl:visible lg:visible md:visible sm:invisible
							">Job Title
							</div>
							<div className="w-[100%] ">
								<input 
								// ref={focusTitle} 
								onChange={(e)=>jobTitleOnchangeHandler(e)}
								value={jobTitle}
								autoComplete="off" id="jobTitle" type="text"  className="border w-full px-3 py-2 text-sm bg-grey-200 focus:border-black text-gray-900 outline-none rounded"/>
							</div>
						</div>

						<div className="font-bold w-[100%] h-[30px] text-start visible ps-2
								2xl:h-[0px] xl:h-[0px] lg:h-[0px] md:h-[0px] sm:h-[30px]
								2xl:invisible xl:invisible lg:invisible md:invisible sm:visible
								">
						Email</div>
						<div className="flex justify-center border-b border-gray-200 pb-2 mb-2
						w-[100%] 2xl:w-[80%] xl:w-[80%] lg:w-[80%] md:w-[80%] sm:w-[100%]">
							<div className="font-bold w-[0px] invisible
							2xl:w-[100px] xl:w-[100px] lg:w-[100px] md:w-[100px] sm:w-[0px]
							2xl:visible xl:visible lg:visible md:visible sm:invisible
							">Email
							</div>
							<div className="w-[100%] ">
								<input 
								// ref={focusTitle} 
								onChange={(e)=>emailOnchangeHandler(e)}
								value={email}
								autoComplete="off" id="email" type="text"  className="border w-full px-3 py-2 text-sm bg-grey-200 focus:border-black text-gray-900 outline-none rounded"/>
							</div>
						</div>

						<div className="font-bold w-[100%] h-[30px] text-start visible ps-2
								2xl:h-[0px] xl:h-[0px] lg:h-[0px] md:h-[0px] sm:h-[30px]
								2xl:invisible xl:invisible lg:invisible md:invisible sm:visible
								">
						Phone</div>
						<div className="flex justify-center border-b border-gray-200 pb-2 mb-2
						w-[100%] 2xl:w-[80%] xl:w-[80%] lg:w-[80%] md:w-[80%] sm:w-[100%]">
							<div className="font-bold w-[0px] invisible
							2xl:w-[100px] xl:w-[100px] lg:w-[100px] md:w-[100px] sm:w-[0px]
							2xl:visible xl:visible lg:visible md:visible sm:invisible
							">Phone
							</div>
							<div className="w-[100%] ">
							<InputMask 
							mask="(___) ___-____" replacement={{ _: /\d/ }} 
							style={
								{width: "100%", height:"38px", 
									border:"1px solid ",
									borderRadius: "0.25rem",
									borderColor: "rgb(229 231 235)",
									outline: "2px solid transparent",
									padding: "10px",
									fontSize: "0.875rem",

								}}
								
							onChange={(e)=>phoneOnchangeHandler(e)}
							onFocus={(e) => e.target.style.border = '1px solid black'}
							onBlur={(e) => e.target.style.border = '1px solid rgb(229 231 235)'} 
							value={phone}
							/>
								{/* <input 
								// ref={focusTitle} 
								onChange={(e)=>phoneOnchangeHandler(e)}
								value={phone}
								autoComplete="off" id="phone" type="text"  className="border w-full px-3 py-2 text-sm bg-grey-200 focus:border-black text-gray-900 outline-none rounded"/> */}
							</div>
						</div>

						<div className="font-bold w-[100%] h-[30px] text-start visible ps-2
								2xl:h-[0px] xl:h-[0px] lg:h-[0px] md:h-[0px] sm:h-[30px]
								2xl:invisible xl:invisible lg:invisible md:invisible sm:visible
								">
						LinkedIn</div>
						<div className="flex justify-center border-b border-gray-200 pb-2 mb-2
						w-[100%] 2xl:w-[80%] xl:w-[80%] lg:w-[80%] md:w-[80%] sm:w-[100%]">
							<div className="font-bold w-[0px] invisible
							2xl:w-[100px] xl:w-[100px] lg:w-[100px] md:w-[100px] sm:w-[0px] 
							2xl:visible xl:visible lg:visible md:visible sm:invisible
							">LinkedIn
							</div>
							<div className="w-[100%] ">
								<input 
								// ref={focusTitle} 
								onChange={(e)=>linkedInOnchangeHandler(e)}
								value={linkedIn}
								autoComplete="off" id="linkedIn" type="text"  className="border w-full px-3 py-2 text-sm bg-grey-200 focus:border-black text-gray-900 outline-none rounded"/>
							</div>
						</div>

						<div className="font-bold w-[100%] h-[30px] text-start visible ps-2
								2xl:h-[0px] xl:h-[0px] lg:h-[0px] md:h-[0px] sm:h-[30px]
								2xl:invisible xl:invisible lg:invisible md:invisible sm:visible
								">
						Address</div>
						<div className="flex justify-center border-b border-gray-200 pb-2 mb-2
						w-[100%] 2xl:w-[80%] xl:w-[80%] lg:w-[80%] md:w-[80%] sm:w-[100%]">
							<div className="font-bold w-[0px] invisible
							2xl:w-[100px] xl:w-[100px] lg:w-[100px] md:w-[100px] sm:w-[0px]
							2xl:visible xl:visible lg:visible md:visible sm:invisible
							">Address
							</div>
							<div className="w-[100%] ">
								<input 
								// ref={focusTitle} 
								onChange={(e)=>addressOnchangeHandler(e)}
								value={address}
								autoComplete="off" id="address" type="text"  className="border w-full px-3 py-2 text-sm bg-grey-200 focus:border-black text-gray-900 outline-none rounded"/>
							</div>
						</div>

						<div className="font-bold w-[100%] h-[30px] text-start visible ps-2
								2xl:h-[0px] xl:h-[0px] lg:h-[0px] md:h-[0px] sm:h-[30px]
								2xl:invisible xl:invisible lg:invisible md:invisible sm:visible
								">
						Summary</div>
						<div className="flex justify-center border-b border-gray-200 pb-2 mb-2
						 w-[100%] 2xl:w-[80%] xl:w-[80%] lg:w-[80%] md:w-[80%] sm:w-[100%]">

							<div className="font-bold w-[0px] invisible
							2xl:w-[100px] xl:w-[100px] lg:w-[100px] md:w-[100px] sm:w-[0px]
							2xl:visible xl:visible lg:visible md:visible sm:invisible
							">Summary
							</div>
							<div className="w-[100%] ">
								<textarea  
								// ref={focusTitle} 
								onChange={(e)=>summaryOnchangeHandler(e)}
								value={summary}
								id="summary" rows={5}  className="border w-full px-3 py-2 text-sm bg-grey-200 focus:border-black text-gray-900 outline-none rounded"/>
							</div>
						</div>
						
					

					<div className="font-bold w-[100%] h-[30px] text-start visible ps-2
						2xl:h-[0px] xl:h-[0px] lg:h-[0px] md:h-[0px] sm:h-[30px]
						2xl:invisible xl:invisible lg:invisible md:invisible sm:visible
						">
					AboutMe</div>
					<div className="flex justify-center pb-2 border-b mb-2 w-[100%]
					2xl:w-[80%] xl:w-[80%] lg:w-[80%] md:w-[80%] sm:w-[100%]
					">	
						<div className="font-bold w-[0px] invisible
						2xl:w-[100px] xl:w-[100px] lg:w-[100px] md:w-[100px] sm:w-[0px]
						2xl:visible xl:visible lg:visible md:visible sm:invisible
						">AboutMe</div>	 
						<div className="h-[400px] w-[100%]">  
							<QuillNoSSRWrapper 
							theme="snow" 
							style={{height: "100%"}}
							forwardedRef={quillRef}
							value={content}
							onChange={setContent}
							modules={
								modules
							}/>
							<div className="flex justify-end">
								<button className=" mt-20 border bg-gray-200 hover:bg-gray-400 text-black font-bold py-1 px-4 rounded mb-5
								2xl:mt-14 xl:mt-14 lg:mt-14 md:mt-20 sm:mt-14"
								// onClick={()=>writeButtenHandler()}
								onClick={()=>confirmScreen("Would you like to update?", "updateButtenHandler", null)}
								>
									Update
								</button>
							</div>	
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
				</div>)
			}
			{showConfirm && <Confirm confirmStr={confirmStr} setShowConfirm={setShowConfirm} setConfirmRes={setConfirmRes}/>}
			</>	
			
		)

	};
	export default AboutMeUpdateForm;


