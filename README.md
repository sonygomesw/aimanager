# AI Manager - AI Artist Management Platform

A comprehensive AI-powered platform designed to help music artists, DJs, and content creators manage their careers, grow their audience, and achieve their goals through TikTok virality and strategic planning.

## 🎯 Overview

AI Manager is built on proven strategies from successful artists like Hugel, Peggy Gou, and Keinemusik. The platform provides personalized career management, content strategy, and growth planning through an intelligent AI system that remembers everything about the artist and provides actionable advice.

## ✨ Key Features

### 🤖 AI Manager Chat
- **Conversational AI**: Chat with your personal AI manager that remembers your goals, preferences, and history
- **Memory System**: The AI stores and recalls important decisions, milestones, and insights
- **Strategic Guidance**: Get actionable advice based on proven music industry strategies

### 📊 Strategic Planning
- **30-Day Plans**: Detailed TikTok content strategies (200 TikToks per track)
- **90-Day Plans**: Booking machine strategy with outreach and reputation building
- **Annual Blueprint**: 12-month career roadmap with quarterly milestones

### 📈 Progress Tracking
- **Streak System**: Daily posting streak tracking to maintain consistency
- **Monthly Progress**: Track releases, TikTok content, and growth metrics
- **Daily Check-ins**: Monitor mood, energy, and daily wins

### 🎨 Branding & Content
- **Facecam vs Faceless**: Choose your content style and get tailored strategies
- **Viral Hooks Generator**: Get 20 viral hooks for your videos
- **Video Ideas**: Generate 30 content ideas adapted to your style
- **Branding Identity**: Complete brand universe with colors, voice, and guidelines

### 🎵 Music Strategy
- **Release Planning**: 1 track per month systematic approach
- **TikTok Funnel**: Convert TikTok views into Spotify streams
- **Spotify Strategy**: Grow from 0 to 100k+ monthly listeners
- **Revenue Roadmap**: Path to €2,000/month minimum

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database (Supabase recommended)
- OpenAI API key

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd aimanager
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```env
# Database (PostgreSQL)
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"

# OpenAI API
OPENAI_API_KEY="sk-..."

# NextAuth (optional for now)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-random-secret-here"

# Supabase (optional)
NEXT_PUBLIC_SUPABASE_URL="https://yourproject.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-public-key"
```

4. **Set up the database**

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma db push

# (Optional) Open Prisma Studio to view database
npx prisma studio
```

5. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
aimanager/
├── app/                          # Next.js 15 app directory
│   ├── api/                      # API routes
│   │   ├── blueprint/            # Career plans API
│   │   ├── branding/             # Branding generation
│   │   ├── calendar-plan/        # 30-day calendar
│   │   ├── chat/                 # AI chat endpoint
│   │   ├── checkin/              # Daily check-ins
│   │   ├── daily-tasks/          # Task management
│   │   ├── generate/             # AI content generation
│   │   ├── memory/               # Memory system
│   │   ├── monthly-progress/     # Progress tracking
│   │   ├── profile/              # Artist profiles
│   │   ├── streak/               # Streak tracking
│   │   └── tasks/                # Task management
│   ├── app/                      # Application pages
│   │   ├── blueprint/            # Career blueprint view
│   │   ├── branding/             # Branding management
│   │   ├── calendar/             # Calendar view
│   │   ├── chat/                 # Chat interface
│   │   ├── dashboard/            # Main dashboard
│   │   ├── home/                 # Home page
│   │   ├── revenue/              # Revenue tracking
│   │   └── tasks/                # Task management
│   ├── onboarding/               # Onboarding flow
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Landing/chat page
│   └── globals.css               # Global styles
├── components/                   # React components
│   ├── ui/                       # UI components
│   ├── DailyCheckIn.tsx          # Check-in component
│   ├── Sidebar.tsx               # Navigation sidebar
│   └── StreakDisplay.tsx         # Streak tracker
├── lib/                          # Utilities and libraries
│   ├── aiGenerators.ts           # AI generation functions
│   ├── artistManagerPrompt.ts    # AI prompts and strategies
│   ├── openai.ts                 # OpenAI configuration
│   ├── prisma.ts                 # Prisma client
│   ├── supabase.ts               # Supabase client
│   └── utils.ts                  # Utility functions
├── prisma/
│   └── schema.prisma             # Database schema
└── package.json
```

