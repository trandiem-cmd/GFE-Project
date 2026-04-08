DROP TABLE IF EXISTS users;
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
    services VARCHAR(20)CHECK (services IN ('childcare', 'elderly care', 'cleaning')),
    about_you TEXT,
    experience VARCHAR(20) CHECK (experience IN ('0-1 years', '1-3 years', '3-5 years', '5+ years')),
    hourly_rate VARCHAR(20) CHECK (hourly_rate IN ('€10 - €15/hour', '€15 - €20/hour', '€20 - €25/hour', '€25+ /hour')), 
    about_experience TEXT,
    skills TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
SELECT * FROM users;
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
('otto.lehtonen@turku.fi', '$2b$10$UkL5NetbjP3veCzBGS6MYeQD3mX3h7OnLEgTknU.rEEkQpgAqKYki', 'client', true, 'Otto Lehtonen', 'otto.lehtonen@turku.fi', '+358401111120')
INSERT INTO users (email, password, role, has_profile, fullname, contact_email, contact_phone, location, services, about_you, experience, hourly_rate, about_experience, skills)
VALUES
('ville.hamalainen@oulu.fi', '$2b$10$UkL5NetbjP3veCzBGS6MYeQD3mX3h7OnLEgTknU.rEEkQpgAqKYki', 'jobseeker', true, 'Ville Hämäläinen', 'ida.salminen@tampere.fi', '+358402222229', 'Oulu - Rajakylä', 'cleaning','I am a detail-oriented and hardworking person who takes pride in keeping spaces clean and organized. I am reliable, punctual, and efficient in my work. I enjoy creating a fresh and comfortable environment. I always pay attention to small details.','1-3 years','€15 - €20/hour','I have experience cleaning homes and apartments regularly. My tasks included vacuuming, dusting, and sanitizing surfaces. I am familiar with different cleaning tools and products. I always ensure high standards of cleanliness.','House Cleaning, Surface Cleaning'),
('noora.lehtonen@turku.fi', '$2b$10$UkL5NetbjP3veCzBGS6MYeQD3mX3h7OnLEgTknU.rEEkQpgAqKYki', 'jobseeker', true, 'Noora Lehtonen', 'ville.hamalainen@oulu.fi', '+358402222230', 'Turku - Hirvensalo', 'cleaning','I am responsible, organized, and committed to delivering high-quality cleaning services. I work efficiently and maintain a positive attitude. I am trustworthy and respectful of clients’ spaces. I always aim to exceed expectations.','3-5 years','€25+ /hour','I have worked in residential cleaning for several clients. I handled deep cleaning tasks as well as regular maintenance. I am comfortable following specific instructions and preferences. I ensure that all areas are clean and tidy.','House Cleaning, Surface Cleaning, Deep Cleaning, Laundry');
('ida.salminen@tampere.fi', '$2b$10$UkL5NetbjP3veCzBGS6MYeQD3mX3h7OnLEgTknU.rEEkQpgAqKYki', 'jobseeker', true, 'Ida Salminen', 'pekka.koskinen@espoo.fi', '+358402222228', 'Tampere - Pyynikki', 'elderly care','I am patient, calm, and understanding when working with elderly people. I believe in treating everyone with respect and kindness. I am dependable and always willing to help. I adapt easily to different needs and situations.','0-1 years','€10 - €15/hour','I have supported elderly individuals in their daily lives, including mobility and routine care. I provided companionship and ensured their comfort and safety. I am experienced in handling different care needs. I also communicate regularly with families when needed.','Elder companionship, Meal prepration,Mobility assistance'),
('pekka.koskinen@espoo.fi', '$2b$10$UkL5NetbjP3veCzBGS6MYeQD3mX3h7OnLEgTknU.rEEkQpgAqKYki', 'jobseeker', true, 'Pekka Koskinen', 'sara.heikkinen@helsinki.fi', '+358402222227', 'Espoo - Matinkylä', 'elderly care','I am empathetic, respectful, and dedicated to providing quality care. I enjoy listening and building trust with elderly clients. I am organized and attentive to detail. I take pride in being reliable and supportive.','3-5 years','€25+ /hour','I have experience helping elderly clients with personal care and daily tasks. I assisted with meals, light housekeeping, and medication reminders. I am comfortable working independently and following care plans. I also focus on maintaining a positive and safe environment.','Elder companionship, Meal prepration'),
('sara.heikkinen@helsinki.fi', '$2b$10$UkL5NetbjP3veCzBGS6MYeQD3mX3h7OnLEgTknU.rEEkQpgAqKYki', 'jobseeker', true, 'Sara Heikkinen', 'jani.lahtinen@turku.fi', '+358402222226', 'Helsinki - Lauttasaari', 'elderly care','I am a caring and dependable person with a strong sense of responsibility. I enjoy helping others and making a positive difference in their daily lives. I am patient and understanding, especially in challenging situations. I always aim to create a comfortable environment.','1-3 years','€15 - €20/hour','I have worked with elderly individuals in home care settings. My responsibilities included assisting with daily routines and providing companionship. I am experienced in monitoring well-being and responding to needs quickly. I also maintain a clean and safe living space.','Meal prepration, Mobility assistance, Medication management'),
('jani.lahtinen@turku.fi', '$2b$10$UkL5NetbjP3veCzBGS6MYeQD3mX3h7OnLEgTknU.rEEkQpgAqKYki', 'jobseeker', true, 'Jani Lahtinen', 'anni.niemi@oulu.fi', '+358402222225', 'Turku - Nummi', 'elderly care','I am a compassionate and patient caregiver who enjoys helping elderly people. I value respect, dignity, and kindness in every interaction. I am calm, reliable, and attentive to individual needs. I also communicate clearly and respectfully.','0-1 years','€10 - €15/hour','I have experience assisting elderly clients with daily activities such as meal preparation and mobility support. I am comfortable providing companionship and emotional support. I understand the importance of routine and consistency. I have worked with both independent and assisted individuals.','Meal prepration, Mobility assistance, Medication management'),
('anni.niemi@oulu.fi', '$2b$10$UkL5NetbjP3veCzBGS6MYeQD3mX3h7OnLEgTknU.rEEkQpgAqKYki', 'jobseeker', true, 'Anni Niemi', 'anni.niemi@oulu.fi', '+358402222224', 'Oulu - Linnanmaa', 'childcare','I am kind, attentive, and enjoy building meaningful connections with children. I am calm under pressure and can handle unexpected situations well. I believe in creating a supportive and nurturing environment. I am also very reliable and detail-oriented.','3-5 years','€20 - €25/hour','I have experience working with young children in home settings. My duties included feeding, playing, and ensuring a safe environment. I am familiar with daily childcare routines and responsibilities. I also communicate regularly with parents to provide updates.','Babysitting,Child supervision, Homework assistance, Playtime activities'),
('teemu.makinen@tampere.fi', '$2b$10$UkL5NetbjP3veCzBGS6MYeQD3mX3h7OnLEgTknU.rEEkQpgAqKYki', 'jobseeker', true, 'Teemu Mäkinen', 'teemu.makinen@tampere.fi', '+358402222223', 'Tampere - Kaleva', 'childcare','I am a responsible and warm-hearted individual who enjoys helping children develop new skills. I believe in positive communication and encouragement. I am organized and dependable in following daily routines. I take pride in being trustworthy and punctual.','1-3 years','€15 - €20/hour','I have taken care of children in both part-time and full-time roles. I helped with school activities, bedtime routines, and light household tasks. I am experienced in keeping children engaged and active. I also adapt easily to different family needs.','Babysitting, Homework assistance, Playtime activities'),
('laura.korhonen@espoo.fi', '$2b$10$UkL5NetbjP3veCzBGS6MYeQD3mX3h7OnLEgTknU.rEEkQpgAqKYki', 'jobseeker', true, 'Laura Korhonen', 'laura.korhonen@espoo.fi', '+358402222222', 'Espoo - Otaniemi', 'childcare','I am energetic, friendly, and love working with children. I enjoy creative activities like drawing, storytelling, and playing games. I am patient and understand how to handle different behaviors calmly. I always try to build trust with both children and parents.','0-1 years','€10 - €15/hour','I have worked as a babysitter for several families in the past. My responsibilities included supervising playtime, preparing snacks, and maintaining a structured routine. I am experienced in managing multiple children at once. I also have basic knowledge of child safety and first aid.','Meal prepration for kids, Babysitting,Child supervision'),
('mika.virtanen@helsinki.fi', '$2b$10$UkL5NetbjP3veCzBGS6MYeQD3mX3h7OnLEgTknU.rEEkQpgAqKYki', 'jobseeker', true, 'Mika Virtanen', 'mika.virtanen@helsinki.fi', '+358402222221', 'Helsinki - Kamppi','childcare','I am a caring and patient person who genuinely enjoys spending time with children. I value creating a safe and fun environment where kids can learn and grow. I am responsible, reliable, and always attentive to childrens needs. I also communicate well with parents.','0-1 years','€10 - €15/hour','I have experience taking care of children of different ages, from toddlers to school-aged kids. My tasks included preparing meals, organizing activities, and helping with homework. I am comfortable handling daily routines and ensuring safety at all times. I have also worked with families on a regular weekly schedule.','Babysitting,Child supervision'),


UPDATE users set skills = 'Babysitting, Child supervision' WHERE id=17;

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
)
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