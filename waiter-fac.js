module.exports = function AvailableWaiters(pool) {

    async function selectName(name) {
        var names = await pool.query(`SELECT (id) FROM waiters WHERE waiter_name = $1`, [name]);
       
        return names.rows;
    }



    async function selectDay(day){
        console.log({day})
        
         var weekDays = await pool.query(`SELECT (id) FROM working_days WHERE days = $1`, [day]);
       // console.log(weekDays.rows[0].id)
        return weekDays.rows.id;
    } 

    async function insertToTable(name, day){
        var names = await selectName(name);
        //console.log(names);
        var days = await selectDay(day)
        //if(names < 1){
            await pool.query(`INSERT INTO waiters_available (name, days_available) VALUES($1, $2)`,[names, days]);
        }

   // }

    async function waiters_and_days(){

    }

    // async function insertToTable(day){
    //     var days = await selectName(day);
    //     //var days = await selectDay(day)
    //     await pool.query(`INSERT INTO waiters_available (days_available) VALUES $1`, [days]);

    // }

    async function getWaiters(){
        var all = await pool.query(`SELECT * FROM waiters_available`);
        return all.rows;
    }

    return {
        selectName,
        selectDay,
        insertToTable,
        getWaiters,
    }
}