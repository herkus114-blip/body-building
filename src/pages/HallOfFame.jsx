import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Award, Medal, Trophy, Star } from 'lucide-react';

export default function HallOfFame() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await base44.entities.HallOfFame.list('-year', 100);
        setEntries(data || []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  return (
    <div>
      <div className="bg-navy-gradient text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-gold-gradient flex items-center justify-center shadow-gold mb-5">
            <Trophy className="w-8 h-8 text-navy" />
          </div>
          <Badge className="mb-4 bg-gold/15 text-gold border-gold/30"><Star className="w-3 h-3 mr-1.5" /> Legends of the Sport</Badge>
          <h1 className="font-display text-4xl sm:text-6xl font-bold">Hall of Fame</h1>
          <p className="mt-4 text-white/75 max-w-2xl mx-auto">Honouring the greatest athletes, coaches and contributors who shaped WFF/WBBF International bodybuilding and fitness.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-72 rounded-2xl" />)}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {entries.map((h) => (
              <Card key={h.id} className="overflow-hidden border-border hover:border-gold/50 hover:shadow-gold transition-all group">
                <div className="relative h-44 bg-navy-gradient flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 50% 30%, rgba(201,162,39,0.5), transparent 60%)' }} />
                  <div className="w-20 h-20 rounded-full bg-gold-gradient flex items-center justify-center text-navy font-display font-bold text-2xl shadow-gold relative z-10">
                    {h.athlete_name.split(' ').map((w) => w[0]).slice(0, 2).join('')}
                  </div>
                  <Badge className="absolute top-3 right-3 bg-gold/20 text-gold border-gold/40"><Medal className="w-3 h-3 mr-1" /> {h.year}</Badge>
                </div>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-display text-xl font-bold text-navy">{h.athlete_name}</h3>
                    <Award className="w-5 h-5 text-gold flex-shrink-0" />
                  </div>
                  <p className="text-sm text-muted-foreground">{h.sport} · {h.country}</p>
                  <p className="mt-3 text-sm text-navy/80 leading-relaxed">{h.achievement}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
