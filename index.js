const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const flash = require('express-flash');
const session = require('express-session');

const AvailableWaiters = require('./waiter-fac');
// const Reg = require('./reg')
const pg = require("pg");
const Pool = pg.Pool;
const connectionString = process.env.DATABASE_URL || 'postgresql://codex:codex123@localhost:5432/waiter_availability';
const pool = new Pool({
  connectionString
});

const availableWaiters = AvailableWaiters(pool);
// const reg = Reg(registrations);

const app = express();


app.set('view engine', 'handlebars');
app.engine('handlebars', exphbs({
  layoutsDir: './views/layouts'
}));

// initialise session middleware - flash-express depends on it
app.use(session({
  secret: "<add a secret string here>",
  resave: false,
  saveUninitialized: true
}));

// initialise the flash middleware
app.use(flash());


app.get('/addFlash', function (req, res) {
  req.flash('info', 'Flash Message Added');
  res.redirect('/');
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.use(express.static('public'));


app.get('/', async function (req, res) {

  res.render('index', {
    allDays: await availableWaiters.getAllDAys()
  })
});


app.get('/days', async function (req, res) {
  // let name = req.body.username
  res.render('name-days', {
    list: await availableWaiters.adminSchedule(),  
    allDays: await availableWaiters.getAllDAys(),
    allWaiters: await availableWaiters.getAllWaiters()
  })
 // console.log(list);
});

app.post('/waiter/:username', async function (req, res) {
  var names = req.params.username;

  var days = req.body.day;
  if(names && days) {
    req.flash('error', 'Your shift has been successfully submitted');
  }

  var shift = await availableWaiters.createWaiterShifts(names, days)
  res.render('waiter', {
    shift,
    username: names,
    allDays: await availableWaiters.scheduleForWaiter(names),
    list: await availableWaiters.adminSchedule(),
   
  })
});

app.get('/waiter/:username', async function (req, res) {
  var username = req.params.username;

  res.render('waiter', {
    username,
    allDays: await availableWaiters.scheduleForWaiter(username),
  })
})

app.get('/clear', async function (req, res) {
  var cleared = await availableWaiters.clearNames();
  if (cleared) {
    req.flash('error', 'List has been successfully cleared');
  }
  res.redirect('days')
});

// app.get('/back', async function (req, res) {

//   res.render('index')
// })


const PORT = process.env.PORT || 3005;

app.listen(PORT, function () {
  console.log('App starting on port:', PORT);
})




