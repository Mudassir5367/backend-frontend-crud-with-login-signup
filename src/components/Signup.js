import React, { useState } from 'react'
import {Link, useNavigate} from 'react-router-dom'

export default function Signup() {
  const navigate = useNavigate()
    const [data, setData] = useState({
        name:'',
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

        const response = await fetch('http://localhost:3005/api/createuser', {
          method:'POST',
          headers:{
            'Content-Type': 'application/json'
          },
          body:JSON.stringify({name:data.name, email:data.email, password:data.password})
        })
        // const getData = {...data}
        // console.log(getData);

        const json = await response.json()
        console.log(json);

        if(!json.success){
          alert('enter valid data')
        }
        if(json.success){
          navigate('/')
        }
    }

  return (
    <>
      <h1 style={{textAlign:'center'}}>Please Register here</h1>
      <form onSubmit={formHandle}>
      <input className='signupInputs' name='name' type='text' placeholder='Enter Full Name' onChange={inputHandle} value={data.name}/>
      <input className='signupInputs' name='email' type='email' placeholder='Enter Email' onChange={inputHandle} value={data.email}/>
      <input className='signupInputs' name='password' type='password' placeholder='Enter Password' onChange={inputHandle} value={data.password}/>
      <div style={{textAlign:'center',marginTop:'20px'}}><button style={{padding:'15px',width:'200px',backgroundColor:'indigo', color:'gold',border:'none',borderRadius:'8px',cursor:'pointer'}}>Register</button></div>
      </form>
     <div style={{textAlign:'center'}}>
     <p style={{textAlign:'center'}}>Already Have an Account </p>
      <Link to = '/' className = 'btn btn-defalt border w-100 bg-light rounded-0 text-decoration-none'>Login</Link>
     </div>
    </>
  )
}
