-- Enable RLS for new tables
ALTER TABLE subscription_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_chat_messages ENABLE ROW LEVEL SECURITY;

-- Subscription requests policies
CREATE POLICY "Users can view their own subscription requests"
  ON subscription_requests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create subscription requests"
  ON subscription_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all subscription requests"
  ON subscription_requests FOR SELECT
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can update subscription requests"
  ON subscription_requests FOR UPDATE
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- Tournament policies
CREATE POLICY "Everyone can view active tournaments"
  ON tournaments FOR SELECT
  USING (status IN ('upcoming', 'active'));

CREATE POLICY "Admins can manage tournaments"
  ON tournaments FOR ALL
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- Tournament participants policies
CREATE POLICY "Everyone can view tournament participants"
  ON tournament_participants FOR SELECT
  USING (true);

CREATE POLICY "Users can join tournaments"
  ON tournament_participants FOR INSERT
  WITH CHECK (auth.uid() = participant_id OR 
    EXISTS (SELECT 1 FROM team_members WHERE user_id = auth.uid() AND team_id = participant_id));

-- Team policies
CREATE POLICY "Everyone can view teams"
  ON teams FOR SELECT
  USING (true);

CREATE POLICY "Users can create teams"
  ON teams FOR INSERT
  WITH CHECK (auth.uid() = leader_id);

CREATE POLICY "Team leaders can update their teams"
  ON teams FOR UPDATE
  USING (auth.uid() = leader_id);

CREATE POLICY "Team leaders can delete their teams"
  ON teams FOR DELETE
  USING (auth.uid() = leader_id);

-- Team members policies
CREATE POLICY "Everyone can view team members"
  ON team_members FOR SELECT
  USING (true);

CREATE POLICY "Team leaders can manage members"
  ON team_members FOR ALL
  USING (EXISTS (SELECT 1 FROM teams WHERE id = team_id AND leader_id = auth.uid()));

-- Team invitations policies
CREATE POLICY "Users can view their invitations"
  ON team_invitations FOR SELECT
  USING (auth.uid() = user_id OR 
    EXISTS (SELECT 1 FROM teams WHERE id = team_id AND leader_id = auth.uid()));

CREATE POLICY "Team leaders can create invitations"
  ON team_invitations FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM teams WHERE id = team_id AND leader_id = auth.uid()));

CREATE POLICY "Users can respond to their invitations"
  ON team_invitations FOR UPDATE
  USING (auth.uid() = user_id);

-- Team chat policies
CREATE POLICY "Team members can view team chat"
  ON team_chat_messages FOR SELECT
  USING (EXISTS (SELECT 1 FROM team_members WHERE team_id = team_chat_messages.team_id AND user_id = auth.uid()));

CREATE POLICY "Team members can send messages"
  ON team_chat_messages FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM team_members WHERE team_id = team_chat_messages.team_id AND user_id = auth.uid()) 
    AND auth.uid() = user_id);
