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
        it("should be able to select a name from database", async function () {
            let availableWaiters = AvailableWaiters(pool)
        //    await availableWaiters.selectName('Sinazo')
             var selectName = await availableWaiters.selectName('Sinazo');
             console.log(selectName.rows);
             console.log("edfgvb")
            assert.deepEqual(2, selectName)
        });

        it("should be able to select a day from database", async function () {
            let availableWaiters = AvailableWaiters(pool)
            var selectDay = await availableWaiters.selectDay('Saturday');
            assert.deepEqual(6, selectDay);
        });

        it("should be able to select a day from database", async function () {
            let availableWaiters = AvailableWaiters(pool)
            var selectDay = await availableWaiters.selectDay('Monday');
            assert.deepEqual(1, selectDay);
        });
    });

    describe("The Insert into function", function(){
        it("should be able to insert a name and day into the waiters available table", async function(){
            let availableWaiters = AvailableWaiters(pool)
       await availableWaiters.insertToTable('Lwando', 'Saturday');
            
            assert.deepEqual([{ days_available: 6, name: 1}], await availableWaiters.getWaiters());
        });

        it("should be able to insert a name and day into the waiters available table", async function(){
            let availableWaiters = AvailableWaiters(pool)
       await availableWaiters.insertToTable('Zinzi', 'Tuesday');
            
            assert.deepEqual([{ days_available: 2, name: 4}], await availableWaiters.getWaiters());
        });
    });

    after(function () {
        pool.end();
    });
});
