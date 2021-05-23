import express from 'express';
import session from 'express-session';
import sqlite3 from 'sqlite3';
import { Controller } from './controller/controller.mjs';
import { Model } from './model/model.mjs';
import {setupDatabase} from './setup_database.mjs';

const app = express();
const port = 3000;

setupDatabase();

const connection = new sqlite3.Database('./db/app.db',sqlite3.OPEN_READWRITE,(err) => {
  if(err) {
    console.log(err);
  }
})
const model = new Model(connection);
const controller = new Controller(model);

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
}))  

app.get('/', (req, res) => {
    res.render('pages/index',{userName : req.session.userName})
    //res.sendFile(path.join(htmlPath, '/index.html'))
})
app.get('/login',controller.allowedNotSignIn, (req, res) => {
  res.render('pages/login')
  //res.sendFile(path.join(htmlPath, '/login.html'))
})
app.get('/about', (req, res) => {
  res.render('pages/about',{userName : req.session.userName})
  //res.sendFile(path.join(htmlPath, '/about.html'))
})
app.get('/register',controller.allowedNotSignIn, (req, res) => {
  res.render('pages/register')
  //res.sendFile(path.join(htmlPath, '/register.html'))
})
app.get('/profile',controller.allowedSignIn, (req, res) => {
  res.render('pages/profile',
  {userName : req.session.userName,
    email : req.session.email,
    gender:req.session.gender,
    number : req.session.number})
  //res.sendFile(path.join(htmlPath, '/user_page.html'))
})
app.get('/history',controller.allowedSignIn, (req, res) => {
  res.render('pages/history')
})
app.get('/logOut',(req,res) => {
  req.session.userName = undefined
  req.session.userId = undefined
  res.redirect('/')
})
app.post('/createShort',(req,res) =>{
  controller.generateShortLink(req.body.link,{response:res,session : req.session})
})
app.get('/getAllLinksData',(req,res) =>{
  controller.getAllLinks({response:res,session : req.session})
})
app.post('/login', (req, res) => {
  controller.login(req.body.email,req.body.pass,{response:res,session : req.session})
})
app.post('/register',(req,res) => {
  controller.register(req.body,{response:res,session : req.session})
})
app.delete('/deleteLink', (req,res) => {
  controller.deleteLink(req.body.id,{response:res,session : req.session})
})
app.patch('/updateLink', (req,res) =>{
  controller.updateLink(req.body.id,req.body.newText,{response:res,session : req.session})
})
app.get('*',(req,res) => {
  controller.redirectToOriginal(req.originalUrl.substring(1),{response:res,session : req.session})
})
app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`)
})