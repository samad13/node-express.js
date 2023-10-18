const express = require('express');
const path = require('path');
const cors = require('cors')
const corsOptions = require('./config/corsoptions')
const { logger } = require('./middleware/logEvent')
const errorHandler = require('./middleware/errorHandler')
const verifyJWT = require('./middleware/verifyJwt')
const cookieParser = require('cookie-parser')
const app = express();

const PORT = process.env.PORT || 3500


//custom middleware
app.use(logger)
//cross origin resource sharing
app.use(cors(corsOptions));

//built in middleware to handle url encodeded form data

//content-Type: application/x-www-form-urlencoded 
app.use(express.urlencoded({ extended: false }));

//built in middleware for json
app.use(express.json());

//middleware for cookie-parser
app.use(cookieParser());


//serving static folder
app.use(express.static(path.join(__dirname, '/public')))


app.use('/', require('./routes/root'))
app.use('/register', require('./routes/api/register'))
app.use('/auth', require('./routes/api/auth'))
app.use('/refresh', require('./routes/api/refresh'));
app.use('/logout', require('./routes/api/logout'));
app.use(verifyJWT);
app.use('/employees', require('./routes/api/employees'));


app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ "error": "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
});

app.use(errorHandler)

app.listen(PORT, () => console.log(`server running on ${PORT}`))


