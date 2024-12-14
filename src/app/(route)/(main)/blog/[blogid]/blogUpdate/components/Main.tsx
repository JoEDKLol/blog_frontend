'use client';

import { userState } from "@/app/store/user";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import BlogUpdateForm from "./BlogUpdateForm";
import LoginMove from "@/app/components/common/LoginMove";
import { useRouter } from "next/navigation";



const PriBlogUpdate = (props: any) => {
	const [user, setUser] = useRecoilState(userState);
	const [writeYn, setWriteYn] = useState(false);
	const router = useRouter();

	useEffect(()=>{
		if(user.id.length > 0 ){
			if(user.blog_seq != props.blog_seq){
				router.push('/blog/' + user.blog_seq + "/blogupdate");
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
				<><BlogUpdateForm></BlogUpdateForm></>:
				<><LoginMove></LoginMove></>
			}
		</>
	)
};
export default PriBlogUpdate;