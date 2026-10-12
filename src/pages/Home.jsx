import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Sparkles, Search, Trophy, ShieldCheck, BarChart3, Award,
  Star, MapPin, Calendar, ArrowRight, Users, Globe, Medal, Dumbbell, Crown
} from 'lucide-react';

const actions = [
  { icon: Sparkles, title: 'Free AI Body Report', desc: 'Get your body score, athlete match & certificate', path: '/ai-report', accent: 'from-amber-400 to-yellow-600' },
  { icon: Search, title: 'Find a Coach', desc: 'Browse elite verified coaches worldwide', path: '/coaches', accent: 'from-sky-500 to-blue-700' },
  { icon: Trophy, title: 'Join a Competition', desc: 'Register for World, European & National events', path: '/competitions', accent: 'from-emerald-500 to-green-700' },
  { icon: ShieldCheck, title: 'Activate Athlete Passport', desc: 'Your verified digital athlete identity', path: '/ai-report', accent: 'from-violet-500 to-purple-700' },
  { icon: BarChart3, title: 'View Rankings', desc: 'World, continental & category standings', path: '/rankings', accent: 'from-rose-500 to-red-700' },
  { icon: Award, title: 'Hall of Fame', desc: 'Celebrate the legends of the sport', path: '/hall-of-fame', accent: 'from-amber-500 to-orange-700' },
];

const stats = [
  { icon: Users, value: '120K+', label: 'Athletes' },
  { icon: Globe, value: '94', label: 'Countries' },
  { icon: Dumbbell, value: '8,500+', label: 'Verified Coaches' },
  { icon: Medal, value: '2,400+', label: 'Competitions' },
];

function initials(name = '') {
  return name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
}

