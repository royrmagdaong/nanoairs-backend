require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')

const port = process.env.PORT

// middlewares
app.use(express.json())
// app.use(cors)

// database connection
try {
  mongoose.connect('mongodb://127.0.0.1:27017/nano-airs');
  console.log('db success')
} catch (error) {
  console.log('db error', error)
}

mongoose.connection.on('db connected', () => console.log('connected'));
mongoose.connection.on('db open', () => console.log('open'));
mongoose.connection.on('db disconnected', () => console.log('disconnected'));
mongoose.connection.on('db reconnected', () => console.log('reconnected'));
mongoose.connection.on('db disconnecting', () => console.log('disconnecting'));
mongoose.connection.on('db close', () => console.log('close'));

// routes
const UserRoutes = require('./routes/Users')
const SensorRoutes = require('./routes/Sensors')
const TokenRoutes = require('./routes/Tokens')

app.use('/user', UserRoutes)
app.use('/sensor', SensorRoutes)
app.use('/token', TokenRoutes)

app.listen(port, () => {
    console.log(`Example app, listening to port ${port}`)
})
