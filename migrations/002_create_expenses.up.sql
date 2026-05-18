
create table expense(
    id serial primary key,
    user_id integer references users(id) on delete cascade, 
    exp_type varchar(100) not null, 
    amount numeric(12, 2) not null,
    created timestamp default now(),
    updated timestamp default now()
);