const express = require('express')
const cors = require('cors');
const PORT = process.env.PORT || 5000
const mongoose = require('mongoose')
const authRouter = require('./auth-route')

const app = express()
const corsOptions = {
    origin: '*',
    methods: ['POST', 'GET', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}
app.use(cors(corsOptions));
app.use(express.json())
app.use('/auth', authRouter)
mongoose.set('strictQuery', true);
const start = async ()=> {
    try {
        await mongoose.connect('mongodb+srv://jenya:S486GB@cluster0.313h3bf.mongodb.net/auth?retryWrites=true&w=majority')
        app.listen(PORT,()=> console.log(`server started on port ${PORT}`))
    } catch (e) {
        console.log(e)}
}

start()
