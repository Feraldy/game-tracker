# Game Tracker

A modern web application for tracking your favorite esports and sports teams. Built with React, TypeScript, Vite, and Supabase.

## Features

- **Team Selection**: Search and select your favorite teams from various sports (Valorant, League of Legends, NBA, Soccer, CS:GO)
- **Match Tracking**: View upcoming and past matches for your selected teams
- **Real-time Updates**: Live match status and scores
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Clean, intuitive interface with smooth animations

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Backend**: Supabase (PostgreSQL database, real-time subscriptions)
- **Styling**: CSS3 with modern design patterns
- **Icons**: Lucide React
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd game-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Update `.env` with your Supabase credentials:
```
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### Database Setup

1. Create a new Supabase project
2. Run the SQL schema from `supabase-schema.sql` in your Supabase SQL editor
3. The schema includes sample data for teams, matches, and leagues

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

### Deployment to Vercel

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

## Database Schema

### Tables

- **teams**: Store team information (name, sport, league, logo)
- **matches**: Store match data (teams, date, scores, status)
- **user_teams**: Store user's favorite teams
- **leagues**: Store league/tournament information

### Key Features

- Row Level Security (RLS) enabled
- Real-time subscriptions for live updates
- Optimized queries with proper indexing

## Usage

1. **Select Teams**: Use the search interface to find and add your favorite teams
2. **View Matches**: See upcoming and past matches for your selected teams
3. **Track Results**: Monitor live scores and match outcomes
4. **Manage Teams**: Add or remove teams from your favorites anytime

## Supported Sports

- **Esports**: Valorant, League of Legends, CS:GO, Dota 2
- **Traditional Sports**: NBA, Soccer/Football

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details
