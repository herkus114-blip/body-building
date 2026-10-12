import { useEffect, useMemo, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, MapPin, Users, Trophy, ArrowRight, Filter } from 'lucide-react';

const types = ['all', 'World', 'European', 'Professional', 'National', 'Regional', 'Adaptive'];

const typeColor = {
  World: 'bg-gold/15 text-gold border-gold/40',
  European: 'bg-blue-50 text-blue-700 border-blue-200',
  Professional: 'bg-purple-50 text-purple-700 border-purple-200',
  National: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Regional: 'bg-rose-50 text-rose-700 border-rose-200',
  Adaptive: 'bg-amber-50 text-amber-700 border-amber-200',
};

export default function Competitions() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState('all');

  useEffect(() => {
    (async () => {
      try {
        const data = await base44.entities.Competition.list('date', 100);
        setEvents(data || []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  const filtered = useMemo(() => events.filter((e) => type === 'all' || e.type === type), [events, type]);

  return (
    <div>
      <div className="bg-navy-gradient text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Badge className="mb-4 bg-gold/15 text-gold border-gold/30"><Trophy className="w-3 h-3 mr-1.5" /> Competitions</Badge>
          <h1 className="font-display text-4xl sm:text-5xl font-bold">Competitions &amp; Registration</h1>
          <p className="mt-3 text-white/75 max-w-2xl">World, European, Professional, National, Regional and Adaptive events. Register, upload documents, get your Competition Pass and compete.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          {types.map((t) => (
            <button key={t} onClick={() => setType(t)} className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${type === t ? 'bg-gold-gradient text-navy' : 'bg-secondary text-secondary-foreground hover:bg-secondary/70'}`}>
              {t === 'all' ? 'All Events' : t}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-64 rounded-2xl" />)
          ) : filtered.length === 0 ? (
            <p className="col-span-full text-center text-muted-foreground py-12">No competitions found.</p>
          ) : filtered.map((ev) => (
            <Card key={ev.id} className="overflow-hidden border-border hover:border-gold/50 hover:shadow-navy transition-all flex flex-col">
              <div className="h-28 bg-navy-gradient relative flex items-center justify-center">
                <Trophy className="w-10 h-10 text-gold/40" />
                <Badge className={`absolute top-3 right-3 ${typeColor[ev.type] || typeColor.National}`}>{ev.type}</Badge>
              </div>
              <CardContent className="p-5 flex-1 flex flex-col">
                <h3 className="font-semibold text-navy text-lg leading-tight">{ev.name}</h3>
                <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <p className="flex items-center gap-2"><Calendar className="w-4 h-4 text-gold" />{ev.date ? new Date(ev.date).toLocaleDateString('en', { day: 'numeric', month: 'long', year: 'numeric' }) : 'TBA'}</p>
                  <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-gold" />{ev.location}, {ev.country}</p>
                  <p className="flex items-center gap-2"><Users className="w-4 h-4 text-gold" />{ev.participants_count || 0} athletes registered</p>
                </div>
                {ev.categories?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {ev.categories.slice(0, 4).map((c) => <Badge key={c} variant="secondary" className="text-xs">{c}</Badge>)}
                  </div>
                )}
                <div className="mt-auto pt-4 flex items-center justify-between">
                  <span className="text-sm font-semibold text-navy">{ev.entry_fee ? `€${ev.entry_fee}` : 'Free'}</span>
                  <Button size="sm" className="bg-gold-gradient text-navy hover:opacity-90" disabled={!ev.registration_open}>
                    {ev.registration_open ? 'Register' : 'Closed'} <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
