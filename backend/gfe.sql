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
    services VARCHAR(20)CHECK (services IN ('childcare', 'eldercare', 'cleaning')),
    about_you TEXT,
    experience VARCHAR(20) CHECK (experience IN ('0-1 years', '1-3 years', '3-5 years', '5+ years')),
    hourly_rate VARCHAR(20) CHECK (hourly_rate IN ('€10 - €15/hour', '€15 - €20/hour', '€20 - €25/hour', '€25+ /hour')), 
    about_experience TEXT,
    skills TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
SELECT * FROM users;
SELECT * FROM users WHERE role = 'jobseeker';
DELETE FROM users WHERE id IN (29,30,31,32);
DELETE FROM users WHERE id=28;

DROP TABLE IF EXISTS jobposts;
CREATE TABLE jobposts (
    id SERIAL PRIMARY KEY,
    client_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    service_type VARCHAR(20) NOT NULL CHECK (service_type IN ('childcare', 'eldercare', 'cleaning')),
    service_title VARCHAR(255) NOT NULL,
    service_description TEXT,
    service_schedule TEXT,
    service_frequency VARCHAR(20) NOT NULL CHECK (service_frequency IN ('regular', 'occasional')),
    service_location VARCHAR(255) NOT NULL,
    service_pay_rate VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
SELECT * FROM jobposts;

INSERT INTO users (email, password, role, has_profile, fullname, contact_email, contact_phone,location)
VALUES
('emma.virtanen@helsinki.fi', '$2b$10$UkL5NetbjP3veCzBGS6MYeQD3mX3h7OnLEgTknU.rEEkQpgAqKYki', 'client', true, 'Emma Virtanen', 'emma.virtanen@helsinki.fi', '+358401111111', 'Helsinki - Lauttasaari'),
('oliver.korhonen@espoo.fi', '$2b$10$UkL5NetbjP3veCzBGS6MYeQD3mX3h7OnLEgTknU.rEEkQpgAqKYki', 'client', true, 'Oliver Korhonen', 'oliver.korhonen@espoo.fi', '+358401111112','Espoo - Otaniemi'),
('sofia.makinen@tampere.fi', '$2b$10$UkL5NetbjP3veCzBGS6MYeQD3mX3h7OnLEgTknU.rEEkQpgAqKYki', 'client', true, 'Sofia Mäkinen', 'sofia.makinen@tampere.fi', '+358401111113','Tampere - Kaleva'),
('liam.niemi@oulu.fi', '$2b$10$UkL5NetbjP3veCzBGS6MYeQD3mX3h7OnLEgTknU.rEEkQpgAqKYki', 'client', true, 'Liam Niemi', 'liam.niemi@oulu.fi', '+358401111114','Oulu - Linnanmaa'),
('aava.lahtinen@turku.fi', '$2b$10$UkL5NetbjP3veCzBGS6MYeQD3mX3h7OnLEgTknU.rEEkQpgAqKYki', 'client', true, 'Aava Lahtinen', 'aava.lahtinen@turku.fi', '+358401111115','Turku - Hirvensalo'),
('elias.heikkinen@helsinki.fi', '$2b$10$UkL5NetbjP3veCzBGS6MYeQD3mX3h7OnLEgTknU.rEEkQpgAqKYki', 'client', true, 'Elias Heikkinen', 'elias.heikkinen@helsinki.fi', '+358401111116','Helsinki - Kamppi'),
('aino.koskinen@espoo.fi', '$2b$10$UkL5NetbjP3veCzBGS6MYeQD3mX3h7OnLEgTknU.rEEkQpgAqKYki', 'client', true, 'Aino Koskinen', 'aino.koskinen@espoo.fi', '+358401111117','Espoo - Otaniemi'),
('noah.salminen@tampere.fi', '$2b$10$UkL5NetbjP3veCzBGS6MYeQD3mX3h7OnLEgTknU.rEEkQpgAqKYki', 'client', true, 'Noah Salminen', 'noah.salminen@tampere.fi', '+358401111118','Tampere - Kaleva'),
('lumi.hamalainen@oulu.fi', '$2b$10$UkL5NetbjP3veCzBGS6MYeQD3mX3h7OnLEgTknU.rEEkQpgAqKYki', 'client', true, 'Lumi Hämäläinen', 'lumi.hamalainen@oulu.fi', '+358401111119','Oulu - Rajakylä'),
('otto.lehtonen@turku.fi', '$2b$10$UkL5NetbjP3veCzBGS6MYeQD3mX3h7OnLEgTknU.rEEkQpgAqKYki', 'client', true, 'Otto Lehtonen', 'otto.lehtonen@turku.fi', '+358401111120','Turku - Nummi')
INSERT INTO users (email, password, role, has_profile, fullname, contact_email, contact_phone, location, services, about_you, experience, hourly_rate, about_experience, skills)
VALUES
('ville.hamalainen@oulu.fi', '$2b$10$UkL5NetbjP3veCzBGS6MYeQD3mX3h7OnLEgTknU.rEEkQpgAqKYki', 'jobseeker', true, 'Ville Hämäläinen', 'ida.salminen@tampere.fi', '+358402222229', 'Oulu - Rajakylä', 'cleaning','I am a detail-oriented and hardworking person who takes pride in keeping spaces clean and organized. I am reliable, punctual, and efficient in my work. I enjoy creating a fresh and comfortable environment. I always pay attention to small details.','1-3 years','€15 - €20/hour','I have experience cleaning homes and apartments regularly. My tasks included vacuuming, dusting, and sanitizing surfaces. I am familiar with different cleaning tools and products. I always ensure high standards of cleanliness.','House Cleaning, Surface Cleaning'),
('noora.lehtonen@turku.fi', '$2b$10$UkL5NetbjP3veCzBGS6MYeQD3mX3h7OnLEgTknU.rEEkQpgAqKYki', 'jobseeker', true, 'Noora Lehtonen', 'ville.hamalainen@oulu.fi', '+358402222230', 'Turku - Hirvensalo', 'cleaning','I am responsible, organized, and committed to delivering high-quality cleaning services. I work efficiently and maintain a positive attitude. I am trustworthy and respectful of clients’ spaces. I always aim to exceed expectations.','3-5 years','€25+ /hour','I have worked in residential cleaning for several clients. I handled deep cleaning tasks as well as regular maintenance. I am comfortable following specific instructions and preferences. I ensure that all areas are clean and tidy.','House Cleaning, Surface Cleaning, Deep Cleaning, Laundry'),
('ida.salminen@tampere.fi', '$2b$10$UkL5NetbjP3veCzBGS6MYeQD3mX3h7OnLEgTknU.rEEkQpgAqKYki', 'jobseeker', true, 'Ida Salminen', 'pekka.koskinen@espoo.fi', '+358402222228', 'Tampere - Pyynikki', 'eldercare','I am patient, calm, and understanding when working with elderly people. I believe in treating everyone with respect and kindness. I am dependable and always willing to help. I adapt easily to different needs and situations.','0-1 years','€10 - €15/hour','I have supported elderly individuals in their daily lives, including mobility and routine care. I provided companionship and ensured their comfort and safety. I am experienced in handling different care needs. I also communicate regularly with families when needed.','Elder companionship, Meal prepration,Mobility assistance'),
('pekka.koskinen@espoo.fi', '$2b$10$UkL5NetbjP3veCzBGS6MYeQD3mX3h7OnLEgTknU.rEEkQpgAqKYki', 'jobseeker', true, 'Pekka Koskinen', 'sara.heikkinen@helsinki.fi', '+358402222227', 'Espoo - Matinkylä', 'eldercare','I am empathetic, respectful, and dedicated to providing quality care. I enjoy listening and building trust with elderly clients. I am organized and attentive to detail. I take pride in being reliable and supportive.','3-5 years','€25+ /hour','I have experience helping elderly clients with personal care and daily tasks. I assisted with meals, light housekeeping, and medication reminders. I am comfortable working independently and following care plans. I also focus on maintaining a positive and safe environment.','Elder companionship, Meal prepration'),
('sara.heikkinen@helsinki.fi', '$2b$10$UkL5NetbjP3veCzBGS6MYeQD3mX3h7OnLEgTknU.rEEkQpgAqKYki', 'jobseeker', true, 'Sara Heikkinen', 'jani.lahtinen@turku.fi', '+358402222226', 'Helsinki - Lauttasaari', 'eldercare','I am a caring and dependable person with a strong sense of responsibility. I enjoy helping others and making a positive difference in their daily lives. I am patient and understanding, especially in challenging situations. I always aim to create a comfortable environment.','1-3 years','€15 - €20/hour','I have worked with elderly individuals in home care settings. My responsibilities included assisting with daily routines and providing companionship. I am experienced in monitoring well-being and responding to needs quickly. I also maintain a clean and safe living space.','Meal prepration, Mobility assistance, Medication management'),
('jani.lahtinen@turku.fi', '$2b$10$UkL5NetbjP3veCzBGS6MYeQD3mX3h7OnLEgTknU.rEEkQpgAqKYki', 'jobseeker', true, 'Jani Lahtinen', 'anni.niemi@oulu.fi', '+358402222225', 'Turku - Nummi', 'eldercare','I am a compassionate and patient caregiver who enjoys helping elderly people. I value respect, dignity, and kindness in every interaction. I am calm, reliable, and attentive to individual needs. I also communicate clearly and respectfully.','0-1 years','€10 - €15/hour','I have experience assisting elderly clients with daily activities such as meal preparation and mobility support. I am comfortable providing companionship and emotional support. I understand the importance of routine and consistency. I have worked with both independent and assisted individuals.','Meal prepration, Mobility assistance, Medication management'),
('anni.niemi@oulu.fi', '$2b$10$UkL5NetbjP3veCzBGS6MYeQD3mX3h7OnLEgTknU.rEEkQpgAqKYki', 'jobseeker', true, 'Anni Niemi', 'anni.niemi@oulu.fi', '+358402222224', 'Oulu - Linnanmaa', 'childcare','I am kind, attentive, and enjoy building meaningful connections with children. I am calm under pressure and can handle unexpected situations well. I believe in creating a supportive and nurturing environment. I am also very reliable and detail-oriented.','3-5 years','€20 - €25/hour','I have experience working with young children in home settings. My duties included feeding, playing, and ensuring a safe environment. I am familiar with daily childcare routines and responsibilities. I also communicate regularly with parents to provide updates.','Babysitting,Child supervision, Homework assistance, Playtime activities'),
('teemu.makinen@tampere.fi', '$2b$10$UkL5NetbjP3veCzBGS6MYeQD3mX3h7OnLEgTknU.rEEkQpgAqKYki', 'jobseeker', true, 'Teemu Mäkinen', 'teemu.makinen@tampere.fi', '+358402222223', 'Tampere - Kaleva', 'childcare','I am a responsible and warm-hearted individual who enjoys helping children develop new skills. I believe in positive communication and encouragement. I am organized and dependable in following daily routines. I take pride in being trustworthy and punctual.','1-3 years','€15 - €20/hour','I have taken care of children in both part-time and full-time roles. I helped with school activities, bedtime routines, and light household tasks. I am experienced in keeping children engaged and active. I also adapt easily to different family needs.','Babysitting, Homework assistance, Playtime activities'),
('laura.korhonen@espoo.fi', '$2b$10$UkL5NetbjP3veCzBGS6MYeQD3mX3h7OnLEgTknU.rEEkQpgAqKYki', 'jobseeker', true, 'Laura Korhonen', 'laura.korhonen@espoo.fi', '+358402222222', 'Espoo - Otaniemi', 'childcare','I am energetic, friendly, and love working with children. I enjoy creative activities like drawing, storytelling, and playing games. I am patient and understand how to handle different behaviors calmly. I always try to build trust with both children and parents.','0-1 years','€10 - €15/hour','I have worked as a babysitter for several families in the past. My responsibilities included supervising playtime, preparing snacks, and maintaining a structured routine. I am experienced in managing multiple children at once. I also have basic knowledge of child safety and first aid.','Meal prepration for kids, Babysitting,Child supervision'),
('mika.virtanen@helsinki.fi', '$2b$10$UkL5NetbjP3veCzBGS6MYeQD3mX3h7OnLEgTknU.rEEkQpgAqKYki', 'jobseeker', true, 'Mika Virtanen', 'mika.virtanen@helsinki.fi', '+358402222221', 'Helsinki - Kamppi','childcare','I am a caring and patient person who genuinely enjoys spending time with children. I value creating a safe and fun environment where kids can learn and grow. I am responsible, reliable, and always attentive to childrens needs. I also communicate well with parents.','0-1 years','€10 - €15/hour','I have experience taking care of children of different ages, from toddlers to school-aged kids. My tasks included preparing meals, organizing activities, and helping with homework. I am comfortable handling daily routines and ensuring safety at all times. I have also worked with families on a regular weekly schedule.','Babysitting,Child supervision')


UPDATE users set  = 'Babysitting, Child supervision' WHERE id=17;
UPDATE users SET services = 'eldercare' WHERE id IN(22,23,24,25);

INSERT INTO jobposts 
(client_id, service_type, service_title, service_description, service_schedule, service_frequency, service_location, service_pay_rate)
VALUES

(1, 'childcare', 'Babysitter needed for 2 kids',
'We are looking for a responsible babysitter to take care of our two children in the evenings. Duties include preparing simple meals, helping with homework, and ensuring a safe environment. The ideal candidate should be patient and friendly. Previous experience with children is preferred.',
'Mon-Fri 17:00-21:00', 'regular', 'Helsinki - Lauttasaari', '€15/hour'),

(2, 'cleaning', 'Apartment cleaning service',
'We need a reliable cleaner for our 2-bedroom apartment. Tasks include vacuuming, mopping floors, and cleaning the kitchen and bathroom. Attention to detail is important. Cleaning supplies will be provided.',
'Saturday morning', 'regular', 'Espoo - Otaniemi', '€18/hour'),

(3, 'eldercare', 'Elderly assistance required',
'Seeking a caregiver to assist an elderly family member with daily activities. Responsibilities include light meal preparation, medication reminders, and companionship. The candidate should be kind and attentive. Experience in elderly care is a plus.',
'Daily 10:00-14:00', 'regular', 'Tampere - Kaleva', '€20/hour'),

(4, 'cleaning', 'House cleaning',
'Looking for someone to help with general house cleaning tasks. This includes dusting, vacuuming, and maintaining cleanliness in all rooms. The person should be punctual and organized. Prior cleaning experience is preferred.',
'Wed & Sun', 'regular', 'Oulu - Linnanmaa', '€17/hour'),

(5, 'childcare', 'Weekend babysitter',
'We need a babysitter during weekends for our child. Duties include playing, feeding, and putting the child to bed. The candidate should be energetic and caring. Experience with young children is required.',
'Weekend evenings', 'occasional', 'Turku - Hirvensalo', '€14/hour'),

(7, 'eldercare', 'Senior companion',
'Looking for a friendly companion for an elderly person. Responsibilities include conversation, light assistance, and ensuring comfort. The role is more about companionship than medical care. A warm personality is essential.',
'Mon-Wed mornings', 'regular', 'Espoo - Otaniemi', '€19/hour'),

(8, 'cleaning', 'Office cleaning',
'We require a cleaner for a small office space. Tasks include cleaning desks, floors, and restrooms. The work should be done efficiently and with attention to detail. Evening availability is preferred.',
'Friday night', 'regular', 'Tampere - Kaleva', '€20/hour'),

(9, 'childcare', 'After school babysitter',
'Looking for someone to pick up children from school and take care of them until parents return. Duties include preparing snacks and supervising activities. The candidate should be responsible and punctual. A driver license is a plus.',
'Mon-Fri 15:00-18:00', 'regular', 'Oulu - Rajakylä', '€16/hour'),

(10, 'cleaning', 'Deep cleaning service',
'We need a cleaner for monthly deep cleaning of our home. Tasks include detailed cleaning of kitchen appliances, bathrooms, and floors. The candidate should be thorough and experienced. Equipment can be provided if needed.',
'Once a month', 'occasional', 'Turku - Nummi', '€25/hour'),

(21, 'childcare', 'Evening babysitting',
'Looking for an occasional babysitter in the evenings. Responsibilities include supervising the child, preparing light meals, and bedtime routines. The candidate should be trustworthy and caring. Flexible availability is preferred.',
'Flexible evenings', 'occasional', 'Helsinki - Kallio', '€15/hour'),

(6, 'childcare', 'Full-time nanny',
'We are searching for a full-time nanny for our toddler. Duties include feeding, playing, and maintaining daily routines. The nanny should be experienced and patient. Long-term commitment is preferred.',
'Mon-Fri 09:00-17:00', 'regular', 'New York, NY', '$20/hour'),

(1, 'cleaning', 'Kitchen cleaning',
'Need help with deep cleaning the kitchen area. Tasks include cleaning appliances, cabinets, and surfaces. The cleaner should be detail-oriented. Experience with kitchen cleaning is a plus.',
'Sunday afternoon', 'occasional', 'Helsinki - Lauttasaari', '€22/hour'),

(2, 'childcare', 'Babysitter for toddler',
'Looking for someone to take care of a 2-year-old child. Duties include feeding, playing, and ensuring safety. The candidate should have experience with toddlers. Patience and kindness are important.',
'Weekdays', 'regular', 'Espoo - Otaniemi', '€16/hour'),

(3, 'cleaning', 'Move-out cleaning',
'We need a cleaner for a move-out cleaning service. Tasks include full cleaning of all rooms, including kitchen and bathroom. The work should be thorough and efficient. Prior experience is required.',
'One-time', 'occasional', 'Tampere - Kaleva', '€30/hour'),

(4, 'eldercare', 'Home support for elderly',
'Looking for someone to assist an elderly person at home. Responsibilities include meal preparation, medication reminders, and light cleaning. The candidate should be caring and dependable. Experience is preferred.',
'Daily mornings', 'regular', 'Oulu - Linnanmaa', '€21/hour'),

(5, 'cleaning', 'Bathroom cleaning',
'Need a cleaner to maintain bathroom cleanliness weekly. Tasks include scrubbing, disinfecting, and organizing. The person should be detail-oriented. Cleaning supplies will be provided.',
'Saturday', 'regular', 'Turku - Hirvensalo', '€18/hour'),

(7, 'childcare', 'Part-time babysitter',
'Looking for a part-time babysitter for afternoons. Duties include supervising children and preparing snacks. The candidate should be responsible and energetic. Experience is preferred.',
'Afternoons', 'regular', 'Espoo - Otaniemi', '€15/hour'),

(8, 'eldercare', 'Elder care visits',
'Seeking someone to visit and assist an elderly person regularly. Tasks include checking health condition and providing companionship. The candidate should be reliable and kind. Experience is a plus.',
'3 times/week', 'regular', 'Tampere - Kaleva', '€20/hour'),

(9, 'cleaning', 'Housekeeping service',
'Looking for help with general housekeeping tasks. Duties include cleaning, organizing, and maintaining the home. The candidate should be efficient and trustworthy. Regular schedule preferred.',
'Twice a week', 'regular', 'Oulu - Rajakylä', '€19/hour'),

(10, 'childcare', 'Night babysitter',
'We need a babysitter for occasional overnight care. Responsibilities include ensuring the child sleeps safely and attending to any needs during the night. The candidate should be calm and reliable. Prior experience is important.',
'Occasional nights', 'occasional', 'Turku - Nummi', '€18/hour');

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