DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('client', 'jobseeker')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
SELECT * FROM users;

DROP TABLE IF EXISTS profiles;
CREATE TABLE profiles (
    id SERIAL PRIMARY KEY,
    fullname VARCHAR(255) NOT NULL,
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
INSERT INTO profiles (fullname, email, location, services, about_you, experience, hourly_rate, about_experience, skills) VALUES
('John Doe', 'john.doe@example.com', 'New York', 'childcare', 'I am a caring and experienced babysitter.', '1-3 years', '€15 - €20/hour', 'I have experience working with children of various ages and can provide quality childcare.', 'Babysitting, Child supervision, Meal preparation for kids');

DELETE FROM profiles;


/* contact us table */
CREATE TABLE contact_us (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(100),
  email VARCHAR(100),
  phone VARCHAR(20),
  subject VARCHAR(200),
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- inbox table
CREATE TABLE inbox (
  id SERIAL PRIMARY KEY,
  sender_id INT REFERENCES users(id),
  receiver_id INT REFERENCES users(id),
  message_text TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);