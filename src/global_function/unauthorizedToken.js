import axios  from "axios";
import base_url from '../base_url';

const expireToken = async (refreshToken,next)=>{
    axios.post(`${base_url}/auth/api/token/refresh/`,{
        "refresh":refreshToken
    })
    .then((response)=>{
        localStorage.setItem('accessToken',JSON.stringify(response.data.access))
        localStorage.setItem('refreshToken',JSON.stringify(response.data.refresh))
        return next(null,response)
    })
    .catch((error)=>{
        return next(error)
    })
}
export default expireToken