import axios from "axios";

const axiosNoAuth = axios.create({
	baseURL : process.env.API_URL, 
	withCredentials: true,
})

const transaction = async (type:string, url:string, obj:any, callback:any, callbackYn:boolean, loadingScreenYn:any, setLoadingYn:any, setErrorPage:any) => {
	
	if(loadingScreenYn === true) setLoadingYn(true);
	try{
		let resp:any, data:any;
		if(type === "get"){
			// resp = await axiosNoAuth.get(url ,obj);
			resp = await axiosNoAuth.get(url, {params:obj});
			data = await resp.data;
		}else if(type === "post"){
			resp = await axiosNoAuth.post(url ,obj);
			data = await resp.data;
		}

		if(loadingScreenYn === true) setLoadingYn(false);


		if(url==="signin" || url==="googlesignin"){
			data.refreshToken = resp.headers.refreshtoken;
			if(callbackYn){
				callback(data);
			}else{
				return data;
			}
		}else if(url==="getAccessToken"){
			// console.log("getAccessToken");
			// console.log(data);
			if(data.sendObj.success==="y"){
				data.accessToken = resp.headers.accesstoken;	
			}
			if(callbackYn){
				callback(data);
			}else{
				return data;
			}
		}
		else{
			if(callbackYn){
				callback(data);
			}else{
				return data;
			}
		}
		
	}
	catch(error:any){
		if(loadingScreenYn === true) setLoadingYn(false);
		// console.log(error.response.data.resObj.message);
		// console.log(error.response.data.message);
		if(setErrorPage !== null) setErrorPage(true);
		if(error){
			if(callbackYn){
				callback("", error.response.data);
			}else{
				const resObj = {
					sendObj : {
						success : "n"
					}
				}
				return resObj;
			}
		}
	}
}


export {transaction}; 