create table waiters(
    id serial not null primary key,
    waiter_name varchar not null,
);

create table working_days(
    id serial not null primary key,
    days varchar not null,
);

create table waiters_available(
name varchar not null,
days_available varchar not null,
FOREIGN KEY(name) REFERENCES waiters(id),
FOREIGN KEY(days_available) REFERENCES working_days(id)

);