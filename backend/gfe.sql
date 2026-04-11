DROP TABLE IF EXISTS inbox;
DROP TABLE IF EXISTS contact_us;
DROP TABLE IF EXISTS jobposts;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('client', 'jobseeker')),
    has_profile BOOLEAN DEFAULT FALSE,
    fullname VARCHAR(255),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    location VARCHAR(255),
    services VARCHAR(20) CHECK (services IN ('childcare', 'elderly care', 'cleaning')),
    about_you TEXT,
    experience VARCHAR(20) CHECK (experience IN ('0-1 years', '1-3 years', '3-5 years', '5+ years')),
    hourly_rate VARCHAR(20) CHECK (hourly_rate IN ('€10 - €15/hour', '€15 - €20/hour', '€20 - €25/hour', '€25+ /hour')), 
    about_experience TEXT,
    skills TEXT,
    photo VARCHAR(255),
    is_paused BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE contact_us (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(100),
  email VARCHAR(100),
  phone VARCHAR(20),
  subject VARCHAR(200),
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE inbox (
  id SERIAL PRIMARY KEY,
  sender_id INT REFERENCES users(id),
  receiver_id INT REFERENCES users(id),
  message_text TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

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

INSERT INTO users (email, password, role, has_profile, fullname, contact_email, contact_phone)
VALUES
('emma.virtanen@helsinki.fi', '$2b$10$UkL5NetbjP3veCzBGS6MYeQD3mX3h7OnLEgTknU.rEEkQpgAqKYki', 'client', true, 'Emma Virtanen', 'emma.virtanen@helsinki.fi', '+358401111111'),
('oliver.korhonen@espoo.fi', '$2b$10$UkL5NetbjP3veCzBGS6MYeQD3mX3h7OnLEgTknU.rEEkQpgAqKYki', 'client', true, 'Oliver Korhonen', 'oliver.korhonen@espoo.fi', '+358401111112'),
('sofia.makinen@tampere.fi', '$2b$10$UkL5NetbjP3veCzBGS6MYeQD3mX3h7OnLEgTknU.rEEkQpgAqKYki', 'client', true, 'Sofia Mäkinen', 'sofia.makinen@tampere.fi', '+358401111113'),
('liam.niemi@oulu.fi', '$2b$10$UkL5NetbjP3veCzBGS6MYeQD3mX3h7OnLEgTknU.rEEkQpgAqKYki', 'client', true, 'Liam Niemi', 'liam.niemi@oulu.fi', '+358401111114'),
('aava.lahtinen@turku.fi', '$2b$10$UkL5NetbjP3veCzBGS6MYeQD3mX3h7OnLEgTknU.rEEkQpgAqKYki', 'client', true, 'Aava Lahtinen', 'aava.lahtinen@turku.fi', '+358401111115'),
('elias.heikkinen@helsinki.fi', '$2b$10$UkL5NetbjP3veCzBGS6MYeQD3mX3h7OnLEgTknU.rEEkQpgAqKYki', 'client', true, 'Elias Heikkinen', 'elias.heikkinen@helsinki.fi', '+358401111116'),
('aino.koskinen@espoo.fi', '$2b$10$UkL5NetbjP3veCzBGS6MYeQD3mX3h7OnLEgTknU.rEEkQpgAqKYki', 'client', true, 'Aino Koskinen', 'aino.koskinen@espoo.fi', '+358401111117'),
('noah.salminen@tampere.fi', '$2b$10$UkL5NetbjP3veCzBGS6MYeQD3mX3h7OnLEgTknU.rEEkQpgAqKYki', 'client', true, 'Noah Salminen', 'noah.salminen@tampere.fi', '+358401111118'),
('lumi.hamalainen@oulu.fi', '$2b$10$UkL5NetbjP3veCzBGS6MYeQD3mX3h7OnLEgTknU.rEEkQpgAqKYki', 'client', true, 'Lumi Hämäläinen', 'lumi.hamalainen@oulu.fi', '+358401111119'),
('otto.lehtonen@turku.fi', '$2b$10$UkL5NetbjP3veCzBGS6MYeQD3mX3h7OnLEgTknU.rEEkQpgAqKYki', 'client', true, 'Otto Lehtonen', 'otto.lehtonen@turku.fi', '+358401111120');

INSERT INTO users (email, password, role, has_profile, fullname, contact_email, contact_phone, location, services, about_you, experience, hourly_rate, about_experience, skills)
VALUES
('ville.hamalainen@oulu.fi', '$2b$10$UkL5NetbjP3veCzBGS6MYeQD3mX3h7OnLEgTknU.rEEkQpgAqKYki', 'jobseeker', true, 'Ville Hämäläinen', 'ville.hamalainen@oulu.fi', '+358402222229', 'Oulu - Rajakylä', 'cleaning', 'I am a detail-oriented and hardworking person.', '1-3 years', '€15 - €20/hour', 'I have experience cleaning homes and apartments.', 'House Cleaning, Surface Cleaning'),
('ida.salminen@tampere.fi', '$2b$10$UkL5NetbjP3veCzBGS6MYeQD3mX3h7OnLEgTknU.rEEkQpgAqKYki', 'jobseeker', true, 'Ida Salminen', 'ida.salminen@tampere.fi', '+358402222228', 'Tampere - Pyynikki', 'elderly care', 'I am patient, calm, and understanding.', '0-1 years', '€10 - €15/hour', 'I have supported elderly individuals in their daily lives.', 'Elder companionship, Meal preparation, Mobility assistance'),
('pekka.koskinen@espoo.fi', '$2b$10$UkL5NetbjP3veCzBGS6MYeQD3mX3h7OnLEgTknU.rEEkQpgAqKYki', 'jobseeker', true, 'Pekka Koskinen', 'pekka.koskinen@espoo.fi', '+358402222227', 'Espoo - Matinkylä', 'elderly care', 'I am empathetic and dedicated to quality care.', '3-5 years', '€25+ /hour', 'I have experience helping elderly clients.', 'Elder companionship, Meal preparation'),
('anni.niemi@oulu.fi', '$2b$10$UkL5NetbjP3veCzBGS6MYeQD3mX3h7OnLEgTknU.rEEkQpgAqKYki', 'jobseeker', true, 'Anni Niemi', 'anni.niemi@oulu.fi', '+358402222224', 'Oulu - Linnanmaa', 'childcare', 'I am kind and attentive with children.', '3-5 years', '€20 - €25/hour', 'I have experience working with young children.', 'Babysitting, Child supervision, Homework assistance'),
('teemu.makinen@tampere.fi', '$2b$10$UkL5NetbjP3veCzBGS6MYeQD3mX3h7OnLEgTknU.rEEkQpgAqKYki', 'jobseeker', true, 'Teemu Mäkinen', 'teemu.makinen@tampere.fi', '+358402222223', 'Tampere - Kaleva', 'childcare', 'I am responsible and warm-hearted.', '1-3 years', '€15 - €20/hour', 'I have taken care of children in both part-time and full-time roles.', 'Babysitting, Homework assistance'),
('laura.korhonen@espoo.fi', '$2b$10$UkL5NetbjP3veCzBGS6MYeQD3mX3h7OnLEgTknU.rEEkQpgAqKYki', 'jobseeker', true, 'Laura Korhonen', 'laura.korhonen@espoo.fi', '+358402222222', 'Espoo - Otaniemi', 'childcare', 'I am energetic and friendly with children.', '0-1 years', '€10 - €15/hour', 'I have worked as a babysitter for several families.', 'Babysitting, Child supervision'),
('mika.virtanen@helsinki.fi', '$2b$10$UkL5NetbjP3veCzBGS6MYeQD3mX3h7OnLEgTknU.rEEkQpgAqKYki', 'jobseeker', true, 'Mika Virtanen', 'mika.virtanen@helsinki.fi', '+358402222221', 'Helsinki - Kamppi', 'childcare', 'I am a caring and patient person.', '0-1 years', '€10 - €15/hour', 'I have experience taking care of children of different ages.', 'Babysitting, Child supervision');