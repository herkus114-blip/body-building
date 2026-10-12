import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Sparkles, ShieldCheck, Activity, Target, Dumbbell, Apple, FileCheck, Download, AlertCircle } from 'lucide-react';

const sports = ['General Fitness', 'Bodybuilding', 'Men\'s Physique', 'Bikini Model', 'Classic Bodybuilding', 'Wellness', 'Athletic Body'];

export default function AIReport() {
  const [form, setForm] = useState({ gender: 'male', age: '', height: '', weight: '', goals: 'Build muscle and compete', measurements: '', user_name: '', user_email: '' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    const { gender, age, height, weight } = form;
    if (!age || !height || !weight) { setError('Please fill in age, height and weight.'); return; }
    setLoading(true);
    setResult(null);
    try {
      const res = await base44.functions.invoke('generate_ai_report', {
        gender, age: Number(age), height: Number(height), weight: Number(weight),
        goals: form.goals, measurements: form.measurements,
        user_name: form.user_name, user_email: form.user_email,
      });
      const data = res?.data ?? res;
      if (data?.error) throw new Error(data.error);
      setResult(data);
    } catch (err) {
      setError(err.message || 'Could not generate report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = (s) => s >= 80 ? 'text-emerald-600' : s >= 60 ? 'text-gold-dark' : 'text-rose-600';

  return (
    <div className="bg-secondary/30 min-h-screen">
      <div className="bg-navy-gradient text-white py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-4 bg-gold/15 text-gold border-gold/30"><Sparkles className="w-3 h-3 mr-1.5" /> AI Body Analysis</Badge>
          <h1 className="font-display text-4xl sm:text-5xl font-bold">Free AI Body Report &amp; Certificate</h1>
          <p className="mt-4 text-white/75 max-w-2xl mx-auto">Receive your body score, athlete match percentage, training &amp; nutrition guidance, suggested competition category and a downloadable certificate — verified with a unique report ID and QR.</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid lg:grid-cols-2 gap-8">
        {/* Form */}
        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-navy font-display text-2xl">Enter Your Details</CardTitle>
            <CardDescription>Completely free. Your data is private and never shared.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" value={form.user_name} onChange={(e) => set('user_name', e.target.value)} placeholder="Your name" />
                </div>
                <div>
                  <Label htmlFor="email">Email (optional)</Label>
                  <Input id="email" type="email" value={form.user_email} onChange={(e) => set('user_email', e.target.value)} placeholder="you@email.com" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <select id="gender" value={form.gender} onChange={(e) => set('gender', e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input id="age" type="number" min="14" max="100" value={form.age} onChange={(e) => set('age', e.target.value)} placeholder="28" />
                </div>
                <div>
                  <Label htmlFor="goals-select">Goal</Label>
                  <select id="goals-select" value={form.goals} onChange={(e) => set('goals', e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                    {sports.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input id="height" type="number" value={form.height} onChange={(e) => set('height', e.target.value)} placeholder="178" />
                </div>
                <div>
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input id="weight" type="number" value={form.weight} onChange={(e) => set('weight', e.target.value)} placeholder="82" />
                </div>
              </div>
              <div>
                <Label htmlFor="meas">Body measurements (optional)</Label>
                <Textarea id="meas" rows={2} value={form.measurements} onChange={(e) => set('measurements', e.target.value)} placeholder="e.g. Chest 110cm, Waist 82cm, Arms 40cm, Body fat 14%" />
              </div>

              <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 flex gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800 leading-relaxed">AI guidance is educational and motivational, not a medical diagnosis. Consult a physician before starting any program.</p>
              </div>

              {error && <p className="text-sm text-rose-600">{error}</p>}

              <Button type="submit" disabled={loading} className="w-full bg-gold-gradient text-navy hover:opacity-90 h-12 text-base font-semibold">
                {loading ? <><Skeleton className="w-4 h-4 rounded-full mr-2" /> Generating your report…</> : <><Sparkles className="w-5 h-5 mr-2" /> Generate My AI Body Report</>}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Result */}
        <div>
          {!result && !loading && (
            <Card className="border-dashed border-border h-full flex items-center justify-center min-h-[400px]">
              <CardContent className="text-center py-16">
                <div className="w-16 h-16 mx-auto rounded-full bg-gold/10 flex items-center justify-center mb-4">
                  <Activity className="w-8 h-8 text-gold" />
                </div>
                <p className="text-muted-foreground">Your personalized AI body report and certificate will appear here.</p>
              </CardContent>
            </Card>
          )}

          {loading && (
            <div className="space-y-4">
              <Skeleton className="h-40 rounded-2xl" />
              <Skeleton className="h-32 rounded-2xl" />
              <Skeleton className="h-48 rounded-2xl" />
            </div>
          )}

          {result && (
            <div className="space-y-5">
              {/* Scores */}
              <Card className="border-border overflow-hidden">
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 gap-4">
                    <ScoreCard icon={Activity} label="Body Score" value={`${result.body_score}`} suffix="/100" color={scoreColor(result.body_score)} />
                    <ScoreCard icon={Target} label="Athlete Match" value={`${result.athlete_match}`} suffix="%" color={scoreColor(result.athlete_match)} />
                  </div>
                  <div className="mt-5 flex items-center gap-3 rounded-xl bg-navy-gradient text-white p-4">
                    <ShieldCheck className="w-8 h-8 text-gold flex-shrink-0" />
                    <div>
                      <p className="text-xs text-white/60 uppercase tracking-wider">Suggested Category</p>
                      <p className="font-display text-lg font-bold">{result.suggested_category}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Guidance */}
              <div className="grid gap-4">
                <GuidanceCard icon={Dumbbell} title="Training Guidance" text={result.training_guidance} />
                <GuidanceCard icon={Apple} title="Nutrition Guidance" text={result.nutrition_guidance} />
                <GuidanceCard icon={Target} title="Weight Recommendation" text={result.weight_recommendation} />
                <GuidanceCard icon={FileCheck} title="Suggested Program" text={result.suggested_program} />
              </div>

              {/* Certificate */}
              <Card className="border-gold/40 shadow-gold overflow-hidden">
                <div className="bg-gold-gradient h-2" />
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs text-gold font-semibold uppercase tracking-wider">Official Certificate</p>
                      <h3 className="font-display text-2xl font-bold text-navy mt-1">ELITE BODY REPORT</h3>
                      <p className="text-sm text-muted-foreground mt-1">Issued to <span className="font-semibold text-navy">{form.user_name || 'Athlete'}</span></p>
                    </div>
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=110x110&data=EAB-VERIFY-${result.report_id}`} alt="Verification QR" className="w-[110px] h-[110px] rounded-lg" />
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="outline" className="border-gold/40 text-gold">Report ID: {result.report_id}</Badge>
                  </div>
                  <Button onClick={() => window.print()} className="w-full mt-4 bg-navy-gradient text-white hover:opacity-90">
                    <Download className="w-4 h-4 mr-2" /> Download Certificate
                  </Button>
                  <p className="text-[11px] text-muted-foreground text-center mt-3">Verify authenticity via the QR code. Issued by WFF/WBBF International.</p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ScoreCard({ icon: Icon, label, value, suffix, color }) {
  return (
    <div className="rounded-xl border border-border p-4 text-center">
      <Icon className="w-5 h-5 text-gold mx-auto mb-2" />
      <p className="text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
      <p className={`font-display text-3xl font-bold ${color}`}>{value}<span className="text-base text-muted-foreground">{suffix}</span></p>
    </div>
  );
}

function GuidanceCard({ icon: Icon, title, text }) {
  return (
    <Card className="border-border">
      <CardContent className="p-5">
        <div className="flex gap-3">
          <div className="w-9 h-9 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0">
            <Icon className="w-5 h-5 text-gold" />
          </div>
          <div>
            <h4 className="font-semibold text-navy text-sm">{title}</h4>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{text}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
