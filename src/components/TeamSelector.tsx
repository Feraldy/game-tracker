import { useState, useEffect } from 'react'
import { Search, X, Plus } from 'lucide-react'
import { supabase } from '../lib/supabase'
import type { Team } from '../types'

interface TeamSelectorProps {
  selectedTeams: Team[]
  onTeamSelect: (team: Team) => void
  onTeamRemove: (teamId: string) => void
}

const TeamSelector = ({ selectedTeams, onTeamSelect, onTeamRemove }: TeamSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [availableTeams, setAvailableTeams] = useState<Team[]>([])
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedSport, setSelectedSport] = useState<string>('all')

  useEffect(() => {
    loadTeams()
  }, [])

  useEffect(() => {
    filterTeams()
  }, [searchTerm, availableTeams, selectedSport, selectedTeams])

  const loadTeams = async () => {
    try {
      const { data: teams } = await supabase
        .from('teams')
        .select('*')
        .order('name')

      if (teams) {
        setAvailableTeams(teams)
      }
    } catch (error) {
      console.error('Error loading teams:', error)
    }
  }

  const filterTeams = () => {
    let filtered = availableTeams.filter(team => 
      !selectedTeams.some(selected => selected.id === team.id)
    )

    if (selectedSport !== 'all') {
      filtered = filtered.filter(team => team.sport === selectedSport)
    }

    if (searchTerm) {
      filtered = filtered.filter(team =>
        team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.league.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredTeams(filtered)
  }

  const handleTeamSelect = async (team: Team) => {
    try {
      await supabase
        .from('user_teams')
        .insert({
          user_id: 'temp-user-id', // In a real app, this would be the authenticated user's ID
          team_id: team.id
        })

      onTeamSelect(team)
      setSearchTerm('')
      setShowDropdown(false)
    } catch (error) {
      console.error('Error adding team:', error)
    }
  }

  const handleTeamRemove = async (teamId: string) => {
    try {
      await supabase
        .from('user_teams')
        .delete()
        .eq('team_id', teamId)
        .eq('user_id', 'temp-user-id')

      onTeamRemove(teamId)
    } catch (error) {
      console.error('Error removing team:', error)
    }
  }

  const sports = ['all', 'valorant', 'lol', 'nba', 'soccer', 'csgo']

  return (
    <div className="team-selector">
      <h2>Your Teams</h2>
      
      <div className="selected-teams">
        {selectedTeams.map(team => (
          <div key={team.id} className="selected-team">
            <span className="team-info">
              <strong>{team.name}</strong>
              <small>{team.sport.toUpperCase()} - {team.league}</small>
            </span>
            <button 
              onClick={() => handleTeamRemove(team.id)}
              className="remove-btn"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      <div className="add-team-section">
        <div className="search-controls">
          <select 
            value={selectedSport} 
            onChange={(e) => setSelectedSport(e.target.value)}
            className="sport-filter"
          >
            {sports.map(sport => (
              <option key={sport} value={sport}>
                {sport === 'all' ? 'All Sports' : sport.toUpperCase()}
              </option>
            ))}
          </select>

          <div className="search-input-container">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Search teams..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setShowDropdown(true)}
              className="search-input"
            />
          </div>
        </div>

        {showDropdown && (searchTerm || selectedSport !== 'all') && (
          <div className="teams-dropdown">
            {filteredTeams.length > 0 ? (
              filteredTeams.slice(0, 10).map(team => (
                <div
                  key={team.id}
                  className="team-option"
                  onClick={() => handleTeamSelect(team)}
                >
                  <div className="team-details">
                    <strong>{team.name}</strong>
                    <small>{team.sport.toUpperCase()} - {team.league}</small>
                  </div>
                  <Plus size={16} />
                </div>
              ))
            ) : (
              <div className="no-teams">No teams found</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default TeamSelector