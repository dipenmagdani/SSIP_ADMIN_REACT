  const base_url= "https://c645-2405-201-2024-b862-2c20-b64d-d69b-eba.ngrok-free.app";
 const token = localStorage.getItem('accessToken')
 const header = {
    "Content-Type":"application/json",
    "Authorization": `Bearer ${token}`,
    'ngrok-skip-browser-warning':true
  }
export  { base_url , header };
