-- Create user settings table
CREATE TABLE IF NOT EXISTS user_settings (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    path_questions_per_day INTEGER DEFAULT 3 CHECK (path_questions_per_day BETWEEN 1 AND 10),
    review_interval_mode VARCHAR(20) DEFAULT 'standard' CHECK (review_interval_mode IN ('short', 'standard', 'long')),
    -- short: [1], standard: [1, 7], long: [1, 7, 21]
    review_randomized BOOLEAN DEFAULT FALSE,
    path_randomized BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create trigger to update updated_at
CREATE TRIGGER update_user_settings_updated_at
    BEFORE UPDATE ON user_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create default settings for existing users
INSERT INTO user_settings (user_id)
SELECT id FROM users
ON CONFLICT (user_id) DO NOTHING;
