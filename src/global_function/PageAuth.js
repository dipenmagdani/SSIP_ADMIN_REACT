


const PageAuth =  ()=>{

    const response= localStorage.getItem('accessToken')
    console.log(response)
    var value;
    if (response){
        
        value = true;
        return true;
    
    }
    else{
    
        value = false;
        return false ;
    
    }
     
    
    }
    
    export default PageAuth;
    