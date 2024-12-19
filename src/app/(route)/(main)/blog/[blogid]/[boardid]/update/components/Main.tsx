'use client';

import { userState } from "@/app/store/user";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import UpdateForm from "./UpdateForm";
import LoginMove from "@/app/components/common/LoginMove";
import { useRouter } from "next/navigation";


const PriBlogUpdate = (props: any) => {
	const [user, setUser] = useRecoilState(userState);
	const [updateYn, setUpdateYn] = useState(false);
	const router = useRouter();


	useEffect(()=>{
		
		if(user.id.length > 0 ){
			if(user.blog_seq != props.blog_seq){
				router.push('/blog/' + user.blog_seq + "?refresh=refresh");
			}else{
				setUpdateYn(true); 
			}
		}else{
			setUpdateYn(false);
		}
	}, [user])
	
	
	return(
		<>
			{
				(updateYn)?
				<><UpdateForm blog_seq={props.blog_seq} seq={props.seq}></UpdateForm></>:
				<><LoginMove></LoginMove></>
			}
		</>
	)
};
export default PriBlogUpdate;