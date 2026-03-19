/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  User, 
  CloudSun, 
  Newspaper, 
  AlertTriangle, 
  CheckCircle2, 
  MapPin, 
  Bug, 
  Scissors, 
  Droplets,
  Thermometer,
  Wind,
  TrendingUp,
  BrainCircuit,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---

type RiskLevel = 'Safe' | 'Warning' | 'Danger';

interface Zone {
  id: string;
  name: string;
  risk: RiskLevel;
  temp: number;
  humidity: number;
  lastUpdate: string;
}

interface Task {
  id: string;
  zone: string;
  row: string;
  threat: string;
  action: 'Prune' | 'Treatment' | 'Inspect';
  status: 'Pending' | 'Completed';
}

// --- Mock Data ---

const INITIAL_ZONES: Zone[] = [
  { id: 'A', name: 'Zone A', risk: 'Safe', temp: 24, humidity: 65, lastUpdate: '10m ago' },
  { id: 'B', name: 'Zone B', risk: 'Safe', temp: 25, humidity: 62, lastUpdate: '15m ago' },
  { id: 'C', name: 'Zone C', risk: 'Warning', temp: 28, humidity: 45, lastUpdate: '2m ago' },
  { id: 'D', name: 'Zone D', risk: 'Safe', temp: 23, humidity: 68, lastUpdate: '30m ago' },
];

const NEWS_ITEMS = [
  { id: 1, title: 'Leamington Greenhouse Expansion', source: 'AgriNews', time: '2h ago' },
  { id: 2, title: 'New Biological Controls for Thrips', source: 'IPM Weekly', time: '5h ago' },
  { id: 3, title: 'Water Conservation Tech in Essex', source: 'Local Farm', time: '1d ago' },
];

// --- Components ---

const WeatherWidget = () => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-stone-500 font-medium text-sm uppercase tracking-wider">Leamington Weather</h3>
      <CloudSun className="text-amber-500 w-5 h-5" />
    </div>
    <div className="flex items-end gap-4">
      <span className="text-4xl font-bold text-stone-800">24°C</span>
      <div className="flex flex-col text-stone-400 text-sm pb-1">
        <div className="flex items-center gap-1">
          <Thermometer className="w-3 h-3" />
          <span>High: 27°C</span>
        </div>
        <div className="flex items-center gap-1">
          <Wind className="w-3 h-3" />
          <span>NW 12km/h</span>
        </div>
      </div>
    </div>
    <div className="mt-4 pt-4 border-t border-stone-50 flex justify-between text-xs text-stone-400">
      <span>Humidity: 58%</span>
      <span>UV Index: 4 (Mod)</span>
    </div>
    {/* TODO: Insert OpenWeatherMap API Fetch here */}
  </div>
);

const NewsFeed = () => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 h-full">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-stone-500 font-medium text-sm uppercase tracking-wider">AgTech News</h3>
      <Newspaper className="text-emerald-600 w-5 h-5" />
    </div>
    <div className="space-y-4">
      {NEWS_ITEMS.map(item => (
        <div key={item.id} className="group cursor-pointer">
          <p className="text-sm font-medium text-stone-800 group-hover:text-emerald-700 transition-colors line-clamp-2">
            {item.title}
          </p>
          <div className="flex items-center gap-2 mt-1 text-[10px] text-stone-400 uppercase tracking-tighter">
            <span>{item.source}</span>
            <span>•</span>
            <span>{item.time}</span>
          </div>
        </div>
      ))}
    </div>
    {/* TODO: Insert NewsAPI Fetch here */}
  </div>
);

