-- Alter reports table to support larger photo_url (Base64 encoded images)
ALTER TABLE reports MODIFY COLUMN photo_url LONGTEXT;
