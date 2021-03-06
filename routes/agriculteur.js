const express = require('express');
const route = express.Router();

const agriculteurControllers = require('../controllers/agriculteur')

const {check} = require('express-validator')

route.post('/signup', 
check('name')
.not()
.isEmpty(),
check('prenom')
.not()
.isEmpty(),
check('tel')
.not()
.isEmpty(),
check('email')
.normalizeEmail(),
check('password')
.isLength({min:8})
,agriculteurControllers.signup)

route.post('/login', 
check('email')
.isEmpty(),
check('password')
.isLength({min:8})
,agriculteurControllers.login2)

route.patch('/:id', 
check('name')
.not()
.isEmpty(),
check('tel')
.not()
.isEmpty(),
check('email')
.normalizeEmail(),
check('password')
.isLength({min:8})
,agriculteurControllers.updateAgriculteur)

route.get('/',agriculteurControllers.getAgriculteur)
route.get('/:id',agriculteurControllers.getAgriculteurById)
route.delete('/:id',agriculteurControllers.deleteAgriculteur)
route.patch('/bloque/:id',agriculteurControllers.bloqueAgriculteur)

module.exports=route