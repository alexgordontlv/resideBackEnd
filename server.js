const express = require('express');
const app = express();
const cors = require('cors');
const bcrypt = require('bcrypt');
const { Client } = require('pg');
const saltRounds = 10;
let idcount = 4;

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
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

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
  });


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
app.set('signin', path.join(__dirname, './SignIn'));
app.get('/SignIn', (req,res) => {
    const {email , password} = req.body;
    const isValid = bcrypt.compareSync(password, data[0].hash);
     res.send("ok signed in");
})



app.put('/Register', (req,res) => {
    const {email , password} = req.body;
    const hash = bcrypt.hashSync(password);
    const text = 'INSERT INTO users(name, email) VALUES($1, $2) RETURNING *'
    const values = ['brianc', 'brian.m.carlson@gmail.com']
   /* client
    .query(text, values)
    .then(res => {
      console.log(res.rows[0]);
      res.send(res.rows[0])
      System.out.println(res.rows[0]);
      // { name: 'brianc', email: 'brian.m.carlson@gmail.com' }
    })
    .catch(e => console.error(e.stack))*/
    client.query("select * from users")
    .then(result => res.send(result.rows))

})



app.listen(process.env.PORT || 4000, )