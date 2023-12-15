const express = require('express')
const app = express()
const mongoDb = require('./db')
const port = 3005;
const multer = require('multer')
const cors = require('cors')
const mongoose = require('mongoose')
const fs = require('fs')
const path = require('path')

app.get('/',(req,res)=>{
    res.send()
})


app.use((req, res, next)=>{
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    );
    next()
})

app.use(express.json())
app.use('/api',require('./Routes/CreateUser'))




///////// CRUD FORM BACKEND ////////////////



const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    imgURL: String,
    // ref_id:{
    //     type:String,
    //     required:true
    // }

  });
  
  const UserModel = mongoose.model('Users', userSchema);
  mongoose.connect('mongodb://localhost:27017/main-crud-assignment', {});
  
  app.use(cors());
  app.use(express.json());
  // send to database
  app.use('/image', express.static(path.join(__dirname, 'uploads')));
  
  /////// MULTER ////////
  
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, 'uploads'));
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
  
  const upload = multer({ storage: storage });
  
  
  
  // Create User
  
  app.post('/form', upload.single('img'), async (req, res) => {
    try {
      const { name, email, password } = req.body;
  
      // Check if a file was uploaded
      let imgURL = '';
      if (req.file) {
        imgURL = `http://localhost:3005/image/${req.file.filename}`;
      }
  
      const newUser = new UserModel({
        name: name,
        email: email,
        password: password,
        imgURL: imgURL,
        // ref_id:req.decode.id
      });
  
      await newUser.save();
  
      res.json({ newUser });
    } catch (error) {
      console.error('Error creating user:', error);
      res.json({ message: 'Error creating user' });
    }
  });
  
  
  // Get All Users
  app.get('/getAllData', async (req, res) => {
    try {
      const users = await UserModel.find();
      // console.log(users,",")
      res.json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.send('Error');
    }
  });
  
  // Get One User by ID
  app.get('/oneUser/:id', async (req, res) => {
    try {
      const user = await UserModel.findById(req.params.id);
      
      res.json(user);
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      res.send(' Error in getOne User');
    }
  });
  
  // Update User by ID
  app.put('/edit/:id', async (req, res) => {
    try {
      const updatedUser = await UserModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      res.json(updatedUser);
    } catch (error) {
      console.error('Error updating user by ID:', error);
      res.send(' Error in update');
    }
  });
  
  // Delete User by ID
  app.delete('/delete/:id', async (req, res) => {
    try {
      const deletedUser = await UserModel.findByIdAndDelete(req.params.id);
    if(deletedUser.imgURL){
      const imageDel = path.join(__dirname, 'uploads', path.basename(deletedUser.imgURL));
      fs.unlinkSync(imageDel)
    }
      res.json(deletedUser);
    } catch (error) {
      console.error('Error deleting user by ID:', error);
      res.send('Error in delete item');
    }
  });
  
  

////////// END ////////////////



app.listen(port, ()=>{
    console.log('Server is working');
})