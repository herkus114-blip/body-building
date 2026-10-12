import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Menu, X, Crown } from 'lucide-react';

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'AI Body Report', path: '/ai-report' },
  { label: 'Coaches', path: '/coaches' },
  { label: 'Competitions', path: '/competitions' },
  { label: 'Rankings', path: '/rankings' },
  { label: 'Hall of Fame', path: '/hall-of-fame' },
];

export default function Layout() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-white text-foreground">
      <header className="sticky top-0 z-50 bg-navy-gradient/95 backdrop-blur border-b border-gold/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <Link to="/" className="flex items-center gap-2.5 group" onClick={() => setOpen(false)}>
              <span className="w-9 h-9 rounded-full bg-gold-gradient flex items-center justify-center shadow-gold">
                <Crown className="w-5 h-5 text-navy" strokeWidth={2.5} />
              </span>
              <span className="flex flex-col leading-none">
                <span className="font-display text-base sm:text-lg font-bold tracking-wide text-white">ELITE ART OF THE BODY</span>
                <span className="text-[10px] tracking-[0.25em] text-gold/80 uppercase">WFF / WBBF International</span>
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3.5 py-2 text-sm font-medium rounded-full transition-colors ${
                    pathname === item.path
                      ? 'text-navy bg-gold-gradient'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                to="/ai-report"
                className="ml-2 px-4 py-2 text-sm font-semibold rounded-full border border-gold/50 text-gold hover:bg-gold hover:text-navy transition-colors"
              >
                Get Free Report
              </Link>
            </nav>

            <button
              className="lg:hidden p-2 text-white"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {open && (
          <nav className="lg:hidden border-t border-white/10 bg-navy-dark px-4 py-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setOpen(false)}
                className={`block px-4 py-3 text-sm font-medium rounded-lg ${
                  pathname === item.path ? 'text-navy bg-gold-gradient' : 'text-white/85 hover:bg-white/10'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-navy-gradient text-white/70 border-t border-gold/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="w-8 h-8 rounded-full bg-gold-gradient flex items-center justify-center">
                <Crown className="w-4 h-4 text-navy" strokeWidth={2.5} />
              </span>
              <span className="font-display font-bold text-white">ELITE ART OF THE BODY</span>
            </div>
            <p className="text-sm leading-relaxed max-w-md">
              The global AI-powered platform connecting athletes, coaches, academies, federations, sponsors and fans.
              Built for WFF/WBBF International under President Edmundas Daubaras, with ELITE ICON GROUP as AI &amp; technology partner.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-3 uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/ai-report" className="hover:text-gold">AI Body Report</Link></li>
              <li><Link to="/coaches" className="hover:text-gold">Coach Marketplace</Link></li>
              <li><Link to="/competitions" className="hover:text-gold">Competitions</Link></li>
              <li><Link to="/rankings" className="hover:text-gold">Rankings</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-3 uppercase tracking-wider">Organization</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/hall-of-fame" className="hover:text-gold">Hall of Fame</Link></li>
              <li><Link to="/ai-report" className="hover:text-gold">Athlete Passport</Link></li>
              <li><span className="text-white/50">Privacy &amp; Terms</span></li>
              <li><span className="text-white/50">AI Disclaimer</span></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/50">
            <span>© {new Date().getFullYear()} WFF/WBBF International. All rights reserved.</span>
            <span>AI &amp; Technology Partner: ELITE ICON GROUP</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
