
create table expenses(
    id serial primary key,
    user_id integer not null references users(id) on delete cascade, 
    category varchar(100) not null, 
    exp_description varchar(255),
    amount numeric(12, 2) not null constraint amount_positive check (amount>0),
    created timestamp default now(),
    updated timestamp default now()
);