import { useState, useEffect, useRef } from 'react';
import { RefreshCw, Play, ShieldAlert, Cpu, ToggleLeft, Layers, Sparkles } from 'lucide-react';

interface LogItem {
  id: string;
  source: 'parent' | 'child-render' | 'use-effect' | 'cleanup';
  message: string;
  timestamp: string;
}

export default function ReactDataInspector() {
  const [user, setUser] = useState('Jane HCI');
  const [themeMode, setThemeMode] = useState('cool');
  const [isChildMounted, setIsChildMounted] = useState(true);
  
  const [logs, setLogs] = useState<LogItem[]>([]);
  const parentRenderCount = useRef(1);
  const childRenderCount = useRef(0);

  // Parent render monitor
  parentRenderCount.current += 1;

  const addLog = (source: LogItem['source'], message: string) => {
    const time = new Date().toLocaleTimeString();
    setLogs(prev => [
      {
        id: Math.random().toString(36).substr(2, 9),
        source,
        message,
        timestamp: time
      },
      ...prev.slice(0, 25) // limit size
    ]);
  };

  const handleReset = () => {
    setUser('Jane HCI');
    setThemeMode('cool');
    setIsChildMounted(true);
    setLogs([]);
    parentRenderCount.current = 1;
    childRenderCount.current = 0;
    addLog('parent', 'Reset inspector system registers.');
  };

  return (
    <div className="bg-white text-slate-900 rounded-2xl p-6 border border-slate-200 shadow-sm" id="react-inspector-root">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-6">
        <div>
          <h3 className="text-lg font-extrabold flex items-center gap-2 text-indigo-650 font-display">
            <Layers className="w-5 h-5 text-indigo-600 animate-pulse" />
            React Props, State &amp; Live Inspector
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed font-sans">Understand useState hooks, controlled inputs, and mounting/unmounting side-effect lifecycles.</p>
        </div>
        
        <button
          onClick={handleReset}
          className="text-xs bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-slate-600 hover:bg-slate-100 transition shadow-sm font-bold"
          id="react-inspector-reset"
        >
          Reset Stats
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Hand: Controls & Parent Scope Wrapper */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-inner space-y-4">
            <div className="flex items-center justify-between border-b border-slate-850 pb-2">
              <span className="text-xs font-bold text-pink-400 uppercase tracking-widest flex items-center gap-1.5">
                📦 Parent Component State Space
              </span>
              <span className="text-[10px] bg-pink-950 text-pink-300 border border-pink-900 px-1.5 py-0.5 rounded">
                Render Count: {parentRenderCount.current}
              </span>
            </div>

            {/* Controlled Text Input */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 block font-semibold flex justify-between">
                <span>1. useState Text Field (Username):</span>
                <span className="font-mono text-pink-400">user</span>
              </label>
              <input
                type="text"
                value={user}
                onChange={(e) => {
                  setUser(e.target.value);
                  addLog('parent', `Modified "user" variable state value to "${e.target.value}"`);
                }}
                className="w-full bg-slate-900 border border-slate-750 rounded-lg text-xs py-2 px-3 focus:outline-none focus:border-pink-500 font-mono text-pink-300"
                id="parent-text-input"
              />
              <span className="text-[10px] text-slate-500 italic block leading-tight">
                Binding `value={'{user}'}` keeps React in single-source-of-truth control.
              </span>
            </div>

            {/* Controlled Select Dropdown */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 block font-semibold flex justify-between">
                <span>2. useState Dropdown (Theme Modes):</span>
                <span className="font-mono text-pink-400">themeMode</span>
              </label>
              <select
                value={themeMode}
                onChange={(e) => {
                  setThemeMode(e.target.value);
                  addLog('parent', `Selected new theme: "${e.target.value}"`);
                }}
                className="w-full bg-slate-900 border border-slate-75) rounded-lg text-xs py-2 px-3 focus:outline-none focus:border-pink-500 font-mono text-pink-300"
                id="parent-select-dropdown"
              >
                <option value="cool">Cool Cyan Mode</option>
                <option value="slate">Carbon Slate Mode</option>
                <option value="warm">Warm Amber Mode</option>
              </select>
            </div>

            {/* Mount/Unmount Toggle */}
            <div className="pt-3 border-t border-slate-850 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-350 block">3. Child Lifecycle Controller</span>
                <span className="text-[10px] text-slate-500 italic block">Simulate unmounting to clean listeners</span>
              </div>
              <button
                onClick={() => {
                  setIsChildMounted(prev => {
                    addLog('parent', `${prev === true ? 'UNMOUNTING' : 'MOUNTING'} child component from DOM`);
                    return !prev;
                  });
                }}
                className={`py-1.5 px-3 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  isChildMounted 
                    ? 'bg-rose-500/25 text-rose-300 border border-rose-500/50 hover:bg-rose-500/40' 
                    : 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/50 hover:bg-emerald-500/40'
                }`}
                id="mount-toggle-btn"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                {isChildMounted ? 'Unmount Child' : 'Mount Child'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Hand: Interactive Component Stage & Visual Logs */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          
          {/* Component Stage */}
          <div className="bg-slate-950 rounded-lg p-5 border border-slate-800 flex-1 flex flex-col justify-between min-h-[220px]">
            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase block tracking-wider mb-2">
                🏠 React Render Stage DOM Layout
              </span>
              
              {isChildMounted ? (
                <ChildComponent 
                  username={user} 
                  theme={themeMode} 
                  addLog={addLog} 
                  renderCounter={childRenderCount} 
                />
              ) : (
                <div className="bg-slate-900 border border-dashed border-slate-800 rounded-xl p-8 text-center text-slate-500 text-xs italic my-2 animate-pulse">
                  &lt;ChildComponent /&gt; is UNMOUNTED.
                  <br />Its internal state has been entirely wiped out.
                </div>
              )}
            </div>

            {/* Simple component markup review */}
            <div className="bg-slate-900 p-3.5 rounded border border-slate-850 font-mono text-xs text-slate-400 space-y-1">
              <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider mb-1.5">Active JSX Code Structure:</span>
              <div>&lt;<span className="text-emerald-400">ParentComponent</span>&gt;</div>
              <div className="pl-4">
                {isChildMounted ? (
                  <>
                    &lt;<span className="text-cyan-400">ChildComponent</span> 
                    <span className="text-pink-400"> username</span>=<span className="text-amber-300">&quot;{user}&quot;</span> 
                    <span className="text-pink-400"> theme</span>=<span className="text-amber-300">&quot;{themeMode}&quot;</span> /&gt;
                  </>
                ) : (
                  <span className="text-slate-550">// Child is omitted from rendering</span>
                )}
              </div>
              <div>&lt;/<span className="text-emerald-400">ParentComponent</span>&gt;</div>
            </div>
          </div>

          {/* Interactive Telemetry Log Terminal */}
          <div className="bg-slate-950 rounded-lg border border-slate-800 p-4 h-[200px] flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex justify-between items-center">
              <span>🖥️ React Life cycle Trace Monitor</span>
              <span className="text-[9px] text-slate-600 font-mono italic">Scrolls down automatically</span>
            </span>

            <div className="bg-slate-900 rounded p-3 font-mono text-xs flex-1 overflow-y-auto space-y-1.5 h-full">
              {logs.length === 0 ? (
                <span className="text-slate-600 block italic py-4 text-center">[Launch parent or child state actions to trace lifecycle milestones]</span>
              ) : (
                logs.map(log => {
                  let colorClass = 'text-slate-400';
                  let icon = '•';
                  if (log.source === 'parent') {
                    colorClass = 'text-pink-400';
                    icon = 'P';
                  } else if (log.source === 'child-render') {
                    colorClass = 'text-emerald-300';
                    icon = 'R';
                  } else if (log.source === 'use-effect') {
                    colorClass = 'text-cyan-300 font-bold';
                    icon = 'E';
                  } else if (log.source === 'cleanup') {
                    colorClass = 'text-amber-400 font-bold';
                    icon = 'C';
                  }
                  return (
                    <div key={log.id} className="flex gap-2.5 items-start text-[11px] leading-relaxed border-b border-slate-850 pb-1">
                      <span className="text-[9px] text-slate-550 pt-0.5">{log.timestamp}</span>
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 ${
                        log.source === 'parent' ? 'bg-pink-955 border border-pink-800' :
                        log.source === 'child-render' ? 'bg-emerald-955 border border-emerald-800' :
                        log.source === 'use-effect' ? 'bg-cyan-955 border border-cyan-800' :
                        'bg-amber-955 border border-amber-800'
                      }`}>
                        {icon}
                      </span>
                      <span className={colorClass}>{log.message}</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// Visual Child component
interface ChildProps {
  username: string;
  theme: string;
  addLog: (source: LogItem['source'], message: string) => void;
  renderCounter: { current: number };
}

function ChildComponent({ username, theme, addLog, renderCounter }: ChildProps) {
  // Increment render counter
  renderCounter.current += 1;

  // Track rendering
  useEffect(() => {
    addLog('child-render', `[Render #${renderCounter.current}] <ChildComponent /> mounted/re-rendered with props: user="${username}", theme="${theme}"`);
  });

  // Effect 1: Fires only on Mount (empty dependencies [])
  useEffect(() => {
    addLog('use-effect', 'useEffect (empty dependency array []) executing callback on initial mount.');
    
    // Cleanup callback (fires on unmount)
    return () => {
      addLog('cleanup', 'Cleanup handler returning from Mount effect (unmounting triggers final exit code cleanup).');
    };
  }, []);

  // Effect 2: Fires on Dependency Trigger [theme]
  useEffect(() => {
    addLog('use-effect', `useEffect (dependency [themeMode="${theme}"]) executing because themeMode updated.`);
    
    return () => {
      addLog('cleanup', `Cleanup handler returning for effect dependencies BEFORE themeMode shifts from "${theme}".`);
    };
  }, [theme]);

  // Styling lookup
  const themeStyles = {
    cool: 'bg-cyan-950/40 border-cyan-500 shadow-cyan-950/40 text-cyan-100',
    slate: 'bg-slate-900 border-slate-600 shadow-slate-950/40 text-slate-100',
    warm: 'bg-amber-955/30 border-amber-500 shadow-amber-950/40 text-amber-100'
  }[theme] || 'bg-slate-900 border-slate-700';

  return (
    <div className={`p-5 rounded-xl border border-3 shadow-lg transition-all duration-300 my-2 ${themeStyles}`}>
      <div className="flex justify-between items-center mb-3">
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 font-mono">
          &lt;ChildComponent /&gt; Active Node
        </span>
        <span className="text-[10px] bg-slate-800 border border-slate-700 px-2 py-0.5 rounded font-bold">
          Render #{renderCounter.current}
        </span>
      </div>

      <div className="space-y-2">
        <h4 className="text-base font-black tracking-tight flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
          Hello, {username || "Anonymous Student"}!
        </h4>
        <p className="text-xs text-slate-300">
          I am a child component receiving values via read-only props. Currently rendered styled in 
          <strong className="capitalize px-1 bg-slate-800/60 rounded"> {theme} mode</strong>.
        </p>
      </div>

      {/* Internal State example inside Child */}
      <div className="mt-4 pt-3 border-t border-slate-800/60 grid grid-cols-2 gap-2 text-center text-xs">
        <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800 font-mono">
          <span className="text-[9px] text-slate-500 block">PROPS: USER</span>
          <span className="font-bold truncate block">{username}</span>
        </div>
        <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800 font-mono">
          <span className="text-[9px] text-slate-550 block">PROPS: THEME</span>
          <span className="font-bold capitalize block">{theme}</span>
        </div>
      </div>
    </div>
  );
}
