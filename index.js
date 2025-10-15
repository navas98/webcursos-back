const express = require('express')
const app = express()
const dotenv=require('dotenv').config();
const PORT = 

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(PORT, () => {
  console.log(`App escuchando en puerto ${process.env.PORT}`)
})
//npm run dev