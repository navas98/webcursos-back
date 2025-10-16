const express = require('express')
const app = express()
const mongoose = require('mongoose');
require('dotenv').config();
const Course=require("./models/course")
const PORT=process.env.PORT

app.use

app.get('/', (req, res) => {
  res.send('Hello World!')
})



mongoose.connect(process.env.MONGO_DB_URL)
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.error('❌ Error al conectar a MongoDB:', err));


app.listen(PORT, () => {
  Course.create({name:"Creando tu propia web de cursos desde 0"})
  console.log(`App escuchando en puerto ${process.env.PORT}`)
})
//npm run dev
//https://www.youtube.com/watch?v=GR-sG5AI6B0&t=81168s
//minuto 2:31:00