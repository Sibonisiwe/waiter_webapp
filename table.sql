create table waiters(
    id serial not null primary key,
    waiter_name varchar not null
);

create table working_days(
    id serial not null primary key,
    days varchar not null
);

create table waiters_available (
    id serial not null,
    name int not null,
    days_available int not null,
    FOREIGN KEY(name) REFERENCES waiters(id),
    FOREIGN KEY(days_available) REFERENCES working_days(id)
);

INSERT INTO waiters(waiter_name) VALUES ('Lwando');
INSERT INTO waiters(waiter_name) VALUES ('Sinazo');
INSERT INTO waiters(waiter_name) VALUES ('Nicole');
INSERT INTO waiters(waiter_name) VALUES ('Zinzi');
INSERT INTO waiters(waiter_name) VALUES ('Vuyo');
INSERT INTO waiters(waiter_name) VALUES ('Lindy');

INSERT INTO working_days(days) VALUES ('Monday');
INSERT INTO working_days(days) VALUES ('Tuesday');
INSERT INTO working_days(days) VALUES ('Wednesday');
INSERT INTO working_days(days) VALUES ('Thursday');
INSERT INTO working_days(days) VALUES ('Friday');
INSERT INTO working_days(days) VALUES ('Saturday');

INSERT INTO waiters_available(name, days_available) VALUES ('Lwando','Saturday');


SELECT waiters.waiter_name, working_days.days 
FROM working_days 
INNER JOIN waiters_available 
ON working_days.id =  waiters_available.days_available
INNER JOIN  waiters 
ON waiters.id = waiters_available.name  

 select * from waiters_available 
 join working_days 
 on waiters_available.days_available = working_days.id 
 join waiters on waiters_available.name = waiters.id; 