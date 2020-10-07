const express = require('express');
const app = express();
const cors = require('cors');
const bcrypt = require('bcrypt');
const saltRounds = 10;
let idcount = 4;
const knex = require('knex')

const db = knex({
    client: 'pg',
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: true,
    }
});



app.use(express.json())
app.use(cors())

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
        "address": "Shlomo Hamelekh 35",
        "floor": "2",
        "rooms": "2.5",
        "price": "5500000",
        "elevator": true,
        "parking": true,
        "contact": "Marvin 050-999999"
    },
    {
        "address": "Frishman 13",
        "floor": "4",
        "rooms": "3",
        "price": "4500000",
        "elevator": false,
        "parking": false,
        "contact": "Oded 050-999999"
    },
    {
        "address": "Ben Gurion 10",
        "floor": "3",
        "rooms": "4",
        "price": "3500000",
        "elevator": true,
        "parking": false,
        "contact": "Adam 050-999999"
    },
    {
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
                console.log(userdatabase[j])
                userdatabase.splice(j,1);
         
            }
        }
    }
   res.send('delete')
})

app.get('/UserList', (req,res) => {
    res.send(userdatabase)
})

app.get('/PropertyList', (req,res) => {
    res.send(propertydatabase)
})

app.post('/SignIn', (req,res) => {
    const {recivedemail , password} = req.body;
    db.select('email','hash').from('login')
    .where('email','=',recivedemail)
    .then(data=>{
       const isValid = bcrypt.compareSync(password,data[0].hash);
       if ( isValid) {
        res.send(true);
    }else {
        res.send(false);
    }
    })
    .catch(err=> res.status(400).json('wrong username or password'))
   
})



app.post('/Register', (req,res) => {
    const {email , password} = req.body;
    const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
        trx.insert({
            hash:hash,
            email:email
        })
        .into('login')
        .returning('email')
        .then(loginEmail =>{
            return trx('users')
            .returning('*')
            .insert({
                email:loginEmail[0],
            //  name: name add a name here!
            })
        .then(user =>{
            res.json(user[0]);
        })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
        
    .catch(err =>res.status(400).json('unable to register'));
    res.send(true)
})



app.listen(process.env.PORT || 4000, )