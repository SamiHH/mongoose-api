const express = require('express')

require('dotenv').config({ path : './config/.env'})
require('./config/db')

const routerPerson = require('./Routes/person.routes')

const app = express()

app.use(express.json())

app.use('/api/person', routerPerson )


app.get('/' , (req,res)=> {
    res.send('<h1> Hello Express </h1> ')
})


app.listen( process.env.PORT , ()=> {
    console.log(`server are Started on : ${process.env.PORT}`);
})

