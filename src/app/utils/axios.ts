import axios from "axios";

const axiosAuth = axios.create({
	baseURL : process.env.API_URL
})

const axiosNoAuth = axios.create({
	baseURL : process.env.API_URL
})

axiosAuth.interceptors.request.use((config)=>{
	let obj = getToken();
	let accessToken = obj.accesstoken;
	let refreshtoken = obj.refreshtoken;
	config.headers["authorization"] = accessToken;
	config.headers["refreshtoken"] = refreshtoken;
	return config;
    
})

const storeToken = (obj:any) => {
	let retYn = false;
	sessionStorage.setItem('accesstoken', obj.accesstoken);
	localStorage.setItem('refreshtoken', obj.refreshtoken);
	return retYn;
}

const getToken = () => {
	let obj = {"accesstoken":sessionStorage.getItem('accesstoken'),"refreshtoken":localStorage.getItem('refreshtoken')}
	return obj;
}

const clearToken = () => {
	let retYn = false;
	localStorage.removeItem("accesstoken");
	localStorage.removeItem("refreshtoken");
	return retYn;
}

const transactionAuth = async (type:string, url:string, obj:any, callback:any) => {
	try{
		let resp:any, data:any;

		if(type === "get"){
			resp = await axiosAuth.get(process.env.API_URL + "auth/" + url ,obj);
			data = await resp.data;
		}else if(type === "post"){
			resp = await axiosAuth.post(process.env.API_URL + "auth/" + url ,obj);
			data = await resp.data;
		}

		let tokenObj = {accesstoken:"", refreshtoken:""}
		tokenObj.accesstoken = resp.headers.accesstoken;
		tokenObj.refreshtoken = resp.headers.refreshtoken;

		if(data.message === "newToken"){
				storeToken(tokenObj);    
				if(type == "get"){
					resp = await axiosAuth.get(process.env.API_URL + "auth/" + url ,obj);
					data = await resp.data;
				}else if(type == "post"){
					resp = await axiosAuth.post(process.env.API_URL + "auth/" + url ,obj);
					data = await resp.data;
				}
				
		}
		// console.log(data);
		callback(data);
	}
	catch(error:any){
		// console.log("error");
		if(error){
				callback("", error.response.data);
		}
	}
}

const transaction = async (type:string, url:string, obj:any, callback:any) => {
	try{

	console.log("여기로 온다.");

		let resp:any, data:any;

		if(type === "get"){
			resp = await axiosNoAuth.get(url ,obj);
			data = await resp.data;
		}else if(type === "post"){
			resp = await axiosNoAuth.post(url ,obj);
			data = await resp.data;
		}
		callback(data);
	}
	catch(error:any){
		// console.log("error");
		if(error){
				callback("", error.response.data);
		}
	}
}

export {axiosAuth, axiosNoAuth, storeToken, clearToken, transactionAuth, transaction}; 