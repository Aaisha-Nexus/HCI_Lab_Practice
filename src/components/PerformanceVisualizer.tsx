import { useState, useEffect, useRef } from 'react';
import { Activity, Play, Square, Zap, Clock, ShieldAlert, ArrowRight, HelpCircle } from 'lucide-react';

interface EventPulse {
  id: string;
  timestamp: number;
  type: 'raw' | 'debounced' | 'throttled' | 'polling';
  label?: string;
}

export default function PerformanceVisualizer() {
  const [debounceDelay, setDebounceDelay] = useState(500); // ms
  const [throttleLimit, setThrottleLimit] = useState(600); // ms
  
  const [pulses, setPulses] = useState<EventPulse[]>([]);
  const [isPolling, setIsPolling] = useState(false);
  
  // Timer references
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const throttleLockRef = useRef(false);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Stats
  const [rawCount, setRawCount] = useState(0);
  const [debounceCount, setDebounceCount] = useState(0);
  const [throttleCount, setThrottleCount] = useState(0);
  const [pollingCount, setPollingCount] = useState(0);

  const maxTimelineDuration = 6000; // Track last 6 seconds of events

  // Clean timers on exit
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
    };
  }, []);

  // Sync timeline cleanup - remove old pulses to prevent performance lag
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setPulses(prev => prev.filter(p => now - p.timestamp < maxTimelineDuration));
    }, 150);
    return () => clearInterval(interval);
  }, []);

  // Core Click Handler
  const handleTrigger = () => {
    const now = Date.now();
    
    // 1. Raw Event (Fires immediately)
    setRawCount(c => c + 1);
    addPulse('raw', now);

    // 2. Debounced Event Handler (Delays execution, resets on consecutive clicks)
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      setDebounceCount(c => c + 1);
      addPulse('debounced', Date.now());
    }, debounceDelay);

    // 3. Throttled Event Handler (Executes first click, locks out next clicks)
    if (!throttleLockRef.current) {
      throttleLockRef.current = true;
      setThrottleCount(c => c + 1);
      addPulse('throttled', now);
      
      setTimeout(() => {
        throttleLockRef.current = false;
      }, throttleLimit);
    }
  };

  // Polling Starter ("Start Repeating" in slides)
  const startPolling = () => {
    if (isPolling) return;
    setIsPolling(true);
    addPulse('polling', Date.now(), "Poll Started");
    
    pollingIntervalRef.current = setInterval(() => {
      setPollingCount(c => c + 1);
      addPulse('polling', Date.now(), "Poll Tick");
    }, 1200);
  };

  // Polling Stopper ("Stop Repeating" in slides)
  const stopPolling = () => {
    if (!isPolling) return;
    setIsPolling(false);
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    addPulse('polling', Date.now(), "Poll Stopped");
  };

  const addPulse = (type: 'raw' | 'debounced' | 'throttled' | 'polling', timestamp: number, label?: string) => {
    setPulses(prev => [
      ...prev,
      {
        id: Math.random().toString(36).substr(2, 9),
        timestamp,
        type,
        label
      }
    ]);
  };

  const handleReset = () => {
    setRawCount(0);
    setDebounceCount(0);
    setThrottleCount(0);
    setPollingCount(0);
    setPulses([]);
    stopPolling();
  };

  // Convert pulse timestamp into a relative percentage for horizontal trace drawing
  const getPulsePosition = (timestamp: number) => {
    const now = Date.now();
    const elapsed = now - timestamp;
    const percentage = 100 - (elapsed / maxTimelineDuration) * 100;
    return Math.max(0, Math.min(100, percentage));
  };

  return (
    <div className="bg-white text-slate-900 rounded-2xl p-6 border border-slate-200 shadow-sm" id="perf-viz-container">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-6">
        <div>
          <h3 className="text-lg font-extrabold flex items-center gap-2 text-indigo-600 font-display">
            <Activity className="w-5 h-5 text-indigo-600 animate-pulse" />
            Performance &amp; Events Playground
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed font-sans">Provides a real-time, visual side-by-side comparison of Debouncing, Throttling, and Polling.</p>
        </div>
        <button
          onClick={handleReset}
          className="text-xs bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-slate-600 hover:bg-slate-100 transition shadow-sm font-bold"
          id="perf-reset-btn"
        >
          Reset Logs
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Controls & Sliders */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-inner space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              ⚙️ Tune Timings
            </h4>
            
            {/* Debounce Range */}
            <div>
              <div className="flex justify-between text-xs mb-1.5 font-mono font-medium">
                <span className="text-slate-600">Debounce delay:</span>
                <span className="text-indigo-600 font-extrabold">{debounceDelay}ms</span>
              </div>
              <input
                type="range"
                min="200"
                max="1500"
                step="50"
                value={debounceDelay}
                onChange={(e) => setDebounceDelay(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                id="debounce-slider"
              />
              <span className="text-[10px] text-slate-400 italic block mt-1 leading-tight">
                Wait {debounceDelay}ms *without clicks* to execute.
              </span>
            </div>

            {/* Throttle Range */}
            <div>
              <div className="flex justify-between text-xs mb-1.5 font-mono font-medium">
                <span className="text-slate-600">Throttle Limit:</span>
                <span className="text-indigo-600 font-extrabold">{throttleLimit}ms</span>
              </div>
              <input
                type="range"
                min="200"
                max="1500"
                step="50"
                value={throttleLimit}
                onChange={(e) => setThrottleLimit(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                id="throttle-slider"
              />
              <span className="text-[10px] text-slate-400 italic block mt-1 leading-tight">
                Limit runs to once every {throttleLimit}ms max.
              </span>
            </div>
          </div>

          {/* Interactive Click trigger panel */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 text-center space-y-4 shadow-sm">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider text-left">
              🐾 Interactive Triggers
            </h4>
            <p className="text-xs text-slate-500 text-left leading-relaxed">
              Click this button repeatedly, rapidly, or slowly and watch the live colored dots appear on the timeline.
            </p>

            <button
              onClick={handleTrigger}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-4 px-6 rounded-2xl text-sm shadow-md active:scale-[0.98] transition flex items-center justify-center gap-2"
              id="trigger-event-btn"
            >
              <Zap className="w-4 h-4 fill-current text-white animate-bounce" />
              TRIGGER EVENT CLICK!
            </button>
            <span className="text-[10px] text-slate-400 italic inline-block leading-tight font-sans">
              Simulates raw scroll events, dragging, or keystrokes!
            </span>

            {/* Polling Module */}
            <div className="border-t border-slate-850 pt-4 mt-2 space-y-3 text-left">
              <div>
                <span className="text-xs font-bold text-amber-400 block mb-1">
                  ⏱️ Polling (Start vs Stop Repeating)
                </span>
                <span className="text-[11px] text-slate-450 block leading-tight">
                  Simulates a stock quote updater or chat poller running on an interval (1.2 seconds helper ticks).
                </span>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={startPolling}
                  disabled={isPolling}
                  className="flex-1 text-xs py-2 px-3 rounded font-bold bg-amber-500 hover:bg-amber-400 text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center justify-center gap-1.5"
                  id="start-polling-btn"
                >
                  <Play className="w-3.5 h-3.5 fill-current" /> Start Polling
                </button>
                <button
                  onClick={stopPolling}
                  disabled={!isPolling}
                  className="flex-1 text-xs py-2 px-3 rounded font-bold bg-rose-600 hover:bg-rose-500 text-white disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center justify-center gap-1.5"
                  id="stop-polling-btn"
                >
                  <Square className="w-3.5 h-3.5 fill-current" /> Stop Polling
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Visual timelines */}
        <div className="lg:col-span-7 bg-slate-950 rounded-lg border border-slate-800 p-5 space-y-4">
          <div className="flex justify-between items-center text-xs text-slate-500 border-b border-slate-850 pb-2">
            <span className="font-bold tracking-wider text-slate-450 uppercase">Live Trace Timeline</span>
            <span className="font-mono text-[10px] text-slate-600 flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-550" /> Rolling Window (Last 6s)
            </span>
          </div>

          {/* Timeline Lanes */}
          <div className="space-y-4 relative py-2">
            
            {/* Raw Lane */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-rose-400">1. Raw Events</span>
                <span className="font-mono text-xs text-slate-500">Triggered: <strong className="text-rose-400 font-bold">{rawCount}</strong></span>
              </div>
              <div className="h-10 bg-slate-900 border border-slate-850 rounded-lg relative overflow-hidden flex items-center">
                {/* Rolling guide lines */}
                <div className="absolute inset-0 flex justify-between px-4 pointer-events-none opacity-10">
                  <span className="h-full border-r border-white"></span>
                  <span className="h-full border-r border-white"></span>
                  <span className="h-full border-r border-white"></span>
                </div>
                {/* Plotted Events */}
                {pulses.filter(p => p.type === 'raw').map(p => (
                  <div
                    key={p.id}
                    className="absolute w-3 h-3 bg-rose-500 rounded-full shadow-lg shadow-rose-500/50 transform -translate-x-1/2 animate-fade-in"
                    style={{ left: `${getPulsePosition(p.timestamp)}%` }}
                  />
                ))}
              </div>
            </div>

            {/* Debounced Lane */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-blue-400">2. Debounced Events</span>
                <span className="font-mono text-xs text-slate-500">Executed: <strong className="text-blue-400 font-bold">{debounceCount}</strong></span>
              </div>
              <div className="h-10 bg-slate-900 border border-slate-850 rounded-lg relative overflow-hidden flex items-center">
                <div className="absolute inset-0 flex justify-between px-4 pointer-events-none opacity-10">
                  <span className="h-full border-r border-white"></span>
                  <span className="h-full border-r border-white"></span>
                  <span className="h-full border-r border-white"></span>
                </div>
                {pulses.filter(p => p.type === 'debounced').map(p => (
                  <div
                    key={p.id}
                    className="absolute w-4 h-4 bg-blue-500 rounded-full shadow-lg shadow-blue-500/50 transform -translate-x-1/2 animate-bounce cursor-help"
                    style={{ left: `${getPulsePosition(p.timestamp)}%` }}
                    title="Fired on delay quiet window!"
                  />
                ))}
              </div>
            </div>

            {/* Throttled Lane */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-emerald-400">3. Throttled Events</span>
                <span className="font-mono text-xs text-slate-500">Executed: <strong className="text-emerald-400 font-bold">{throttleCount}</strong></span>
              </div>
              <div className="h-10 bg-slate-900 border border-slate-850 rounded-lg relative overflow-hidden flex items-center">
                <div className="absolute inset-0 flex justify-between px-4 pointer-events-none opacity-10">
                  <span className="h-full border-r border-white"></span>
                  <span className="h-full border-r border-white"></span>
                  <span className="h-full border-r border-white"></span>
                </div>
                {pulses.filter(p => p.type === 'throttled').map(p => (
                  <div
                    key={p.id}
                    className="absolute w-4 h-4 bg-emerald-500 rounded-md shadow-lg shadow-emerald-500/50 transform -translate-x-1/2 animate-ping"
                    style={{ left: `${getPulsePosition(p.timestamp)}%` }}
                  />
                ))}
                {pulses.filter(p => p.type === 'throttled').map(p => (
                  <div
                    key={p.id + "_static"}
                    className="absolute w-4 h-4 bg-emerald-500 rounded-md shadow-lg shadow-emerald-500/50 transform -translate-x-1/2"
                    style={{ left: `${getPulsePosition(p.timestamp)}%` }}
                  />
                ))}
              </div>
            </div>

            {/* Polling Lane */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-amber-400">4. Polling Loop Ticks</span>
                <span className="font-mono text-xs text-slate-500">Ticks: <strong className="text-amber-400 font-bold">{pollingCount}</strong></span>
              </div>
              <div className="h-10 bg-slate-900 border border-slate-850 rounded-lg relative overflow-hidden flex items-center">
                <div className="absolute inset-0 flex justify-between px-4 pointer-events-none opacity-10">
                  <span className="h-full border-r border-white"></span>
                  <span className="h-full border-r border-white"></span>
                  <span className="h-full border-r border-white"></span>
                </div>
                {pulses.filter(p => p.type === 'polling').map(p => (
                  <div
                    key={p.id}
                    className={`absolute py-0.5 px-2.5 rounded text-[8px] font-bold text-slate-950 transform -translate-x-1/2 border whitespace-nowrap select-none ${
                      p.label?.includes("Stop") 
                        ? "bg-rose-500 text-white border-rose-350" 
                        : p.label?.includes("Start")
                        ? "bg-emerald-500 text-slate-950 border-emerald-355"
                        : "bg-amber-400 text-slate-950 border-amber-302"
                    }`}
                    style={{ left: `${getPulsePosition(p.timestamp)}%` }}
                  >
                    {p.label || "Tick"}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Quick explanations card */}
          <div className="bg-slate-900 border border-slate-805 rounded-lg p-3 space-y-1.5 text-xs text-slate-300">
            <h5 className="font-bold flex items-center gap-1 text-slate-205 text-[11px] uppercase tracking-wider">
              <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
              How do these differ in a nutshell?
            </h5>
            <ul className="space-y-1.5 list-disc pl-4 text-slate-400">
              <li><strong className="text-rose-400">Raw Clicks</strong>: Direct browser bindings. Executes for every event (very laggy on mouse movements).</li>
              <li><strong className="text-blue-400">Debounce</strong>: Bundles bursts. Think &quot;typeahead search&quot; — we only query the DB after the student *stops typing* for half a second.</li>
              <li><strong className="text-emerald-400">Throttle</strong>: Speed limit. Think &quot;infinite scrolling feed&quot; — fetch new posts at most once every 600ms, ignoring thousands of pixel-by-pixel trigger values.</li>
              <li><strong className="text-amber-400">Polling</strong>: Clockwork updates. The client regularly knocks on the server&apos;s door to request fresh inbox counts or notification checks.</li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}
