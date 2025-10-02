-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_rankings ENABLE ROW LEVEL SECURITY;
ALTER TABLE stickers ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stickers ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can view all users" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for teams
CREATE POLICY "Anyone can view teams" ON teams FOR SELECT USING (true);
CREATE POLICY "Team leaders can update their teams" ON teams FOR UPDATE USING (auth.uid() = leader_id);
CREATE POLICY "Authenticated users can create teams" ON teams FOR INSERT WITH CHECK (auth.uid() = leader_id);

-- RLS Policies for team_members
CREATE POLICY "Anyone can view team members" ON team_members FOR SELECT USING (true);
CREATE POLICY "Team leaders can manage members" ON team_members FOR ALL USING (
  EXISTS (SELECT 1 FROM teams WHERE teams.id = team_members.team_id AND teams.leader_id = auth.uid())
);
CREATE POLICY "Users can join teams" ON team_members FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for tournaments
CREATE POLICY "Anyone can view tournaments" ON tournaments FOR SELECT USING (true);
CREATE POLICY "Admins can manage tournaments" ON tournaments FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
);

-- RLS Policies for tests
CREATE POLICY "Anyone can view tests" ON tests FOR SELECT USING (true);
CREATE POLICY "Admins can manage tests" ON tests FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
);

-- RLS Policies for test_questions
CREATE POLICY "Anyone can view test questions" ON test_questions FOR SELECT USING (true);
CREATE POLICY "Admins can manage test questions" ON test_questions FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
);

-- RLS Policies for test_results
CREATE POLICY "Users can view own results" ON test_results FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own results" ON test_results FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all results" ON test_results FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
);

-- RLS Policies for chat messages
CREATE POLICY "Team members can view team chat" ON team_chat_messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM team_members WHERE team_members.team_id = team_chat_messages.team_id AND team_members.user_id = auth.uid())
);
CREATE POLICY "Team members can send messages" ON team_chat_messages FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM team_members WHERE team_members.team_id = team_chat_messages.team_id AND team_members.user_id = auth.uid())
);

CREATE POLICY "Anyone can view live chat" ON live_chat_messages FOR SELECT USING (true);
CREATE POLICY "Authenticated users can send live chat" ON live_chat_messages FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for payment requests
CREATE POLICY "Users can view own payment requests" ON payment_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create payment requests" ON payment_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all payment requests" ON payment_requests FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
);
CREATE POLICY "Admins can update payment requests" ON payment_requests FOR UPDATE USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
);
