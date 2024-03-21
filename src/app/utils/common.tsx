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

export  {getRandomNumber, addComma}