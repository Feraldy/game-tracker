import { Calendar, Trophy, Clock } from 'lucide-react'
import { Match } from '../types'

interface MatchListProps {
  title: string
  matches: Match[]
  type: 'upcoming' | 'past'
}

const MatchList = ({ title, matches, type }: MatchListProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  }

  const getMatchStatus = (match: Match) => {
    if (match.status === 'completed' && match.team1_score !== null && match.team2_score !== null) {
      return `${match.team1_score} - ${match.team2_score}`
    }
    if (match.status === 'live') {
      return 'LIVE'
    }
    return formatDate(match.match_date).time
  }

  const getWinner = (match: Match) => {
    if (match.status === 'completed' && match.team1_score !== null && match.team2_score !== null) {
      if (match.team1_score > match.team2_score) return 'team1'
      if (match.team2_score > match.team1_score) return 'team2'
    }
    return null
  }

  return (
    <div className="match-list">
      <h3 className="match-list-title">
        {type === 'upcoming' ? <Clock size={20} /> : <Trophy size={20} />}
        {title} ({matches.length})
      </h3>

      {matches.length === 0 ? (
        <div className="no-matches">
          No {type} matches found for your teams
        </div>
      ) : (
        <div className="matches">
          {matches.map(match => {
            const { date, time } = formatDate(match.match_date)
            const winner = getWinner(match)
            
            return (
              <div key={match.id} className={`match-card ${match.status}`}>
                <div className="match-header">
                  <div className="match-date">
                    <Calendar size={16} />
                    <span>{date}</span>
                  </div>
                  <div className="match-league">
                    {match.tournament || match.league}
                  </div>
                </div>

                <div className="match-teams">
                  <div className={`team ${winner === 'team1' ? 'winner' : ''}`}>
                    <span className="team-name">{match.team1.name}</span>
                    <span className="team-league">{match.team1.league}</span>
                  </div>

                  <div className="match-vs">
                    <div className="vs-text">VS</div>
                    <div className={`match-status ${match.status}`}>
                      {getMatchStatus(match)}
                    </div>
                  </div>

                  <div className={`team ${winner === 'team2' ? 'winner' : ''}`}>
                    <span className="team-name">{match.team2.name}</span>
                    <span className="team-league">{match.team2.league}</span>
                  </div>
                </div>

                {match.status === 'live' && (
                  <div className="live-indicator">
                    <div className="live-dot"></div>
                    LIVE
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default MatchList