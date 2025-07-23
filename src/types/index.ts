export interface Team {
  id: string
  name: string
  sport: string
  league: string
  logo_url?: string
  created_at: string
}

export interface Match {
  id: string
  team1_id: string
  team2_id: string
  team1: Team
  team2: Team
  match_date: string
  status: 'upcoming' | 'live' | 'completed'
  team1_score?: number
  team2_score?: number
  league: string
  tournament?: string
  created_at: string
}

export interface UserTeam {
  id: string
  user_id: string
  team_id: string
  team: Team
  created_at: string
}

export type Sport = 'valorant' | 'lol' | 'nba' | 'soccer' | 'csgo' | 'dota2'

export interface League {
  id: string
  name: string
  sport: Sport
  region?: string
}