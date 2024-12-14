'use client';

import { userState } from "@/app/store/user";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import WriteForm from "./WriteForm";
import LoginMove from "@/app/components/common/LoginMove";
import { useRouter } from "next/navigation";



const PriBlogWrite = (props: any) => {
	const [user, setUser] = useRecoilState(userState);
	const [writeYn, setWriteYn] = useState(false);
	const router = useRouter();
	
	useEffect(()=>{
		// if(user.id.length > 0 && user.blog_seq === props.blog_seq){
		if(user.id.length > 0 ){		
			if(user.blog_seq != props.blog_seq){
				router.push('/blog/' + user.blog_seq + "/write");
			}else{
				setWriteYn(true); 
			}

		}else{
			setWriteYn(false);
		}
	}, [user])
	
	
	return(
		<>
			{
				(writeYn)?
				// <><WriteForm></WriteForm></>:
				<><WriteForm></WriteForm></>:
				<><LoginMove></LoginMove></>
			}
		</>
	)
};
export default PriBlogWrite;