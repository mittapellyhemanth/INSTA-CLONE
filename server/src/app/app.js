const express = require('express');
const mongoose = require('mongoose');


const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const routers = require('../routers/PostRouter')
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');







app.use('/',routers)
app.listen(process.env.PORT, () => console.log('Server connected on port', process.env.PORT));
