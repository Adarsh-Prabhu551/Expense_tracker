create table users(
    id serial primary key,
    name varchar(100) not null,
    income numeric(10, 2) not null, 
    created timestamp default now(),
    updated timestamp default now()
);
