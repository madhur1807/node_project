const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');

const app = express();

const port = 5001;

//Body Parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Loading Route
const index = require('./routes/index');

// Using Routes
app.use('/', index);

// DB Config 
const db = require('./config/database');

// Connect to mongoose
mongoose.connect(db.mongoURI)
.then(() => {
    console.log("MongoDB Connected...");
}).catch(err => console.log(err));

// Passport config
require('./config/passport')(passport);

// Express handlebar middleware 
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Static folder
app.use(express.static(path.join(__dirname, 'public')));


app.listen(port, () => {
    console.log(`Server started on ${port}`);
});