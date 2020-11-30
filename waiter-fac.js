module.exports = function AvailableWaiters(pool) {

    async function getWaiterId(name) {
        // console.log(name);

        const theWaiter = await pool.query(`select * from waiters where waiter_name = $1`, [name])
        if (theWaiter.rowCount === 0) {
            await pool.query(`INSERT INTO waiters(waiter_name) VALUES($1)`, [name]);
        }

        var names = await pool.query(`SELECT id FROM waiters WHERE waiter_name = $1`, [name]);
        return names.rows[0].id;
    }



    async function selectDay(days) {
        // console.log({days})

        var weekDays = await pool.query(`SELECT (id) FROM working_days WHERE days = $1`, [days]);
        //    console.log(weekDays.rows[0].id)
        return weekDays.rows[0].id;
    }

    // async function createWaiterShifts(name, days) {
    //     var admin = await adminSchedule()
    //     // console.log({admin:admin[0].waiters})
    //     var waiterId = await getWaiterId(name);


    //     // here we needs the waiter id...
    //      // for (const week of admin) {
    //          await pool.query(`delete from waiters_available where name = $1`,[waiterId]);
    //     for (const workingDay of days) {
    //         // if (week.days === workingDay) {
    //         var dayId = await selectDay(workingDay);
    //         //console.log(dayId);
    //         await pool.query(`INSERT INTO waiters_available (name, days_available) VALUES($1, $2)`, [waiterId, dayId]);
    //         // }
    //     }
    //     // }
    //     return admin;
    // }

    async function createWaiterShifts(name, days) {
        var admin = await adminSchedule()
        // console.log({admin:admin[0].waiters})
        var waiterId = await getWaiterId(name);


        // here we needs the waiter id...
        // for (const week of admin) {
        await pool.query(`delete from waiters_available where name = $1`, [waiterId]);
        for (const workingDay of days) {
            // if (week.days === workingDay) {
            var dayId = await selectDay(workingDay);
            //console.log(dayId);
            await pool.query(`INSERT INTO waiters_available (name, days_available) VALUES($1, $2)`, [waiterId, dayId]);
            // }
        }
        // }
        return admin;
    }



    async function getAllDAys() {
        var allWorkingDays = await pool.query(`SELECT  days FROM working_days`);
        return allWorkingDays.rows;
    }

    async function getAllWaiters() {
        var allWaiters = await pool.query(`SELECT  waiter_name FROM waiters`);
        return allWaiters.rows;
    }

async function waiterSchedule(name) {
    var waiterId = await getWaiterId(name)
    var waiterData =  await pool.query(` select * from waiters_available 
    join working_days 
    on waiters_available.days_available = working_days.id 
    join waiters on waiters_available.name = waiters.id where name = $1;`,[waiterId]);
    // console.log(allData)
    return waiterData.rows;
}

    async function joinedData() {
        //var joinedTables = insertToTable(name, days);
        var allData = await pool.query(` select * from waiters_available 
        join working_days 
        on waiters_available.days_available = working_days.id 
        join waiters on waiters_available.name = waiters.id;`);
        // console.log(allData)
        return allData.rows;
    }

    async function adminSchedule() {
        const weekdays = await getAllDAys()
        //console.log(weekdays)
        const schedule = await joinedData();
        // console.log(schedule);
        weekdays.forEach(async (day) => {
            day.waiters = []
            day.checked = ""
            schedule.forEach(async (waiter) => {
                //console.log({waiter})
                if (waiter.days === day.days) {
                    day.checked = "checked"
                    // console.log(waiter.waiter_name);
                    day.waiters.push(waiter.waiter_name);

                }
                // if (waiter.days === day.days && waiter.waiter_name === waiters) {
                //     day.checked = "checked"
                // }
            })

            if (day.waiters.length === 3) {
                day.color = "green";
            }
            else if (day.waiters.length < 3) {
                day.color = "orange";
            }
            else if (day.waiters.length > 3) {
                day.color = "red";
            }
        });
        // 
        console.log(weekdays);
        return weekdays
    }

    async function scheduleForWaiter(name) {
        const weekdays = await getAllDAys()
        //console.log(weekdays)
        const schedule = await waiterSchedule(name);
        // console.log(schedule);
        weekdays.forEach(async (day) => {
            day.waiters = []
            day.checked = ""
            schedule.forEach(async (waiter) => {
                //console.log({waiter})
                if (waiter.days === day.days) {
                    day.checked = "checked"
                    // console.log(waiter.waiter_name);
                    day.waiters.push(waiter.waiter_name);

                }
                
            })
        });
        // 
        console.log(weekdays);
        return weekdays
    }

    async function clearNames() {
        var clearList = await pool.query(`DELETE FROM waiters_available`);
        return clearList;
    }

    return {
        getWaiterId,
        selectDay,
        createWaiterShifts,
        //getWaiters,
        getAllDAys,
        getAllWaiters,
        joinedData,
        adminSchedule,
        clearNames,
        scheduleForWaiter
    }
}