import axios  from "axios";
import base_url from '../base_url';

const expireToken = async (refreshToken,next)=>{
    const header = {
        'ngrok-skip-browser-warning':true
      }
    axios.post(`${base_url}/auth/api/token/refresh/`,{
        "refresh":refreshToken
    },{headers:header})
    .then((response)=>{
        localStorage.setItem('accessToken',response.data.access)
        localStorage.setItem('refreshToken',response.data.refresh)
        return next(null,response)
    })
    .catch((error)=>{
        return next(error)
    })
}
export default expireToken