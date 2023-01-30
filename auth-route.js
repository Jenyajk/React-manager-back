const Router = require('express')
const router = new Router()
const controller = require('./auth-controller')
const {check} = require('express-validator')
const authMiddleware = require('./middlewaree/auth-middleware')


router.post('/registration',[
    check('username', 'Имя пользователя не может быть пустым').notEmpty(),
    check('password', 'пароль не должен быть пустым').isLength({min: 1, max: 50}),
    check('email', 'Email  не может быть пустым').notEmpty(),
], controller.registration)
router.post('/login', controller.login)
router.get('/users', authMiddleware, controller.getUsers)

module.exports = router
