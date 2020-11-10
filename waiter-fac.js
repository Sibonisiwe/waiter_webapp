module.exports = function AvailableWaiters(pool) {

    async function selectName(name) {
        var names = await pool.query(`SELECT (id) FROM waiters WHERE waiter_name = $1`, [name]);

        return names.rows[0].id;
    }



    async function selectDay(days) {
        // console.log({days})

        var weekDays = await pool.query(`SELECT (id) FROM working_days WHERE days = $1`, [days]);
        //    console.log(weekDays.rows[0].id)
        return weekDays.rows[0].id;
    }

    async function insertToTable(name, days) {
        const day = await getAllDAys()
        var names = await selectName(name);
        console.log(names);

        for (const week of day) {
            for (const workingDays of days) {
                if(week.days === workingDays) {
                  var id = await selectDay(workingDays);
                  console.log(id);
                  await pool.query(`INSERT INTO waiters_available (name, days_available) VALUES($1, $2)`, [names, id]);
                }
            }
        }
    }

    
    async function getWaiters() {
        var all = await pool.query(`SELECT name, days_available FROM waiters_available`);
        console.log(all.rows)
        return all.rows;
    }

    async function getAllDAys() {
        var allWorkingDays = await pool.query(`SELECT  days FROM working_days`);
        return allWorkingDays.rows;
    }

    return {
        selectName,
        selectDay,
        insertToTable,
        getWaiters,
        getAllDAys,
    }
}