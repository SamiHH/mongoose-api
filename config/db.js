const mongoose = require('mongoose')

mongoose
        .connect( process.env.MONGO_URI  , { useNewUrlParser : true, useUnifiedTopology : true  })
        .then(()=>  {
                console.log(`DB conected successfully To : ${process.env.MONGO_URI}`)
        })
        .catch((err)=> {
                console.log(err)
        })
