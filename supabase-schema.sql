-- Create teams table
CREATE TABLE teams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  sport VARCHAR(50) NOT NULL,
  league VARCHAR(255) NOT NULL,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create matches table
CREATE TABLE matches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team1_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  team2_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  match_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status VARCHAR(20) DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'live', 'completed')),
  team1_score INTEGER,
  team2_score INTEGER,
  league VARCHAR(255) NOT NULL,
  tournament VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_teams table (for user's favorite teams)
CREATE TABLE user_teams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, team_id)
);

-- Create leagues table
CREATE TABLE leagues (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  sport VARCHAR(50) NOT NULL,
  region VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample teams
INSERT INTO teams (name, sport, league, logo_url) VALUES
('Paper Rex', 'valorant', 'VCT Pacific', null),
('T1', 'lol', 'LCK', null),
('T1', 'valorant', 'VCT Pacific', null),
('Cleveland Cavaliers', 'nba', 'NBA', null),
('Manchester City', 'soccer', 'Premier League', null),
('FaZe Clan', 'csgo', 'ESL Pro League', null),
('Team Liquid', 'valorant', 'VCT Americas', null),
('G2 Esports', 'lol', 'LEC', null),
('Los Angeles Lakers', 'nba', 'NBA', null),
('Real Madrid', 'soccer', 'La Liga', null);

-- Insert sample leagues
INSERT INTO leagues (name, sport, region) VALUES
('VCT Pacific', 'valorant', 'Asia-Pacific'),
('VCT Americas', 'valorant', 'Americas'),
('VCT EMEA', 'valorant', 'Europe/Middle East/Africa'),
('LCK', 'lol', 'Korea'),
('LCS', 'lol', 'North America'),
('LEC', 'lol', 'Europe'),
('NBA', 'nba', 'North America'),
('Premier League', 'soccer', 'England'),
('La Liga', 'soccer', 'Spain'),
('ESL Pro League', 'csgo', 'Global');

-- Insert sample matches
INSERT INTO matches (team1_id, team2_id, match_date, status, league, tournament) VALUES
((SELECT id FROM teams WHERE name = 'Paper Rex' AND sport = 'valorant'), 
 (SELECT id FROM teams WHERE name = 'T1' AND sport = 'valorant'), 
 NOW() + INTERVAL '2 days', 'upcoming', 'VCT Pacific', 'VCT Pacific Stage 1'),
((SELECT id FROM teams WHERE name = 'Cleveland Cavaliers'), 
 (SELECT id FROM teams WHERE name = 'Los Angeles Lakers'), 
 NOW() + INTERVAL '1 day', 'upcoming', 'NBA', 'Regular Season'),
((SELECT id FROM teams WHERE name = 'Manchester City'), 
 (SELECT id FROM teams WHERE name = 'Real Madrid'), 
 NOW() - INTERVAL '1 day', 'completed', 'Champions League', 'Champions League'),
((SELECT id FROM teams WHERE name = 'Team Liquid' AND sport = 'valorant'), 
 (SELECT id FROM teams WHERE name = 'FaZe Clan'), 
 NOW() + INTERVAL '3 days', 'upcoming', 'VCT Americas', 'VCT Americas Stage 1');

-- Enable Row Level Security
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE leagues ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Teams are viewable by everyone" ON teams FOR SELECT USING (true);
CREATE POLICY "Matches are viewable by everyone" ON matches FOR SELECT USING (true);
CREATE POLICY "Leagues are viewable by everyone" ON leagues FOR SELECT USING (true);

-- Create policies for user_teams (users can only manage their own teams)
CREATE POLICY "Users can view their own teams" ON user_teams FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own teams" ON user_teams FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own teams" ON user_teams FOR DELETE USING (auth.uid() = user_id);