'use client';

import { userState } from "@/app/store/user";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import UpdateForm from "./UpdateForm";


const PriBlogUpdate = (props: any) => {
	const [user, setUser] = useRecoilState(userState);
	const [updateYn, setUpdateYn] = useState(false);
	
	useEffect(()=>{
		
		if(user.id.length > 0 && user.blog_seq+"" === props.blog_seq){
			setUpdateYn(true);
		}else{
			setUpdateYn(false);
		}
	}, [user])
	
	
	return(
		<>
			{
				(updateYn)?
				<><UpdateForm blog_seq={props.blog_seq} seq={props.seq}></UpdateForm></>:
				<>You need to Login.</>
			}
		</>
	)
};
export default PriBlogUpdate;