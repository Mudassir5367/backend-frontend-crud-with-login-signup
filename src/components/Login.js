import React, { useState } from 'react'
import {Link, useNavigate} from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()
    const [data, setData] = useState({
        email:'',
        password:'',
    })
    
    const inputHandle = (e)=>{
        const name = e.target.name;
        const val = e.target.value;
        console.log(name, val);
        setData({...data, [name]:val})
    }

    const formHandle = async(e)=>{
      e.preventDefault()
      // console.log(e);

      const response = await fetch('http://localhost:3005/api/loginuser', {
        method:'POST',
        headers:{
          'Content-Type': 'application/json'
        },
        body:JSON.stringify({ email:data.email, password:data.password})
      })
      // const getData = {...data}
      // console.log(getData);

      const json = await response.json()
      console.log(json);

      if(!json.success){
        alert('enter valid data')
      }
      if(json.success){
        localStorage.setItem('authToken',json.authToken)
        console.log(localStorage.getItem('authToken'));
        navigate('/crudForm')
      }
  }

  return (
    <>
      <h1 style={{textAlign:'center'}}>Please SignIn</h1>
      <form onSubmit={formHandle}>
      <input className='signupInputs' name='email' type='email' placeholder='Enter Email' onChange={inputHandle} value={data.email}/>
      <input className='signupInputs' name='password' type='password' placeholder='Enter Password' onChange={inputHandle} value={data.password}/>
      <div style={{textAlign:'center',marginTop:'20px'}}><button style={{padding:'15px',width:'200px',backgroundColor:'indigo', color:'gold',border:'none',borderRadius:'8px',cursor:'pointer'}}>Login</button></div>
      </form>
      <div style={{textAlign:'center'}}>
      <p style={{textAlign:'center'}}> Create Account </p>
      <Link to = '/signUp'style={{textAlign:'center'}}>SignUp</Link>
      </div>
    </>
  )
}
