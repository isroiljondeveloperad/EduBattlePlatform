-- Function to increment user points
CREATE OR REPLACE FUNCTION increment_user_points(user_id UUID, points INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE users
  SET total_points = total_points + points,
      updated_at = NOW()
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment team points
CREATE OR REPLACE FUNCTION increment_team_points(team_id UUID, points INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE teams
  SET total_points = total_points + points,
      updated_at = NOW()
  WHERE id = team_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to calculate weekly rankings
CREATE OR REPLACE FUNCTION calculate_weekly_rankings(week_start_date DATE, week_end_date DATE)
RETURNS VOID AS $$
BEGIN
  -- Insert or update weekly rankings
  INSERT INTO weekly_rankings (user_id, week_start, week_end, total_points, rank)
  SELECT 
    tr.user_id,
    week_start_date,
    week_end_date,
    SUM(tr.points_earned) as total_points,
    RANK() OVER (ORDER BY SUM(tr.points_earned) DESC) as rank
  FROM test_results tr
  WHERE tr.completed_at >= week_start_date 
    AND tr.completed_at < week_end_date + INTERVAL '1 day'
  GROUP BY tr.user_id
  ON CONFLICT (user_id, week_start) 
  DO UPDATE SET 
    total_points = EXCLUDED.total_points,
    rank = EXCLUDED.rank;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
