const Role = require('./models/role')
const User = require('./models/user')
let bcrypt = require('bcryptjs')
const {validationResult} = require('express-validator')
const jwt = require('jsonwebtoken')
const {sign} = require("jsonwebtoken");
const {secret} = require("./config");

const generateAccessToken = (id,roles)=>{
    const payload = {
        id,
        roles
    }
    return jwt.sign(payload,secret, {expiresIn: "24h"})
}

class  authController {
    async registration(req, res) {
        try{
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({message: 'Ошибка при регистрации', errors})
            }
            const {username, password, email} = req.body
            const candidate = await User.findOne({username})
            if (candidate) {
                return res.status(400).json({message: 'Пользователь с таким именем уже существует'})
            }

            let hashPassword = bcrypt.hashSync(password, 6);
            const userRole = await  Role.findOne({value: 'User'})
            const user = new User({username, password: hashPassword,email, roles: [userRole.value]})
            await user.save()
            return res.json({message:'Пользолватель успешно сохранен '})
        } catch (e){
            console.log(e)
            res.status(400).json({message: 'Registration error'})
        }
    }
    async login(req, res) {
        try{
            const {username, password} = req.body
            const user = await  User.findOne({username})
            if (!user) {
                return res.status(400).json({message: `Пользователь ....${username} не найден` })
            }

            const  validPassword = bcrypt.compareSync(password, user.password)
            if (!validPassword) {
                return res.status(400).json({message: 'Введен неверный пароль' })
            }
            const token = generateAccessToken(user.id, user.roles)
            return res.json(token)

        } catch (e){
            console.log(e)
            res.status(400).json({message: 'Login error'})
        }
    }

    async getUsers(req, res) {
        try{
            const users = await  User.find()
            res.json(users)
        } catch (e){

        }
    }

}

module.exports = new authController()