## 🎯 Core Strategy

### The 7-Step Viral Method
1. Release track on Spotify
2. Create 3 TikTok accounts (rotation to avoid shadowban)
3. Batch 200+ TikToks in 2-3 sessions
4. Post 5-10 TikToks/day across 3 accounts
5. Recycle non-performing TikToks
6. Analyze what works
7. Scale winners

### Content Styles
- **FACECAM**: Personal branding, authenticity, storytelling, human connection
- **FACELESS**: Pure aesthetics, mystery, music-focused, scalable content

### Revenue Goals
- Month 3: €500-1,000/month
- Month 6: €1,000-1,500/month
- Month 9: €2,000+/month (target reached)
- Month 12: €3,000-5,000/month (scaling)

## 🗄️ Database Schema

The application uses PostgreSQL with Prisma ORM. Key models:

- **User**: Authentication and user management
- **ArtistProfile**: Artist information, genre, goals, streak tracking
- **Conversation & Message**: Chat history
- **MonthlyPlan / AnnualPlan**: Generated career plans
- **DailyCheckIn**: Daily mood and progress tracking
- **Memory**: AI memory system for personalization
- **MonthlyProgress**: Track releases, TikToks, metrics
- **CalendarPlan**: 30-day detailed plans
- **Hook & VideoIdea**: Generated content ideas

## 🤖 AI Features

### Models Used
- **GPT-4o**: For chat and complex reasoning
- **GPT-4o-mini**: For content generation and quick tasks

### AI Capabilities
1. **Profile Analysis**: Identifies artist archetype, strengths, and positioning
2. **Strategic Planning**: Generates detailed 30/90/365-day plans
3. **Content Generation**: Creates hooks, video ideas, and strategies
4. **Branding**: Develops complete brand identity
5. **Chat Manager**: Conversational AI that remembers and guides

## 📱 Pages

- `/`: Chat interface with AI Manager
- `/onboarding`: Artist profile setup
- `/app/dashboard`: Main dashboard with quick actions
- `/app/blueprint`: Career plans (30-day, 90-day, 1-year)
- `/app/branding`: Brand identity and guidelines
- `/app/calendar`: 30-day content calendar
- `/app/tasks`: Task management
- `/app/revenue`: Revenue tracking

## 🔐 Authentication

Authentication is currently set up with NextAuth.js infrastructure but uses temporary user IDs. To enable full authentication:

1. Configure NextAuth providers in `app/api/auth/[...nextauth]/route.ts`
2. Update `NEXTAUTH_SECRET` in `.env`
3. Replace `temp-user-id` references with actual user sessions

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms
The app can be deployed to any Node.js hosting platform that supports Next.js 15.

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL (via Prisma)
- **AI**: OpenAI GPT-4o / GPT-4o-mini
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI
- **State Management**: Zustand
- **Animation**: Framer Motion
- **Icons**: Lucide React

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `OPENAI_API_KEY` | OpenAI API key | Yes |
| `NEXTAUTH_URL` | Application URL | No |
| `NEXTAUTH_SECRET` | NextAuth secret key | No |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | No |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase public key | No |

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is private and proprietary.

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Test database connection
npx prisma db pull

# Reset database
npx prisma db push --force-reset
```

### OpenAI API Issues
- Verify your API key is valid
- Check you have sufficient credits
- Ensure you're using the correct model names

### Build Issues
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## 📧 Support

For issues and questions, please open a GitHub issue or contact the development team.

---

Built with ❤️ for artists who want to make it in music.