const HeatmapZone: React.FC<{ zone: Zone }> = ({ zone }) => {
  const riskColors = {
    Safe: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    Warning: 'bg-amber-50 border-amber-200 text-amber-700',
    Danger: 'bg-rose-50 border-rose-200 text-rose-700',
  };

  const riskBadge = {
    Safe: 'bg-emerald-500',
    Warning: 'bg-amber-500',
    Danger: 'bg-rose-500',
  };

  return (
    <motion.div 
      layout
      className={`p-5 rounded-2xl border-2 ${riskColors[zone.risk]} transition-all duration-500`}
    >
      <div className="flex justify-between items-start mb-4">
        <span className="font-bold text-lg">{zone.name}</span>
        <div className={`w-3 h-3 rounded-full ${riskBadge[zone.risk]} animate-pulse`} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase opacity-60">Temp</span>
          <span className="font-semibold">{zone.temp}°C</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] uppercase opacity-60">Humidity</span>
          <span className="font-semibold">{zone.humidity}%</span>
        </div>
      </div>
      <div className="mt-4 text-[10px] opacity-40 uppercase font-bold">
        Updated {zone.lastUpdate}
      </div>
    </motion.div>
  );
};

export default function App() {
  const [view, setView] = useState<'Manager' | 'Worker'>('Manager');
  const [zones, setZones] = useState<Zone[]>(INITIAL_ZONES);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isPredicting, setIsPredicting] = useState(false);

  const runPrediction = async () => {
    setIsPredicting(true);
    
    // TODO: Insert Gemini API API_KEY and fetch logic here
    // Simulation of AI processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    setZones(prev => prev.map(z => 
      z.id === 'C' 
        ? { ...z, risk: 'Danger', temp: 31, humidity: 38, lastUpdate: 'Just now' } 
        : z
    ));

    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      zone: 'C',
      row: '12',
      threat: 'Spider Mite',
      action: 'Treatment',
      status: 'Pending'
    };

    setTasks([newTask]);
    setIsPredicting(false);
  };

  const completeTask = (taskId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'Completed' } : t));
    // Reset zone risk after completion for demo purposes
    setZones(prev => prev.map(z => z.id === 'C' ? { ...z, risk: 'Safe', temp: 26, humidity: 60, lastUpdate: 'Just now' } : z));
  };

  const activeTask = tasks.find(t => t.status === 'Pending');

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900">
      {/* Navigation */}
      <nav className="bg-white border-b border-stone-200 px-4 py-3 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-600 p-1.5 rounded-lg">
              <Droplets className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-stone-800">BioShield</span>
          </div>

          <div className="flex bg-stone-100 p-1 rounded-xl">
            <button 
              onClick={() => setView('Manager')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                view === 'Manager' ? 'bg-white shadow-sm text-emerald-700' : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden sm:inline">Manager</span>
            </button>
            <button 
              onClick={() => setView('Worker')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                view === 'Worker' ? 'bg-white shadow-sm text-emerald-700' : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Worker</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <AnimatePresence mode="wait">
          {view === 'Manager' ? (
            <motion.div 
              key="manager"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {/* Top Row: Stats & Weather */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <WeatherWidget />
                  <div className="bg-emerald-900 p-6 rounded-2xl shadow-lg text-white relative overflow-hidden">
                    <div className="relative z-10">
                      <h3 className="text-emerald-200 font-medium text-sm uppercase tracking-wider mb-4">AI Predictive Engine</h3>
                      <p className="text-lg mb-6 text-emerald-50 leading-tight">Analyze environmental data to predict pest outbreaks.</p>
                      <button 
                        onClick={runPrediction}
                        disabled={isPredicting}
                        className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-800 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95"
                      >
                        {isPredicting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Analyzing...</span>
                          </>
                        ) : (
                          <>
                            <BrainCircuit className="w-5 h-5" />
                            <span>Run AI Prediction</span>
                          </>
                        )}
                      </button>
                    </div>
                    <TrendingUp className="absolute -bottom-4 -right-4 w-32 h-32 text-emerald-800/50" />
                  </div>
                </div>
                <div className="lg:col-span-1">
                  <NewsFeed />
                </div>
              </div>

              {/* Middle Row: Heatmap */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-stone-800">Greenhouse Heatmap</h2>
                  <div className="flex items-center gap-4 text-xs font-bold uppercase text-stone-400">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>Safe</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-amber-500" />
                      <span>Warning</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-rose-500" />
                      <span>Danger</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {zones.map(zone => (
                    <HeatmapZone key={zone.id} zone={zone} />
                  ))}
                </div>
              </section>

              {/* Bottom Row: Active Tasks */}
              <section className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
                <div className="p-6 border-b border-stone-50">
                  <h2 className="text-xl font-bold text-stone-800">Recent Dispatches</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-stone-50 text-[10px] uppercase font-bold text-stone-400 tracking-widest">
                      <tr>
                        <th className="px-6 py-4">Task ID</th>
                        <th className="px-6 py-4">Location</th>
                        <th className="px-6 py-4">Threat</th>
                        <th className="px-6 py-4">Action</th>
                        <th className="px-6 py-4 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-50">
                      {tasks.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-stone-400 italic">
                            No active tasks. Run prediction to generate tasks.
                          </td>
                        </tr>
                      ) : (
                        tasks.map(task => (
                          <tr key={task.id} className="hover:bg-stone-50/50 transition-colors">
                            <td className="px-6 py-4 font-mono text-xs text-stone-500">#{task.id}</td>
                            <td className="px-6 py-4 font-semibold text-stone-800">Zone {task.zone}, Row {task.row}</td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-medium">
                                <Bug className="w-3 h-3" />
                                {task.threat}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-stone-600">{task.action}</td>
                            <td className="px-6 py-4 text-right">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                task.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                              }`}>
                                {task.status === 'Completed' && <CheckCircle2 className="w-3 h-3" />}
                                {task.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </motion.div>
          ) : (
            <motion.div 
              key="worker"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-md mx-auto space-y-6"
            >
              {!activeTask ? (
                <div className="bg-white p-12 rounded-3xl shadow-xl border border-stone-100 text-center space-y-6">
                  <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-3xl font-black text-stone-800">NO TASKS</h2>
                    <p className="text-stone-400 font-bold uppercase tracking-widest">Everything is safe</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-white p-8 rounded-3xl shadow-2xl border-4 border-rose-500 space-y-8">
                    {/* Location */}
                    <div className="flex items-center gap-6">
                      <div className="bg-rose-100 p-6 rounded-2xl">
                        <MapPin className="w-12 h-12 text-rose-600" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-stone-400 font-black text-sm uppercase tracking-widest">Location</span>
                        <span className="text-4xl font-black text-stone-800">ZONE {activeTask.zone}</span>
                        <span className="text-2xl font-bold text-stone-500">ROW {activeTask.row}</span>
                      </div>
                    </div>

                    <div className="h-px bg-stone-100" />

                    {/* Threat */}
                    <div className="flex items-center gap-6">
                      <div className="bg-amber-100 p-6 rounded-2xl">
                        <Bug className="w-12 h-12 text-amber-600" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-stone-400 font-black text-sm uppercase tracking-widest">Threat</span>
                        <span className="text-4xl font-black text-stone-800 uppercase">{activeTask.threat}</span>
                      </div>
                    </div>

                    <div className="h-px bg-stone-100" />

                    {/* Action */}
                    <div className="flex items-center gap-6">
                      <div className="bg-emerald-100 p-6 rounded-2xl">
                        {activeTask.action === 'Treatment' ? (
                          <Droplets className="w-12 h-12 text-emerald-600" />
                        ) : (
                          <Scissors className="w-12 h-12 text-emerald-600" />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-stone-400 font-black text-sm uppercase tracking-widest">Action</span>
                        <span className="text-4xl font-black text-stone-800 uppercase tracking-tight">{activeTask.action}</span>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => completeTask(activeTask.id)}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white p-8 rounded-3xl shadow-xl flex items-center justify-center gap-4 transition-all active:scale-95 group"
                  >
                    <CheckCircle2 className="w-12 h-12 group-hover:scale-110 transition-transform" />
                    <span className="text-4xl font-black uppercase tracking-tighter">Task Complete</span>
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Info */}
      <footer className="max-w-7xl mx-auto p-8 text-center text-stone-400 text-xs font-medium uppercase tracking-widest">
        BioShield IPM System • Leamington, Ontario • v1.0.4
      </footer>
    </div>
  );
}
