'use client';

import { userState } from "@/app/store/user";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import AboutMeUpdateForm from "./AboutMeUpdateForm";
import LoginMove from "@/app/components/common/LoginMove";
import { useRouter } from "next/navigation";



const AboutMeUpdateMain = (props: any) => {
	const [user, setUser] = useRecoilState(userState);
	const [writeYn, setWriteYn] = useState(false);
	const router = useRouter();

	useEffect(()=>{
		if(user.id.length > 0 ){
			if(user.blog_seq != props.blog_seq){
				router.push('/blog/' + user.blog_seq + "/aboutmeupdate");
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
				<><AboutMeUpdateForm blog_seq={props.blog_seq}></AboutMeUpdateForm></>:
				<><LoginMove></LoginMove></>
			}
			
			
		</>
	)
};
export default AboutMeUpdateMain;