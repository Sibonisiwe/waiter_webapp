const assert = require("assert");
const AvailableWaiters = require("../waiter-fac");
const pg = require("pg");
let availableWaiters = AvailableWaiters()
const Pool = pg.Pool;

const connectionString = process.env.DATABASE_URL || 'postgresql://codex:codex123@localhost:5432/waiter_availability_test';
const pool = new Pool({
    connectionString
});
describe("The waiters-webApp", function () {
    beforeEach(async function () {
        await pool.query("delete from waiters_available");

    });

    describe("The selection functions", function () {
        it("should be able to insert and select a name", async function () {
            let availableWaiters = AvailableWaiters(pool)
          await availableWaiters.getWaiterId('Sinazo')
             //var selectName = await availableWaiters.selectName('Sinazo');
    
             
            assert.equal(14, await availableWaiters.getWaiterId('Sinazo'))
        });

        

        it("should be able to select a day from database and return the id of the day", async function () {
            let availableWaiters = AvailableWaiters(pool)
            var selectDay = await availableWaiters.selectDay('Saturday');
            assert.deepEqual(6, selectDay);
        });

        it("should be able to select a day from database and return the id of the day", async function () {
            let availableWaiters = AvailableWaiters(pool)
            var selectDay = await availableWaiters.selectDay('Monday');
            assert.deepEqual(1, selectDay);
        });
    });

    describe("The createWaiterShifts function", function(){
        it("should be able to insert a name into the waiters available table", async function(){
            let availableWaiters = AvailableWaiters(pool)
       await availableWaiters.createWaiterShifts('Lwando', 'Friday');
       //await availableWaiters.selectDay('Friday');
       
      var insert = await pool.query(`INSERT INTO waiters_available (name, days_available) VALUES('Lwando', 'Friday')`)
            assert.equal(6, 5, await availableWaiters.createWaiterShifts('Lwando', 'Friday'));
        });

    //     it("should be able to insert a day into the waiters available table", async function(){
    //         let availableWaiters = AvailableWaiters(pool)
    //    await availableWaiters.selectDay('Tuesday');
            
    //         assert.deepEqual(2, await availableWaiters.createWaiterShifts());
    //     });
    });

    after(function () {
        pool.end();
    });
});
