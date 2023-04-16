--create database hair_donation_DB

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

create table
    dbo.users_tbl (
        uid uuid primary key DEFAULT uuid_generate_v4(),
        username VARCHAR(50) unique not null,
        useremail varchar(40) unique not null,
        password text not null,
        userrole varchar(10) not null,
        phone_number varchar(15) not null,
        latitude float,
        longitude float,
        address text null,
        country varchar(100) null,
        city varchar(100) null,
        continent varchar(100) null,
        createdtime TIMESTAMP default now(),
        lastlogin TIMESTAMP null,
        CONSTRAINT chk_userrole CHECK (
            userrole IN ('DONOR', 'RECIPIENT')
        )
    ) -- alter table users_tbl
    -- alter column uid type bigint
create table
    dbo.hair_donations_tbl(
        donationid serial primary key,
        userid uuid,
        donationtype varchar(100) not null,
        hairtype text not null,
        donationstatus int4 default 0 null,
        imagename text null imageurl text null,
        createdat TIMESTAMP default now(),
        lastupdatedat timestamp null,
        CONSTRAINT fk_uid FOREIGN KEY(userid) REFERENCES dbo.users_tbl(uid) ON DELETE CASCADE
    )
create table
    dbo.recipient_requests_tbl(
        requestid serial primary key,
        donationid int4,
        userid uuid not null,
        donation_owner uuid not null,
        requestedtime timestamp default now(),
        request_status int4 default 0 null,
        lastupdatedat timestamp null,
        CONSTRAINT fk_request_uid FOREIGN KEY(userid) REFERENCES dbo.users_tbl(uid) ON DELETE
        SET
            NULL,
            CONSTRAINT fk_donationdid FOREIGN KEY(donationid) REFERENCES dbo.hair_donations_tbl(donationid) ON DELETE
        SET NULL
    );

create table
    dbo.notifications_tbl(
        notificationid serial PRIMARY key,
        userid uuid null,
        donationid int4 null,
        readstatus boolean null,
        createdtime TIMESTAMP DEFAULT now(),
        lastupdatedat timestamp null,
        CONSTRAINT fk_notifications_uid FOREIGN KEY(userid) REFERENCES dbo.users_tbl(uid) ON DELETE
        SET
            NULL,
            CONSTRAINT fk_notifications_donationdid FOREIGN KEY(donationid) REFERENCES dbo.hair_donations_tbl(donationid) ON DELETE
        SET NULL
    ) create or
replace
    function dbo.get_near_donor_details (
        vhairtype text,
        vcountry varchar(100),
        vcity varchar(100),
        vaddress text,
        vcontinent varchar(100)
    ) returns
table (donor_id uuid, donationid int4) language plpgsql as $$ begin
return query
select
    ut.uid as donorid,
    hdt.donationid
from
    dbo.hair_donations_tbl hdt
    inner join dbo.users_tbl ut on hdt.userid = ut.uid
where
    hdt.hairtype ilike ('%' || vhairtype || '%')
    and (
        ut.country ilike ('%' || vcountry || '%')
        or ut.city ilike ('%' || vcity || '%')
        or ut.address ilike ('%' || vaddress || '%')
        or ut.continent ilike ('%' || vcontinent || '%')
    );

end;

$$
select *
from
    dbo.get_near_donor_details(
        'Black',
        'India',
        'Hyderabad',
        'Golkonda mandal',
        'Asia'
    );