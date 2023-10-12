import React, { useState } from 'react';
import loginbg from '../assets/img/loginbg.png';
import Logo from "../assets/img/logo.png";
import LoginInput from '../components/LoginInput';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { motion } from 'framer-motion';
import { buttonclick } from '../animations';
import { getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "../config/firebase.config";
import { validateUserJWTToken } from '../api/index';
import {Navigate, useNavigate} from "react-router-dom";


const Login = () => {

  const [useremail, setUserEmail] = useState("")
  const [isSignUp, setIsSignUp] = useState(false)
  const [password, setPassword] = useState("")
  const [confirm_Password, setConfirm_Password] = useState("")

  const firebaseAuth = getAuth(app);
  const provider = new GoogleAuthProvider();

  const navigate = useNavigate()


  const loginWithGoogle = async () => {
    await signInWithPopup(firebaseAuth, provider).then((userCred) => {
      firebaseAuth.onAuthStateChanged((cred) => {
        if (cred) {
          cred.getIdToken().then((token) => {
            validateUserJWTToken(token).then(data => {
              console.log(data);
            });
            navigate("/", { replace : true })
          });
        };
      });
    });
  };

  const signUpWithEmailPass = async () => {
    if (useremail === '' || password === '' || confirm_Password === '') {
      //alert msg
    } else {
      if (password === confirm_Password) {
        setUserEmail("");
        setConfirm_Password("");
        setPassword("");
        await createUserWithEmailAndPassword(firebaseAuth, useremail, password).then(userCred => {
          firebaseAuth.onAuthStateChanged((cred) => {
            if (cred) {
              cred.getIdToken().then((token) => {
                validateUserJWTToken(token).then(data => {
                  console.log(data);
                });
                navigate("/", { replace : true })
              });
            };
          });
        });
      } else {
        //alert msg
      }
    }
  };

  const signInWithEmailPass = async () => {
    if ((useremail !== "" && password !== "") )  {
      await signInWithEmailAndPassword(firebaseAuth, useremail, password).then(
        (userCred) => {
        firebaseAuth.onAuthStateChanged((cred) =>{
          if (cred) {
            cred.getIdToken().then((token) =>{
              validateUserJWTToken(token).then((data) =>{
                console.log(data);
              });
              navigate("/", { replace: true});
            });
          }
        });
        }
      );
    } else{
      //      alert("Please enter your email and passowrd");
    }
  }



  return (
    <div className=' w-screen h-screen relative overflow-hidden flex'>
      <img
        src={loginbg}
        className=' w-full h-full object-cover absolute top-0 left-0 '
        alt='loginbg-img' />


      {/* content box */}
      <div className=' flex flex-col items-center w-[80%] md:w-508 h-full z-10 backdrop-blur-md bg-lightoverlay p-4 px-4 py-12 gap-6'>


        {/*top logo section */}
        <div className=' flex justify-start items-center gap-4 w-full'>
          <img src={Logo} alt='Logo' className=' w-8' />
          <p className=' text-headingColor font-semibold text-2xl p-1'>City</p>
        </div>


        {/* welcomw text */}
        <p className=' text-3xl font-semibold text-headingColor'>Welcome Back</p>
        <p className=' text-xl text-textColor -mt-6'>{isSignUp ? "Sign Up" : "Sign In"} with following</p>


        {/* input section */}
        <div className=' w-full flex flex-col items-center justify-center gap-6 px-4 md:px-10 py-4'>
          <LoginInput
            placeHolder={"Email Here"}
            icon={<FaEnvelope className=' text-xl text-textColor' />}
            inputState={useremail}
            inputStateFunc={setUserEmail}
            type="email"
            isSignUp={isSignUp}

          />
          <LoginInput
            placeHolder={"Password Here"}
            icon={<FaLock className=' text-xl text-textColor' />}
            inputState={password}
            inputStateFunc={setPassword}
            type="password"
            isSignUp={isSignUp}

          />
          {isSignUp && (
            <LoginInput
              placeHolder={"confirmPassword Here"}
              icon={<FaLock className=' text-xl text-textColor' />}
              inputState={confirm_Password}
              inputStateFunc={setConfirm_Password}
              type="confirm password"
              isSignUp={isSignUp}

            />
          )}
  
          {!isSignUp ? (
            <p>
              Doesn't have a account:{""}
              <motion.button {...buttonclick}
                className=' text-red-700 underline cursor-pointer bg-transparent'
                onClick={() => setIsSignUp(true)}
              >
                Create One
              </motion.button></p>
          ) : (
            <p>
              Already have an aacount:{""}
              <motion.button {...buttonclick}
                className=' text-red-700 underline cursor-pointer bg-transparent'
                onClick={() => setIsSignUp(false)}
              >
                Sign-in here
              </motion.button>
            </p>
          )}

          {/* button section */}
          {!isSignUp ? (
            <motion.button {...buttonclick} className=' w-full px-4 py-2 rounded-md bg-red-400 cursor-pointer text-white text-xl capitalize hover:bg-red-500 transition-all duration-150'
              onClick={signUpWithEmailPass}
            >
              Sign In
            </motion.button>
          ) :
            (
              <motion.button {...buttonclick} className=' w-full px-4 py-2 rounded-md bg-red-400 cursor-pointer text-white text-xl capitalize hover:bg-red-500 transition-all duration-150'
                onClick={signInWithEmailPass}
              >
                Sign Up
              </motion.button>
            )}
        </div>
        <div className=' flex items-center justify-between gap-16'>
          <div className=' w-24 h-[1px] rounded-md bg-white'></div>
          <p className=' text-white'>Or</p>
          <div className=' w-24 h-[1px] rounded-md bg-white'></div>
        </div>
        <motion.div
          {...buttonclick}
          className=' flex items-center justify-center px-20 py-2 bg-gray-100 backdrop-blur-md cursor-pointer rounded-3xl gap-4'
          onClick={loginWithGoogle}
        >
          <FcGoogle className=' text-3xl' />
          <p className=' capitalize text-base text-headingColor'>Signin with Google</p>
        </motion.div>
      </div>
    </div>
  )
}

export default Login
