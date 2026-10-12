import { useEffect, useMemo, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Star, MapPin, ShieldCheck, Globe, DollarSign, Filter } from 'lucide-react';

function initials(name = '') {
  return name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
}

export default function Coaches() {
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [sport, setSport] = useState('all');
  const [mode, setMode] = useState('all');
  const [sort, setSort] = useState('rating');

  useEffect(() => {
    (async () => {
      try {
        const data = await base44.entities.Coach.list('-rating', 100);
        setCoaches(data || []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  const sports = useMemo(() => ['all', ...Array.from(new Set(coaches.map((c) => c.sport).filter(Boolean)))], [coaches]);

  const filtered = useMemo(() => {
    let list = coaches.filter((c) => {
      const matchQ = !q || (c.name + c.bio + c.city + c.country).toLowerCase().includes(q.toLowerCase());
      const matchSport = sport === 'all' || c.sport === sport;
      const matchMode = mode === 'all' || c.service_mode === mode || c.service_mode === 'both';
      return matchQ && matchSport && matchMode;
    });
    if (sort === 'rating') list = [...list].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    if (sort === 'price_low') list = [...list].sort((a, b) => (a.price_per_session || 0) - (b.price_per_session || 0));
    if (sort === 'price_high') list = [...list].sort((a, b) => (b.price_per_session || 0) - (a.price_per_session || 0));
    return list;
  }, [coaches, q, sport, mode, sort]);

  return (
    <div>
      <div className="bg-navy-gradient text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Badge className="mb-4 bg-gold/15 text-gold border-gold/30"><ShieldCheck className="w-3 h-3 mr-1.5" /> Verified Coaches</Badge>
          <h1 className="font-display text-4xl sm:text-5xl font-bold">Coach Marketplace</h1>
          <p className="mt-3 text-white/75 max-w-2xl">Find elite, federation-verified coaches by sport, location, language, price and availability — online or in person.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filters */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, city or specialty…" className="pl-9" />
          </div>
          <select value={sport} onChange={(e) => setSport(e.target.value)} className="h-10 rounded-md border border-input bg-background px-3 text-sm">
            {sports.map((s) => <option key={s} value={s}>{s === 'all' ? 'All Sports' : s}</option>)}
          </select>
          <select value={mode} onChange={(e) => setMode(e.target.value)} className="h-10 rounded-md border border-input bg-background px-3 text-sm">
            <option value="all">Online &amp; Offline</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
          </select>
        </div>

        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-muted-foreground flex items-center gap-1.5"><Filter className="w-4 h-4" /> {filtered.length} coaches found</p>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="h-9 rounded-md border border-input bg-background px-3 text-sm">
            <option value="rating">Top Rated</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
          </select>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-64 rounded-2xl" />)
          ) : filtered.length === 0 ? (
            <p className="col-span-full text-center text-muted-foreground py-12">No coaches match your filters.</p>
          ) : filtered.map((c) => (
            <Card key={c.id} className="overflow-hidden border-border hover:border-gold/50 hover:shadow-gold transition-all hover:-translate-y-0.5">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full bg-gold-gradient flex items-center justify-center text-navy font-bold text-lg shadow-gold flex-shrink-0">
                    {initials(c.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-semibold text-navy truncate">{c.name}</h3>
                      {c.verified && <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{c.sport}</p>
                    <div className="flex items-center gap-1 mt-1 text-sm">
                      <Star className="w-4 h-4 fill-gold text-gold" />
                      <span className="font-semibold text-navy">{c.rating?.toFixed(1)}</span>
                      <span className="text-muted-foreground">({c.review_count})</span>
                    </div>
                  </div>
                </div>
                {c.bio && <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{c.bio}</p>}
                <div className="mt-4 flex flex-wrap gap-2">
                  {c.specialties?.slice(0, 3).map((s) => <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>)}
                </div>
                <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1 text-muted-foreground"><MapPin className="w-3.5 h-3.5" />{c.city}, {c.country}</span>
                  <span className="flex items-center gap-1 font-semibold text-navy"><DollarSign className="w-3.5 h-3.5 text-gold" />{c.price_per_session}</span>
                </div>
                <div className="mt-3 flex gap-2">
                  <span className="flex-1 text-center text-xs py-2 rounded-lg bg-secondary text-secondary-foreground flex items-center justify-center gap-1"><Globe className="w-3 h-3" />{c.languages?.join(', ')}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
