-- Removed example users, only keeping stickers
-- Insert default stickers for weekly rankings
INSERT INTO stickers (name, description, image_url, rank_requirement) VALUES
('🥇 Birinchi o''rin', 'Haftalik reytingda 1-o''rin', '/stickers/gold.png', 1),
('🥈 Ikkinchi o''rin', 'Haftalik reytingda 2-o''rin', '/stickers/silver.png', 2),
('🥉 Uchinchi o''rin', 'Haftalik reytingda 3-o''rin', '/stickers/bronze.png', 3)
ON CONFLICT DO NOTHING;
