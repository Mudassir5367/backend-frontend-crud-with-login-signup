import React, { useEffect, useState } from 'react';
import axios from 'axios'

export default function Form() {
    const [user, setUser] = useState({
        name:'',
        email:'',
        password:'',
        file:null
    })

    const[getData, setGetData] = useState([])
    const [editItem, setEditItem] = useState(null)
     
    const onchangeHandler = (e) =>{
        // console.log(e);
        // const {name, email, password, file} = e.target;
        const name = e.target.name;
        const val = e.target.value;
        
        console.log(name,val);
        setUser({...user, [name]:val})
    }
    const formHandle = (e) =>{
        e.preventDefault()
        // console.log(e);

        const formData = new FormData();
        formData.append('name', user.name);
        formData.append('email', user.email);
        formData.append('password', user.password);
        formData.append('img', user.file);

        if(editItem){
          updateData(editItem._id, user)
        }else{
          createUser(formData)
        }
    }

      const createUser = (formData) => {
        try {
        
        axios.post('http://localhost:3005/form',formData,{
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((response)=>{
            console.log(response.data);
        })
       
        const data = {...user, id: new Date().getTime().toString()}
        console.log(data);

        setUser({ name: '', email:'', password:'', file:''})
        .catch((error)=>{
          console.log('error in create m', error);
        })
      } catch (error) {
        console.log(error);
      }
        }
       

       
    useEffect(()=>{
        axios.get('http://localhost:3005/getAllData')
        .then((res)=>{
            // console.log(res.data);
            setGetData(res.data)
        })
       },[getData])

       const removeData = (id)=>{
        axios.delete(`http://localhost:3005/delete/${id}`)
        .then((del)=>{
            console.log('delete',del);
            setGetData(getData.filter((item)=> item._id !== id))
        })
       }

       const updateData = (id, updatedUser) =>{
        axios.put(`http://localhost:3005/edit/${id}`, updatedUser)
        .then((update)=>{
          console.log('update',update);
          setEditItem(null)
          setUser({name:'', email:'', password:'', file:''})
        }).catch((err)=>{
          console.log('error updating', err);
        })
       }

       const editData = (id) => {
        const selectedItem = getData.find((item)=> item._id === id);
        setEditItem(selectedItem)
        setUser(selectedItem)
       }

  return (
    <>
      <div className="header">
        <h1 className="heading">CRUD FORM</h1>
      </div>
      <div className='container' style={{ marginTop: '30px', background: '#dadada', width: '30%' }}>
        <form onSubmit={formHandle}>
          <div className="input-wrapper" >
            <input className="custom-input" style={{marginTop:'20px'}} type='text' name='name' value={user.name} onChange={onchangeHandler} placeholder='Enter Name' />
          </div>
          <div className="input-wrapper">
            <input className="custom-input" type='email' name='email' value={user.email} onChange={onchangeHandler}  placeholder='Enter E-mail' />
          </div>
          <div className="input-wrapper">
            <input className="custom-input" type='password' name='password' value={user.password} onChange={onchangeHandler}  placeholder='Enter Password' />
          </div>
          <div className="input-wrapper">
          <input className="custom-input" type='file' name='file' onChange={(e) => setUser({ ...user, file: e.target.files[0] })} />

          </div>
          <div style={{ textAlign: 'center' }}>
            <button style={{ padding: '15px', width: "60%", color: 'gold', backgroundColor: 'indigo', border: 'none', borderRadius: '8px', marginBottom: '10px', cursor: 'pointer' }}>{editItem ? 'Update' : 'Submit'}</button>
          </div>
        </form>
      </div>


      <table border = '1' style={{marginTop: '20px',textAlign: 'center',marginLeft: 'auto',
    marginRight: 'auto',}}>
        <tr>
        <th>Name</th>
        <th>Email</th>
        <th>password</th>
        <th>ImgURL</th>
        <th>Remove</th>
        <th>Update</th>
        </tr>
        <tbody>
            {
                getData.map((data)=>{
                    return (<>
                        <tr>
                        <td>{data.name}</td>
                        <td>{data.email}</td>
                        <td>{data.password}</td>
                        <td>{data.imgURL}</td>
                        <td><button onClick={()=>removeData(data._id)} style={{backgroundColor:'indigo', color:'gold',width:'70px',border:'none',padding:'6px', cursor:'pointer'}} >Delete</button></td>
                        <td><button onClick={()=>editData(data._id)} style={{backgroundColor:'indigo', color:'gold',width:'70px',border:'none',padding:'6px', cursor:'pointer'}} >Edit</button></td>
                    </tr>
                    </>

                    )
                   
                })
            }
        </tbody>
      </table>
    </>
  )
}
