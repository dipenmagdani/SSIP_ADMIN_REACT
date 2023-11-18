import React from 'react';
import Axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useContext , useEffect} from 'react'
import { Store } from 'src/views/forms/validation/store';
import {base_url} from "src/base_url";
import styles from "../login/Login.module.css";
import expireToken from 'src/global_function/unauthorizedToken';
import PageAuth from 'src/global_function/PageAuth';
import Dashboard from 'src/views/dashboard/Dashboard';

export default function Login(){

     const navigate = useNavigate();

  
  //    useEffect(()=>{

        
  //     if (PageAuth()){
  //         navigate('/home')
  //     }
   
      
  // },[]);


  useEffect(()=>{
    if(PageAuth){
      navigate("/Dashboard")
    }
  },[])

   
     
    
      
  
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
  
     const { state, dispatch: ctxDispatch } = useContext(Store);
  
   console.log(state);
    const submitHandler = async (e) => {

      e.preventDefault();
      const header = {
        'ngrok-skip-browser-warning':true
      }
      Axios.post(`${base_url}/auth/api/login/`,{
        "email":  email,
         "password":password        
      },{header})
      .then((response)=>{
        ctxDispatch({ type: 'USER_SIGNIN', payload: response.data });
      
        localStorage.setItem('accessToken',response.data.access)
        localStorage.setItem('refreshToken',response.data.refresh)
        navigate('/#')
      })
      .catch((error)=>{
        console.log(error);
        if(error.response.status === 401){
            expireToken(localStorage.getItem('refreshToken'),(error,result)=>{
              if(error){
                console.log("someting went worng");
              }
              ctxDispatch({ type: 'USER_SIGNIN', payload: result });
              
            })
        }
      })

    };
  
    // useEffect(() => {
    //   if (userInfo) {
    //     console.log(localStorage.getItem('refreshToken'));
    //   }
    // }, [userInfo]);
  
  return (

    <div className={styles.login}>
      <div className={styles.illustration}>
        <img
          className={styles.mobileLoginRafiki1}
          alt=""
          src="/images/mobile-loginrafiki-1.svg"
        />
      </div>
      <div className={styles.frame} />
      {/* <div className={styles.login1}>Login</div> */}

<form onSubmit={submitHandler}>

<div className={styles.frame1}>
        <div className={styles.email}>
          <div className={styles.password}>Email</div>
          <div className={styles.content}>
            <img className={styles.vectorIcon} alt="" src="/images/vector.svg" />
            <div className={styles.adornStartContainer}>
              <div className={styles.icon}>
                <img
                  className={styles.starsharpIcon}
                  alt=""
                  src="/images/starsharp.svg"
                />
              </div>
            </div>
            <div className={styles.placeholder}>Placeholder</div>
            <div className={styles.adornEndContainer}>
              <img
                className={styles.removeredeyefilledIcon}
                alt=""
                src="/images/removeredeyefilled.svg"
              />
            </div>
            <div> <input type="text" id="usermail "name="email" onChange={e => setEmail(e.target.value)} className={[styles.examplegmailcom]} placeholder="example@gmail.com"></input></div>
          </div>
          
        </div>
      </div>
   
      <div className={styles.frame2}>
        <div className={styles.input}>
          <div className={styles.password}>Password</div>
          <div className={styles.content}>
            <img
              className={styles.iconlockround}
              alt=""
              src="/images/iconlockround.svg"
            />
            <div className={styles.adornStartContainer}>
              <div className={styles.icon}>
                <img
                  className={styles.starsharpIcon}
                  alt=""
                  src="/images/starsharp.svg"
                />
              </div>
            </div>
            <div className={styles.div}><input type="password" onChange={e => setPassword(e.target.value)} className={styles.examplegmailcom} placeholder="Password" name="password"></input></div>
          </div>
        </div>
      </div>
      
      <div className={styles.frame5}>
        <div className={styles.button}>
          <div className={styles.base}>
            <img className={styles.maskedIcon} alt="" src="/images/masked-icon.svg" />
            <button type='submit' className={styles.button1}>Login</button>
            <img className={styles.maskedIcon} alt="" src="/images/masked-icon1.svg" />
          </div>
        </div>
      </div>

</form>

    </div>
  );
};