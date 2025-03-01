import axios from "axios";
import { getAccessToken, storeAccessToken } from "./common";

const axiosAuth = axios.create({
	baseURL : process.env.API_URL, 
	withCredentials: true,
})

axiosAuth.interceptors.request.use((config)=>{
	config.headers["accesstoken"] = getAccessToken();
	return config;
})

const transactionAuth = async (type:string, url:string, obj:any, callback:any, callbackYn:boolean, loadingScreenYn:any, setLoadingYn:any, setErrorPage:any) => {
	if(loadingScreenYn === true) setLoadingYn(true);
	try{
        let resp:any, data:any;
		if(type === "get"){
			// console.log(url);
			resp = await axiosAuth.get(url, {params:obj});
			data = await resp.data;
		}else if(type === "post"){
			resp = await axiosAuth.post(url ,obj);
			data = await resp.data;
		}

		if(url===""){

			if(loadingScreenYn === true) setLoadingYn(false);
			
			if(callbackYn){
				callback(data);
			}else{
				return data;
			}
		}else{
			
			if(data.sendObj.code === "2011"){ //access token check failed
				resp = await axiosAuth.get('getAccessToken', {});
				data = await resp.data;

				if(data.sendObj.success){
					storeAccessToken(resp.headers.accesstoken);
					let _resp:any, _data:any;
					if(type === "get"){
						_resp = await axiosAuth.get(url, {params:obj});
						_data = await _resp.data;
					}else if(type === "post"){
						_resp = await axiosAuth.post(url ,obj);
						_data = await _resp.data;
					}
					// console.log("재처리::", _data);
					if(_data.success){
						// console.log("조회성공");
						_data.user = data.user;
						_data.regetAccessToken = true;
						// data = _data;
					}

					data = _data;
				}else{
					//failed 
					data.refreshTokenCheckFail = true;
				}

			}

		}

		if(loadingScreenYn === true) setLoadingYn(false);

		if(callbackYn){
			callback(data);
		}else{

			return data;
		}
	}
	catch(error:any){
		if(loadingScreenYn === true) setLoadingYn(false);
		// console.log(error.response.data.resObj.message);
		// console.log(error.response.data.message);
		if(setErrorPage !== null) setErrorPage(true);
		setErrorPage(true)
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

export {transactionAuth}; 