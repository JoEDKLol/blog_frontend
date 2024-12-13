'use client';

import { userState } from "@/app/store/user";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import WriteForm from "./WriteForm";
import LoginMove from "@/app/components/common/LoginMove";



const PriBlogWrite = (props: any) => {
	const [user, setUser] = useRecoilState(userState);
	const [writeYn, setWriteYn] = useState(false);
	

	useEffect(()=>{
		console.log(user);
		if(user.id.length > 0 && user.blog_seq+"" === props.blog_seq){
			setWriteYn(true);
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