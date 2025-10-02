-- Add language columns to tests and questions tables
ALTER TABLE tests
ADD COLUMN IF NOT EXISTS language VARCHAR(10) DEFAULT 'en',
ADD COLUMN IF NOT EXISTS title_uz TEXT,
ADD COLUMN IF NOT EXISTS description_uz TEXT;

ALTER TABLE test_questions
ADD COLUMN IF NOT EXISTS questio```sql file="scripts/05-add-multilanguage-support.sql"
-- Add language columns to tests and questions tables
ALTER TABLE tests
ADD COLUMN IF NOT EXISTS language VARCHAR(10) DEFAULT 'en',
ADD COLUMN IF NOT EXISTS title_uz TEXT,
ADD COLUMN IF NOT EXISTS description_uz TEXT;

ALTER TABLE test_questions
ADD COLUMN IF NOT EXISTS question_uz TEXT,
ADD COLUMN IF NOT EXISTS option_a_uz TEXT,
ADD COLUMN IF NOT EXISTS option_b_uz TEXT,
ADD COLUMN IF NOT EXISTS option_c_uz TEXT,
ADD COLUMN IF NOT EXISTS option_d_uz TEXT;

-- Create index for language filtering
CREATE INDEX IF NOT EXISTS idx_tests_language ON tests(language);

-- Add comment
COMMENT ON COLUMN tests.language IS 'Primary language of the test (en, uz, ru)';
COMMENT ON COLUMN tests.title_uz IS 'Uzbek translation of test title';
COMMENT ON COLUMN tests.description_uz IS 'Uzbek translation of test description';
