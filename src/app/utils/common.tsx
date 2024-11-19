
'use client';
const getRandomNumber = (n:number) => {

    let retNum = "";
    for (let i = 0; i < n; i++) {
        retNum += Math.floor(Math.random() * 10)
    }
    return retNum;

}

const addComma = (price:number) => {
    let returnString = price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return returnString;
}

const storeAccessToken = (accesstoken:string) => {
    return sessionStorage.setItem('myblog-accesstoken', accesstoken);
}

const getAccessToken = () => {
    return sessionStorage.getItem('myblog-accesstoken');
}

const clearAccessToken = () => {
    return sessionStorage.removeItem("myblog-accesstoken");
}

const getDate = (str:string) => {

    let retStr;
    let year;
    let month;
    let day;
    let time;

    year = str.substring(0, 4) + ".";
    month = str.substring(5, 7) + ".";
    day = str.substring(8, 10) + " ";

    time = str.substring(11, 19);

    retStr = year + month + day + time; 

    return retStr;

}

export  {getRandomNumber, addComma, storeAccessToken, getAccessToken, getDate}