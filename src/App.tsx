import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import { Team, Match, UserTeam } from './types'
import TeamSelector from './components/TeamSelector'
import MatchList from './components/MatchList'
import './App.css'

function App() {
  const [selectedTeams, setSelectedTeams] = useState<Team[]>([])
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([])
  const [pastMatches, setPastMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUserTeams()
  }, [])

  useEffect(() => {
    if (selectedTeams.length > 0) {
      loadMatches()
    }
  }, [selectedTeams])

  const loadUserTeams = async () => {
    try {
      const { data: userTeams } = await supabase
        .from('user_teams')
        .select(`
          *,
          team:teams(*)
        `)
      
      if (userTeams) {
        setSelectedTeams(userTeams.map((ut: UserTeam) => ut.team))
      }
    } catch (error) {
      console.error('Error loading user teams:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadMatches = async () => {
    const teamIds = selectedTeams.map(team => team.id)
    
    try {
      const { data: matches } = await supabase
        .from('matches')
        .select(`
          *,
          team1:teams!matches_team1_id_fkey(*),
          team2:teams!matches_team2_id_fkey(*)
        `)
        .or(`team1_id.in.(${teamIds.join(',')}),team2_id.in.(${teamIds.join(',')})`)
        .order('match_date', { ascending: true })

      if (matches) {
        const now = new Date()
        const upcoming = matches.filter(match => new Date(match.match_date) > now)
        const past = matches.filter(match => new Date(match.match_date) <= now)
        
        setUpcomingMatches(upcoming)
        setPastMatches(past.reverse())
      }
    } catch (error) {
      console.error('Error loading matches:', error)
    }
  }

  const handleTeamSelect = (team: Team) => {
    setSelectedTeams(prev => [...prev, team])
  }

  const handleTeamRemove = (teamId: string) => {
    setSelectedTeams(prev => prev.filter(team => team.id !== teamId))
  }

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Game Tracker</h1>
        <p>Track your favorite esports and sports teams</p>
      </header>

      <main className="app-main">
        <TeamSelector 
          selectedTeams={selectedTeams}
          onTeamSelect={handleTeamSelect}
          onTeamRemove={handleTeamRemove}
        />

        {selectedTeams.length > 0 && (
          <div className="matches-container">
            <MatchList 
              title="Upcoming Matches"
              matches={upcomingMatches}
              type="upcoming"
            />
            <MatchList 
              title="Past Matches"
              matches={pastMatches}
              type="past"
            />
          </div>
        )}
      </main>
    </div>
  )
}

export default App