export default function Home() {
  const [coaches, setCoaches] = useState([]);
  const [competitions, setCompetitions] = useState([]);
  const [hall, setHall] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [c, comp, h] = await Promise.all([
          base44.entities.Coach.filter({}, '-rating', 4),
          base44.entities.Competition.filter({}, 'date', 4),
          base44.entities.HallOfFame.filter({}, '-year', 3),
        ]);
        setCoaches(c || []);
        setCompetitions(comp || []);
        setHall(h || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy-gradient text-white">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(201,162,39,0.4), transparent 45%), radial-gradient(circle at 80% 60%, rgba(255,255,255,0.08), transparent 40%)' }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="max-w-3xl">
            <Badge className="mb-5 bg-gold/15 text-gold border-gold/30 hover:bg-gold/20">
              <Crown className="w-3 h-3 mr-1.5" /> WFF / WBBF International
            </Badge>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold leading-[1.05] tracking-tight">
              The Global Stage for <span className="text-gradient-gold">Elite Athletes</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-white/75 leading-relaxed max-w-2xl">
              One unified platform connecting athletes, coaches, academies, federations, sponsors and fans —
              powered by AI body analysis, competitive rankings and a verified Athlete Passport.
            </p>
            <div className="mt-9 flex flex-col sm:flex-row gap-3">
              <Link to="/ai-report" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-gold-gradient text-navy font-semibold shadow-gold hover:scale-[1.02] transition-transform">
                <Sparkles className="w-5 h-5" /> Get Your Free AI Body Report
              </Link>
              <Link to="/coaches" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full border border-white/25 text-white font-semibold hover:bg-white/10 transition-colors">
                Explore Coaches <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
        <div className="relative border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div key={s.label} className="flex items-center gap-3">
                <s.icon className="w-7 h-7 text-gold" />
                <div>
                  <div className="text-2xl font-bold font-display">{s.value}</div>
                  <div className="text-xs text-white/60 uppercase tracking-wider">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Priority actions */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-gold font-semibold text-sm uppercase tracking-[0.2em] mb-2">Start Here</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-navy">Your Path to Elite</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {actions.map((a) => (
            <Link key={a.title} to={a.path}>
              <Card className="group h-full overflow-hidden border-border hover:border-gold/50 hover:shadow-gold transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${a.accent} flex items-center justify-center mb-4 shadow-md`}>
                    <a.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg text-navy mb-1.5 flex items-center gap-1.5">
                    {a.title} <ArrowRight className="w-4 h-4 text-gold opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{a.desc}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured coaches */}
      <section className="bg-secondary/50 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="Coach Marketplace" title="Featured Elite Coaches" link="/coaches" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-72 rounded-2xl" />)
            ) : coaches.map((c) => (
              <Card key={c.id} className="overflow-hidden border-border hover:shadow-navy transition-shadow">
                <CardContent className="p-5 text-center">
                  <div className="w-20 h-20 mx-auto rounded-full bg-gold-gradient flex items-center justify-center text-navy font-bold text-xl shadow-gold">
                    {initials(c.name)}
                  </div>
                  {c.verified && <Badge className="mt-3 bg-emerald-50 text-emerald-700 border-emerald-200"><ShieldCheck className="w-3 h-3 mr-1" /> Verified</Badge>}
                  <h3 className="mt-2 font-semibold text-navy">{c.name}</h3>
                  <p className="text-sm text-muted-foreground">{c.sport}</p>
                  <div className="mt-2 flex items-center justify-center gap-1 text-sm">
                    <Star className="w-4 h-4 fill-gold text-gold" />
                    <span className="font-semibold">{c.rating?.toFixed(1)}</span>
                    <span className="text-muted-foreground">({c.review_count})</span>
                  </div>
                  <div className="mt-2 flex items-center justify-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{c.country}</span>
                    <span>€{c.price_per_session}/session</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming competitions */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <SectionHeader eyebrow="Competitions" title="Upcoming Events" link="/competitions" />
        <div className="grid md:grid-cols-2 gap-5">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-40 rounded-2xl" />)
          ) : competitions.map((ev) => (
            <Card key={ev.id} className="overflow-hidden border-border hover:border-gold/50 hover:shadow-gold transition-all">
              <CardContent className="p-6 flex items-center gap-5">
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-navy-gradient flex flex-col items-center justify-center text-white">
                  <Calendar className="w-5 h-5 text-gold" />
                  <span className="text-xs font-semibold mt-1">{ev.date ? new Date(ev.date).toLocaleDateString('en', { month: 'short' }) : ''}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <Badge variant="outline" className="mb-1 border-gold/40 text-gold">{ev.type}</Badge>
                  <h3 className="font-semibold text-navy truncate">{ev.name}</h3>
                  <p className="text-sm text-muted-foreground truncate">{ev.location} · {ev.country}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gold flex-shrink-0" />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Hall of Fame preview */}
      <section className="bg-navy-gradient text-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-gold font-semibold text-sm uppercase tracking-[0.2em] mb-2">Legends</p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold">Hall of Fame</h2>
            </div>
            <Link to="/hall-of-fame" className="hidden sm:inline-flex items-center gap-1.5 text-gold text-sm font-semibold hover:gap-2.5 transition-all">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-44 rounded-2xl bg-white/5 animate-pulse" />)
            ) : hall.map((h) => (
              <div key={h.id} className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6">
                <Medal className="w-8 h-8 text-gold mb-3" />
                <h3 className="font-display text-xl font-bold">{h.athlete_name}</h3>
                <p className="text-sm text-white/60">{h.sport} · {h.country}</p>
                <p className="mt-3 text-sm text-gold/90">{h.achievement}</p>
                <p className="mt-2 text-xs text-white/40">{h.year}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="font-display text-3xl sm:text-5xl font-bold text-navy max-w-3xl mx-auto leading-tight">
          Begin your journey to the <span className="text-gradient-gold">elite stage</span>.
        </h2>
        <p className="mt-5 text-muted-foreground max-w-xl mx-auto">
          Join 120,000+ athletes worldwide. Your free AI body report is one click away.
        </p>
        <Link to="/ai-report" className="mt-8 inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gold-gradient text-navy font-semibold shadow-gold hover:scale-[1.02] transition-transform">
          <Sparkles className="w-5 h-5" /> Get My Free Report
        </Link>
      </section>
    </div>
  );
}

function SectionHeader({ eyebrow, title, link }) {
  return (
    <div className="flex items-end justify-between mb-10">
      <div>
        <p className="text-gold font-semibold text-sm uppercase tracking-[0.2em] mb-2">{eyebrow}</p>
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-navy">{title}</h2>
      </div>
      <Link to={link} className="hidden sm:inline-flex items-center gap-1.5 text-navy text-sm font-semibold hover:gap-2.5 hover:text-gold transition-all">
        View All <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
