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


app.get('/', function (req, res) {

  res.render('index')
});

app.get('/waiter/:username', async function (req, res) {
  const enterName = req.params.username;

// console.log(x)
// for(let x =0; x < days.length; i++){
// console.log(x[i])
// }
  //console.log(enterName)
  let waiterObj = {
    enterName,
    days
  }


  // console.log( "fdfdfdfdfdf" +  selectDay)
  let all = await availableWaiters.getWaiters()
  res.render('index', {
    list: await waiterAvail,
    listed: await all,
    enterName

  })
})

app.post('/waiter/:username', async function (req, res) {
  let name = req.params.username
  const days = req.body.day;

  let selectedDay;
  for(let x = 0; x < days.length; x++){
     day = days[x]
     console.log('dfdfdfdfdfdfdf'+ day)
      selectedDay = await availableWaiters.selectDay(day)

  }
   console.log(selectedDay+ 'sddasasasasasa')
  //  console.log(day)
  let waiterAvail = await availableWaiters.insertToTable(name,selectedDay);
console.log(waiterAvail + "dfdfdfdfdfdfd");
res.render('index',{
name
})
});


const PORT = process.env.PORT || 3004;

app.listen(PORT, function () {
  console.log('App starting on port:', PORT);
})