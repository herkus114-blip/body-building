import { useEffect, useMemo, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Trophy, ShieldCheck, ArrowRight } from 'lucide-react';

const podium = ['bg-gold-gradient text-navy', 'bg-slate-300 text-slate-800', 'bg-amber-700 text-white'];

export default function Rankings() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sport, setSport] = useState('all');

  useEffect(() => {
    (async () => {
      try {
        const data = await base44.entities.Ranking.list('position', 100);
        setRows(data || []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  const sports = useMemo(() => ['all', ...Array.from(new Set(rows.map((r) => r.sport).filter(Boolean)))], [rows]);
  const filtered = useMemo(() => rows.filter((r) => sport === 'all' || r.sport === sport), [rows, sport]);

  return (
    <div>
      <div className="bg-navy-gradient text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Badge className="mb-4 bg-gold/15 text-gold border-gold/30"><Trophy className="w-3 h-3 mr-1.5" /> Global Standings</Badge>
          <h1 className="font-display text-4xl sm:text-5xl font-bold">World Rankings</h1>
          <p className="mt-3 text-white/75 max-w-2xl">Official WFF/WBBF International rankings — world, continental, national, category and season standings.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          {sports.map((s) => (
            <button key={s} onClick={() => setSport(s)} className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${sport === s ? 'bg-gold-gradient text-navy' : 'bg-secondary text-secondary-foreground hover:bg-secondary/70'}`}>
              {s === 'all' ? 'All Sports' : s}
            </button>
          ))}
        </div>

        {/* Podium */}
        {!loading && filtered.length >= 3 && (
          <div className="grid grid-cols-3 gap-3 sm:gap-5 mb-8 items-end">
            {[1, 0, 2].map((idx) => {
              const r = filtered[idx];
              if (!r) return <div key={idx} />;
              const heights = ['h-28', 'h-36', 'h-24'];
              const realIdx = idx;
              return (
                <div key={r.id} className="text-center">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-full bg-gold-gradient flex items-center justify-center text-navy font-bold text-lg shadow-gold mb-2">
                    {r.athlete_name.split(' ').map((w) => w[0]).slice(0, 2).join('')}
                  </div>
                  <p className="font-semibold text-navy text-sm truncate">{r.athlete_name}</p>
                  <p className="text-xs text-muted-foreground">{r.country}</p>
                  <div className={`${podium[realIdx]} ${heights[realIdx === 0 ? 1 : realIdx === 1 ? 0 : 2]} mt-3 rounded-t-xl flex flex-col items-center justify-center`}>
                    <span className="font-display text-2xl font-bold">{realIdx + 1}</span>
                    <span className="text-xs">{r.points} pts</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Table */}
        <Card className="border-border overflow-hidden">
          <div className="bg-navy-gradient text-white grid grid-cols-12 gap-2 px-4 sm:px-6 py-3 text-xs font-semibold uppercase tracking-wider">
            <div className="col-span-1">#</div>
            <div className="col-span-5">Athlete</div>
            <div className="col-span-3 hidden sm:block">Federation</div>
            <div className="col-span-3 sm:col-span-2 text-right">Points</div>
            <div className="col-span-3 sm:col-span-1 text-right">Passport</div>
          </div>
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-14 rounded-none" />)
          ) : (
            <div className="divide-y divide-border">
              {filtered.map((r, i) => (
                <div key={r.id} className="grid grid-cols-12 gap-2 px-4 sm:px-6 py-3.5 items-center hover:bg-secondary/50 transition-colors">
                  <div className="col-span-1">
                    {i < 3 ? <span className={`inline-flex w-7 h-7 items-center justify-center rounded-full text-xs font-bold ${podium[i]}`}>{i + 1}</span>
                           : <span className="text-sm text-muted-foreground font-medium">{i + 1}</span>}
                  </div>
                  <div className="col-span-5 min-w-0">
                    <p className="font-semibold text-navy text-sm truncate">{r.athlete_name}</p>
                    <p className="text-xs text-muted-foreground truncate">{r.country} · {r.sport}</p>
                  </div>
                  <div className="col-span-3 hidden sm:block text-sm text-muted-foreground truncate">{r.federation}</div>
                  <div className="col-span-3 sm:col-span-2 text-right font-semibold text-navy">{r.points?.toLocaleString()}</div>
                  <div className="col-span-3 sm:col-span-1 text-right">
                    <ShieldCheck className="w-4 h-4 text-gold inline" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
