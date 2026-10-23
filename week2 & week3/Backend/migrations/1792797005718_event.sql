CREATE TABLE events (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
title VARCHAR(255) NOT NULL,
month VARCHAR(255) NOT NULL,
day INT NOT NULL,
weekday VARCHAR(255) NOT NULL,
time VARCHAR(255) NOT NULL,
category VARCHAR(255) NOT NULL,
description VARCHAR(255) NOT NULL,
button_text VARCHAR(255) NOT NULL
);


INSERT INTO events (
  title, month, day, weekday, time, category, description, button_text) 
  VALUES ( 'An evening with Mara Ellison', 'Oct', 24, 'Thursday', '7:00 pm', 'Event', 'Mara reads from The Salt Orchard and talks about writing fiction on the coast.', 'Save a seat' ),
  (
  'Fiction book club',
  'Oct',
  15,
  'Saturday',
  '4:00 pm',
  'Book club',
  'This month: Night Ferry. Tea, snacks and honest opinions are all welcome.',
  'Join the club'
),
(
  'Nonfiction circle',
  'Nov',
  13,
  'Wednesday',
  '6:30 pm',
  'Event',
  'We read Fieldwork and compare notes. No homework if the week got away from you.',
  'Join the circle'
);
