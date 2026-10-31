-- up migrations

ALTER TABLE books ADD COLUMN shelf VARCHAR(50);

UPDATE books SET shelf = 'Shelf F1' WHERE title = 'The Salt Orchard';
UPDATE books SET shelf = 'Shelf F2' WHERE title = 'Night Ferry';
UPDATE books SET shelf = 'Shelf F3' WHERE title = 'The Cartographer''s Daughter';
UPDATE books SET shelf = 'Shelf F4' WHERE title = 'Small Hours';
UPDATE books SET shelf = 'Shelf N1' WHERE title = 'Fieldwork';
UPDATE books SET shelf = 'Shelf N2' WHERE title = 'The Slow Ocean';
UPDATE books SET shelf = 'Shelf N3' WHERE title = 'Bread, Salt, Time';
UPDATE books SET shelf = 'Shelf N4' WHERE title = 'How Cities Remember';
UPDATE books SET shelf = 'Staff table' WHERE title IN ('Paper Moons', 'The Last Good Cafe', 'Understory', 'Letters to a Young Reader');
