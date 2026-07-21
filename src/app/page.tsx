import Link from 'next/link';
import { Radio, Monitor, Smartphone, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-12 p-8 bg-surface">
      {/* Hero */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-2xl shadow-brand-500/30 mb-6">
          <Radio className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
          PasaLaLetra
        </h1>
        <p className="text-white/40 text-base max-w-md mx-auto">
          Software de presentaciones para iglesias. Edita, presenta y controla en tiempo real.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl w-full">
        <Link
          href="/editor"
          className="glass-card group p-6 flex flex-col items-center gap-4 text-center"
        >
          <div className="w-12 h-12 rounded-xl bg-brand-600/20 flex items-center justify-center group-hover:bg-brand-600/30 transition-colors">
            <Radio className="w-5 h-5 text-brand-400" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white mb-1">Editor</h2>
            <p className="text-xs text-white/40">Crea y organiza slides</p>
          </div>
          <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-brand-400 group-hover:translate-x-1 transition-all" />
        </Link>

        <Link
          href="/present/demo"
          className="glass-card group p-6 flex flex-col items-center gap-4 text-center"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-600/20 flex items-center justify-center group-hover:bg-emerald-600/30 transition-colors">
            <Monitor className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white mb-1">Presentador</h2>
            <p className="text-xs text-white/40">Pantalla del proyector</p>
          </div>
          <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
        </Link>

        <Link
          href="/remote/demo"
          className="glass-card group p-6 flex flex-col items-center gap-4 text-center"
        >
          <div className="w-12 h-12 rounded-xl bg-purple-600/20 flex items-center justify-center group-hover:bg-purple-600/30 transition-colors">
            <Smartphone className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white mb-1">Control Remoto</h2>
            <p className="text-xs text-white/40">iPad / Movil</p>
          </div>
          <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
        </Link>
      </div>

      {/* Footer hint */}
      <p className="text-[0.65rem] text-white/20">
        Todas las vistas se sincronizan en tiempo real
      </p>
    </main>
  );
}
