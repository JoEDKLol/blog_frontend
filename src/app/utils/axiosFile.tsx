import axios from "axios";
import { getAccessToken, storeAccessToken } from "./common";

const axiosFile = axios.create({
	baseURL : process.env.API_URL, 
	withCredentials: true,
	headers: {
		"Contest-Type": "multipart/form-data"
    }
})

axiosFile.interceptors.request.use((config)=>{
	config.headers["accesstoken"] = getAccessToken();
	return config;
})

const transactionFile = async (url:string, fileObj:any, obj:any, callback:any, callbackYn:boolean, loadingScreenYn:any, setLoadingYn:any) => {
	if(loadingScreenYn === true) setLoadingYn(true);
	try{
		const formData = new FormData();
		formData.append('file', fileObj);
		formData.append('user_id', obj.user_id);
		formData.append('temp_num', obj.randomNum);
		formData.append('email', obj.email);

		if(obj.blog_seq){
			formData.append('blog_seq', obj.blog_seq);
		}
		
        let resp:any, data:any;
		
		resp = await axiosFile.post(url ,formData, obj);
		data = await resp.data;
		
		if(url===""){
			if(loadingScreenYn === true) setLoadingYn(false);
			if(callbackYn){
				callback(data);
			}else{
				return data;
			}
		}else{
			
			if(data.sendObj.code === "2011"){ //access token check failed
				resp = await axiosFile.get('getAccessToken', {});
				data = await resp.data;

				if(data.sendObj.success){
					storeAccessToken(resp.headers.accesstoken);
					let _resp:any, _data:any;
					_resp = await axiosFile.post(url ,obj);
					_data = await _resp.data;
					
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
			// console.log("여기");
			return data;
		}
	}
	catch(error:any){
		if(error){
			if(callbackYn){
				callback("", error.response.data);
			}else{
				return error;
			}
			
		}
	}
}

export {transactionFile}; 