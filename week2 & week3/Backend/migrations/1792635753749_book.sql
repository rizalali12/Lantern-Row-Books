
CREATE TABLE books (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
 author VARCHAR(255) NOT NULL,
category VARCHAR(30) NOT NULL CHECK ( category IN ('fiction', 'nonfiction', 'staff_picks') ),
image TEXT NOT NULL,
alt TEXT NOT NULL,
price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
button_text VARCHAR(50) NOT NULL DEFAULT 'Add to bag',
created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

UNIQUE (title, author)
); 


INSERT INTO books
    (title, author, category, image, alt, price, button_text)
VALUES
    ('The Salt Orchard', 'Mara Ellison', 'fiction',
     'image/c01-salt-orchard.webp',
     'Cover of The Salt Orchard by Mara Ellison: cream and sage circles like trees on a deep green background',
     18, 'Add to bag'),

    ('Night Ferry', 'Tomas Reyes', 'fiction',
     'image/c02-night-ferry.webp',
     'Cover of Night Ferry by Tomas Reyes: a pale moon above golden waves on a navy background',
     19, 'Add to bag'),

    ('The Cartographer''s Daughter', 'Ines Valdar', 'fiction',
     'image/c03-cartographer.webp',
     'Cover of The Cartographer''s Daughter by Ines Valdar: a dotted route across a gridded map on a mustard yellow background',
     17, 'Add to bag'),

    ('Small Hours', 'Priya Anand', 'fiction',
     'image/c04-small-hours.webp',
     'Cover of Small Hours by Priya Anand: a golden half sun above horizontal lines on a brick red background',
     16, 'Add to bag'),

    ('Fieldwork', 'Hana Okafor', 'nonfiction',
     'image/c05-fieldwork.webp',
     'Cover of Fieldwork by Hana Okafor: a grid of green squares in varying shades on a pale sage background',
     22, 'Add to bag'),

    ('The Slow Ocean', 'Jonas Brandt', 'nonfiction',
     'image/c06-slow-ocean.webp',
     'Cover of The Slow Ocean by Jonas Brandt: stacked bands of blue like ocean layers under a small yellow sun',
     29, 'Add to bag'),

    ('Bread, Salt, Time', 'Lucia Ferrante', 'nonfiction',
     'image/c07-bread-salt-time.webp',
     'Cover of Bread, Salt, Time by Lucia Ferrante: a round golden loaf with scoring marks on a cream background',
     20, 'Add to bag'),

    ('How Cities Remember', 'A. Winters', 'nonfiction',
     'image/c08-cities-remember.webp',
     'Cover of How Cities Remember by A. Winters: grey city buildings with lit yellow windows on a charcoal background',
     26, 'Add to bag'),

    ('Paper Moons', 'Elio Marchetti', 'staff_picks',
     'image/c09-paper-moons.webp',
     'Cover of Paper Moons by Elio Marchetti: a cream crescent moon and small stars on a deep purple background',
     30, 'Add to bag'),

    ('The Last Good Cafe', 'Wren Adair', 'staff_picks',
     'image/c10-last-good-cafe.webp',
     'Cover of The Last Good Cafe by Wren Adair: a steaming maroon coffee cup on a pink background',
     19, 'Add to bag'),

    ('Understory', 'Kofi Mensah', 'staff_picks',
     'image/c11-understory.webp',
     'Cover of Understory by Kofi Mensah: overlapping green leaves on a dark forest green background',
     17, 'Add to bag'),

    ('Letters to a Young Reader', 'Sam Orolov', 'staff_picks',
     'image/c12-letters.webp',
     'Cover of Letters to a Young Reader by Sam Orolov: a sealed envelope with a red wax seal on a yellow background',
     15, 'Add to bag')

ON CONFLICT (title, author) DO NOTHING;
