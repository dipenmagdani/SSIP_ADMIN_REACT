


const PageAuth =  ()=>{

    const response= localStorage.getItem('accessToken')
    console.log(response)
    if (response){
        console.log("true");
        return true;
    }
    else{
        console.log("false");
        return false ;
    }    
    }
    
export default PageAuth;
    