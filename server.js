const express = require('express');
const app = express();
const cors = require('cors');
const bcrypt = require('bcrypt');
const path = require('path');
const saltRounds = 10;
const { Client } = require('pg');
let idcount = 4;

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'residedb',
    password: 'lopkin',
    port: 5433,
    
  });
  client.connect();


app.use(express.json())
app.use(cors())
const users = [
    {
        email: 'alexaybn@gmail.com',
        password: 'lopkin'
    }
]
const userdatabase = [
    {
        "id": "1",
        "name": "Tali kesler",
        "phone": "0548099631",
        "rooms": "3",
        "budget": "5500000",
        "elevator": true,
        "parking": true
    },
    {
        "id": "2",
        "name": "Mali Vasilisa",
        "phone": "0548134531",
        "rooms": "4",
        "budget": "4500000",
        "elevator": true,
        "parking": false
    },
    {
        "id": "3",
        "name": "Sili Yoshpe",
        "phone": "0533453346",
        "rooms": "6",
        "budget": "3500000",
        "elevator": false,
        "parking": false
    },
]

const propertydatabase = [
    {
        "id": "1",
        "address": "Shlomo Hamelekh 35",
        "floor": "2",
        "rooms": "2.5",
        "price": "5500000",
        "elevator": true,
        "parking": true,
        "contact": "Marvin 050-999999"
    },
    {
        "id": "2",
        "address": "Frishman 13",
        "floor": "4",
        "rooms": "3",
        "price": "4500000",
        "elevator": false,
        "parking": false,
        "contact": "Oded 050-999999"
    },
    {
        "id": "3",
        "address": "Ben Gurion 10",
        "floor": "3",
        "rooms": "4",
        "price": "3500000",
        "elevator": true,
        "parking": false,
        "contact": "Adam 050-999999"
    },
    {
        "id": "4",
        "address": "Ben Gurion 33",
        "floor": "3",
        "rooms": "4",
        "price": "3500000",
        "elevator": true,
        "parking": false,
        "contact": "Adam 050-999999"
    },
]



app.get("/", (req,res)=>{
    res.send("working with heroku")
})
app.post('/NewUser', (req,res) => {
    const  {name,budget,floor,elevator,parking,rooms,phone} = req.body
    userdatabase.push({
        id:(idcount++),
        name,
        phone,
        budget,
        elevator,
        rooms,
        floor,
        parking,
    })
    res.send('success');
    console.log(userdatabase[userdatabase.length - 1]);
})

app.post('/NewProperty', (req,res) => {
    const  {address,price,floor,elevator,parking,rooms,contact} = req.body
    propertydatabase.push({
        id:(idcount++),
        address,
        contact,
        price,
        rooms,
        floor,
        elevator,
        parking,
    })
    res.send('succsess')
    console.log(propertydatabase[propertydatabase.length - 1])
})

app.delete('/DeleteUser', (req,res) => {
    const {id} = req.body;
    for(let i = 0; i < id.length; i++){
        for(let j = 0; j< userdatabase.length; j++){
            if(userdatabase[j].id === id[i]){
                userdatabase.splice(j,1);
            }
        }
    }
   res.send(userdatabase);
})

app.delete('/DeleteProperty', (req,res) => {
    const {id} = req.body;
    for(let i = 0; i < id.length; i++){
        for(let j = 0; j< propertydatabase.length; j++){
            if(propertydatabase[j].id === id[i]){
                propertydatabase.splice(j,1);
            }
        }
    }
   res.send(propertydatabase);
})

app.get('/UserList', (req,res) => {
    res.send(userdatabase)
})

app.get('/PropertyList', (req,res) => {
    res.send(propertydatabase)
})

app.post('/SignIn', (req,response) => {
    const {email , password} = req.body;
    let isValid =false;
    const query = {
        // give the query a unique name
        name: 'fetch-user',
        text: 'SELECT * FROM users WHERE email = $1',
        values: [email],
      }
      client.query(query, (err, res) => {
        if (err) {
          console.log(err.stack)
        } else {
          console.log(res.rows[0])
          bcrypt.compare(password, res.rows[0].hash).then(function(result) {
              response.send(result);
        }).catch(err=>{console.log(err)})
        }
      })
})



app.post('/Register', (req,res) => {
    const {name,email , password} = req.body;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);
    const text = 'INSERT INTO users(name, email,hash) VALUES($1, $2, $3) RETURNING *'
    const values = [name, email ,hash]
    client.query(text, values, (err, res) => {
        if (err) {
        console.log(err.stack)
        } else {
        console.log(res.rows[0])
        }
    })


 
})



app.listen(process.env.PORT || 4000, )