'use client';

import { userState } from "@/app/store/user";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import AboutMeForm from "./AboutMeForm";



const PriBlogWrite = (props: any) => {

	return(
		<>
			{
				<><AboutMeForm blog_seq={props.blog_seq}/></>
			}
		</>
	)
};
export default PriBlogWrite;