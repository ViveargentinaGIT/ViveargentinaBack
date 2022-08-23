const { Router } = require('express');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const axios = require ('axios');
const { Adminsitrator } = require ('../models/Administrator')
const { Category } = require ('../models/Category')
const { Experience } = require ('../models/Experience')
const { Package } = require ('../models/Package')
const { Provider } = require ('../models/Provider')
const { Province } = require ('../models/Province')
const { Query } = require ('../models/Query')
const { Region } = require ('../models/Region')
const { Reservation } = require ('../models/Reservation')
const { Review } = require ('../models/Review')
const { User } = require ('../models/User')

