DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('client', 'jobseeker')),
    fullname VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(20),
    location VARCHAR(255) NOT NULL,
    services VARCHAR(20) NOT NULL CHECK (services IN ('childcare', 'elderly care', 'cleaning')),
    about_you TEXT,
    experience VARCHAR(20) NOT NULL CHECK (experience IN ('0-1 years', '1-3 years', '3-5 years', '5+ years')),
    hourly_rate VARCHAR(20) NOT NULL CHECK (hourly_rate IN ('€10 - €15/hour', '€15 - €20/hour', '€20 - €25/hour', '€25+ /hour')), 
    about_experience TEXT,
    skills TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
SELECT * FROM users;
INSERT INTO users (email, password, role) VALUES ('john.doe@example.com', '123', 'jobseeker');
UPDATE users SET fullname = 'John Doe', contact_email = 'john.doe@example.com', contact_phone = '123-456-7890', location = 'New York', services = 'childcare', about_you = 'I am a caring and experienced babysitter.', experience = '1-3 years', hourly_rate = '€15 - €20/hour', about_experience = 'I have experience working with children of various ages and can provide quality childcare.', skills = 'Babysitting, Child supervision, Meal preparation for kids' WHERE email = 'john.doe@example.com';


DROP TABLE IF EXISTS jobposts;
CREATE TABLE jobposts (
    id SERIAL PRIMARY KEY,
    client_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    service_type VARCHAR(20) NOT NULL CHECK (service_type IN ('childcare', 'elderly care', 'cleaning')),
    service_title VARCHAR(255) NOT NULL,
    service_description TEXT,
    service_schedule TEXT,
    service_frequency VARCHAR(20) NOT NULL CHECK (service_frequency IN ('regular', 'occasional')),
    service_location VARCHAR(255) NOT NULL,
    service_pay_rate VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);