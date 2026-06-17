import { useState, useEffect } from 'react';
import { Play, SkipForward, RotateCcw, AlertTriangle, Terminal, Layers, RefreshCw, Cpu } from 'lucide-react';

interface TraceStep {
  title: string;
  description: string;
  stack: string[];
  webApi: { name: string; delayRemaining?: string }[];
  microtasks: string[];
  macrotasks: string[];
  console: string[];
  codeHighlightLine: number;
}

interface Scenario {
  name: string;
  description: string;
  code: string[];
  steps: TraceStep[];
}

export default function EventLoopSimulator() {
  // Scenario 1: Standard setTimeout vs Promise
  const scenarios: Scenario[] = [
    {
      name: "Mock Exam Event Loop Layout",
      description: "Includes setTimeout, synchronous logs, and Promise cascades. High probability exam pattern.",
      code: [
        "1: console.log('A');",
        "2: setTimeout(() => console.log('B'), 0);",
        "3: Promise.resolve().then(() => console.log('C'));",
        "4: new Promise((res) => {",
        "5:   console.log('D');",
        "6:   res();",
        "7: }).then(() => console.log('E'));",
        "8: console.log('F');"
      ],
      steps: [
        {
          title: "Starting Execution",
          description: "Evaluating script synchronously from top to bottom.",
          stack: ["Global Script"],
          webApi: [],
          microtasks: [],
          macrotasks: [],
          console: [],
          codeHighlightLine: 0
        },
        {
          title: "Line 1: Log 'A'",
          description: "console.log('A') is pushed to the Call Stack and executes immediately.",
          stack: ["console.log('A')", "Global Script"],
          webApi: [],
          microtasks: [],
          macrotasks: [],
          console: ["A"],
          codeHighlightLine: 0
        },
        {
          title: "Line 2: setTimeout() called",
          description: "setTimeout is pushed to the call stack. It registers a callback with Web APIs.",
          stack: ["setTimeout()", "Global Script"],
          webApi: [],
          microtasks: [],
          macrotasks: [],
          console: ["A"],
          codeHighlightLine: 1
        },
        {
          title: "Register Timer with Web API",
          description: "The timer is offloaded to the Web API layer. Because the delay is 0ms, it completes instantly and moves its callback to the Macrotask Queue.",
          stack: ["Global Script"],
          webApi: [{ name: "Timer (0ms)" }],
          microtasks: [],
          macrotasks: [],
          console: ["A"],
          codeHighlightLine: 1
        },
        {
          title: "Queue Macrotask",
          description: "Callback 'console.log(B)' is put in the Macrotask Queue. But it MUST wait until the Call Stack is empty!",
          stack: ["Global Script"],
          webApi: [],
          microtasks: [],
          macrotasks: ["cb: log 'B'"],
          console: ["A"],
          codeHighlightLine: 1
        },
        {
          title: "Line 3: Promise resolved",
          description: "Promise.resolve() is synchronous. The .then() callback is registered.",
          stack: ["Promise.resolve()", "Global Script"],
          webApi: [],
          microtasks: [],
          macrotasks: ["cb: log 'B'"],
          console: ["A"],
          codeHighlightLine: 2
        },
        {
          title: "Queue Microtask (Promise)",
          description: "The .then() callback is immediately pushed to the Microtask Queue (high priority).",
          stack: ["Global Script"],
          webApi: [],
          microtasks: ["cb: log 'C'"],
          macrotasks: ["cb: log 'B'"],
          console: ["A"],
          codeHighlightLine: 2
        },
        {
          title: "Line 4: Executor logs 'D' synchronously",
          description: "Critical: The function passed to 'new Promise' executes SYNCHRONOUSLY. console.log('D') runs immediately.",
          stack: ["new Promise() executor", "Global Script"],
          webApi: [],
          microtasks: ["cb: log 'C'"],
          macrotasks: ["cb: log 'B'"],
          console: ["A"],
          codeHighlightLine: 3
        },
        {
          title: "Log 'D'",
          description: "console.log('D') is executed and printed.",
          stack: ["console.log('D')", "new Promise() executor", "Global Script"],
          webApi: [],
          microtasks: ["cb: log 'C'"],
          macrotasks: ["cb: log 'B'"],
          console: ["A", "D"],
          codeHighlightLine: 4
        },
        {
          title: "Resolve Promise & Queue Microtask",
          description: "Calling res() resolves the promise, which immediately schedules its nested .then() callback 'console.log(E)' to the Microtask Queue.",
          stack: ["Global Script"],
          webApi: [],
          microtasks: ["cb: log 'C'", "cb: log 'E'"],
          macrotasks: ["cb: log 'B'"],
          console: ["A", "D"],
          codeHighlightLine: 6
        },
        {
          title: "Line 8: Log 'F'",
          description: "console.log('F') is pushed to the Call Stack and runs.",
          stack: ["console.log('F')", "Global Script"],
          webApi: [],
          microtasks: ["cb: log 'C'", "cb: log 'E'"],
          macrotasks: ["cb: log 'B'"],
          console: ["A", "D"],
          codeHighlightLine: 7
        },
        {
          title: "Log 'F' Output",
          description: "F is logged. This completes the synchronous global script execution.",
          stack: ["Global Script"],
          webApi: [],
          microtasks: ["cb: log 'C'", "cb: log 'E'"],
          macrotasks: ["cb: log 'B'"],
          console: ["A", "D", "F"],
          codeHighlightLine: 7
        },
        {
          title: "Synchronous Global Script Done",
          description: "The global script finishes. Global Script is popped from the Call Stack. The stack is now empty!",
          stack: [],
          webApi: [],
          microtasks: ["cb: log 'C'", "cb: log 'E'"],
          macrotasks: ["cb: log 'B'"],
          console: ["A", "D", "F"],
          codeHighlightLine: 7
        },
        {
          title: "Draining Microtask Queue First",
          description: "The Event Loop checks the Call Stack (it's empty). Before moving to any macrotask, it MUST completely empty the Microtask Queue. It pulls the first item: log 'C'.",
          stack: ["cb: log 'C'"],
          webApi: [],
          microtasks: ["cb: log 'E'"],
          macrotasks: ["cb: log 'B'"],
          console: ["A", "D", "F"],
          codeHighlightLine: 2
        },
        {
          title: "Logged 'C'",
          description: "cb log 'C' prints output and is popped from the stack.",
          stack: [],
          webApi: [],
          microtasks: ["cb: log 'E'"],
          macrotasks: ["cb: log 'B'"],
          console: ["A", "D", "F", "C"],
          codeHighlightLine: 2
        },
        {
          title: "Remaining Microtasks",
          description: "Call stack is empty again. Event Loop checks Microtask Queue and finds another item: 'cb: log E'.",
          stack: ["cb: log 'E'"],
          webApi: [],
          microtasks: [],
          macrotasks: ["cb: log 'B'"],
          console: ["A", "D", "F", "C"],
          codeHighlightLine: 6
        },
        {
          title: "Logged 'E'",
          description: "'cb: log E' prints data. Both microtasks are now completely drained!",
          stack: [],
          webApi: [],
          microtasks: [],
          macrotasks: ["cb: log 'B'"],
          console: ["A", "D", "F", "C", "E"],
          codeHighlightLine: 6
        },
        {
          title: "Calling Macrotask Queue",
          description: "Call stack is empty and Microtask queue is empty. Now, the event loop picks EXACTLY ONE item from the Macrotask Queue: 'cb: log B'.",
          stack: ["cb: log 'B'"],
          webApi: [],
          microtasks: [],
          macrotasks: [],
          console: ["A", "D", "F", "C", "E"],
          codeHighlightLine: 1
        },
        {
          title: "Sim Complete: Logs 'B'",
          description: "All queues are empty! Executed final output trace successfully.",
          stack: [],
          webApi: [],
          microtasks: [],
          macrotasks: [],
          console: ["A", "D", "F", "C", "E", "B"],
          codeHighlightLine: 1
        }
      ]
    },
    {
      name: "Async / Await Microtask Order",
      description: "See how the 'await' keyword pauses function execution and defers the rest of the lines as a microtask.",
      code: [
        "1: async function myTask() {",
        "2:   console.log('A (Async Start)');",
        "3:   await Promise.resolve('data');",
        "4:   console.log('B (After await)');",
        "5: }",
        "6: console.log('C (Global Start)');",
        "7: myTask();",
        "8: console.log('D (Global End)');"
      ],
      steps: [
        {
          title: "Initialize script",
          description: "The global script begins execution. Function myTask is defined.",
          stack: ["Global Script"],
          webApi: [],
          microtasks: [],
          macrotasks: [],
          console: [],
          codeHighlightLine: 0
        },
        {
          title: "Line 6: Global Start",
          description: "console.log('C...') runs synchronously.",
          stack: ["console.log('C')", "Global Script"],
          webApi: [],
          microtasks: [],
          macrotasks: [],
          console: ["C (Global Start)"],
          codeHighlightLine: 5
        },
        {
          title: "Line 7: Execute myTask()",
          description: "myTask() runs. We enter its function scope synchronously.",
          stack: ["myTask()", "Global Script"],
          webApi: [],
          microtasks: [],
          macrotasks: [],
          console: ["C (Global Start)"],
          codeHighlightLine: 6
        },
        {
          title: "Line 2: Inside Async Function",
          description: "console.log('A...') runs synchronously inside the function.",
          stack: ["console.log('A')", "myTask()", "Global Script"],
          webApi: [],
          microtasks: [],
          macrotasks: [],
          console: ["C (Global Start)", "A (Async Start)"],
          codeHighlightLine: 1
        },
        {
          title: "Line 3: Hits 'await'",
          description: "The Promise.resolve() is called synchronously. The 'await' then suspends myTask and schedules the remaining lines as a microtask callback.",
          stack: ["myTask()", "Global Script"],
          webApi: [],
          microtasks: [],
          macrotasks: [],
          console: ["C (Global Start)", "A (Async Start)"],
          codeHighlightLine: 2
        },
        {
          title: "Defer Remaining Code to Microtask",
          description: "The rest of myTask() is registered as a microtask callback. Control returns to the main thread immediately.",
          stack: ["Global Script"],
          webApi: [],
          microtasks: ["after-await: inside myTask()"],
          macrotasks: [],
          console: ["C (Global Start)", "A (Async Start)"],
          codeHighlightLine: 2
        },
        {
          title: "Line 8: Global End",
          description: "The rest of the synchronous parent thread continues. console.log('D') logs.",
          stack: ["console.log('D')", "Global Script"],
          webApi: [],
          microtasks: ["after-await: inside myTask()"],
          macrotasks: [],
          console: ["C (Global Start)", "A (Async Start)"],
          codeHighlightLine: 7
        },
        {
          title: "Logged 'D'",
          description: "Synchronous global thread completes. Global Script pops from Call Stack. The stack is empty!",
          stack: [],
          webApi: [],
          microtasks: ["after-await: inside myTask()"],
          macrotasks: [],
          console: ["C (Global Start)", "A (Async Start)", "D (Global End)"],
          codeHighlightLine: 7
        },
        {
          title: "Drain Microtask Queue",
          description: "Call stack is empty. Event Loop takes the 'after-await' microtask and pushes it onto the Call Stack to finish executing myTask().",
          stack: ["myTask() (resumed)"],
          webApi: [],
          microtasks: [],
          macrotasks: [],
          console: ["C (Global Start)", "A (Async Start)", "D (Global End)"],
          codeHighlightLine: 3
        },
        {
          title: "Line 4: Log inside await completed",
          description: "console.log('B') runs.",
          stack: ["console.log('B')", "myTask() (resumed)"],
          webApi: [],
          microtasks: [],
          macrotasks: [],
          console: ["C (Global Start)", "A (Async Start)", "D (Global End)", "B (After await)"],
          codeHighlightLine: 3
        },
        {
          title: "Complete Execution",
          description: "The async function wraps up. Everything is clean and completed perfectly!",
          stack: [],
          webApi: [],
          microtasks: [],
          macrotasks: [],
          console: ["C (Global Start)", "A (Async Start)", "D (Global End)", "B (After await)"],
          codeHighlightLine: 3
        }
      ]
    }
  ];

  const [activeScenarioIdx, setActiveScenarioIdx] = useState(0);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);

  const activeScenario = scenarios[activeScenarioIdx];
  const currentStep = activeScenario.steps[currentStepIdx];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoPlay) {
      interval = setInterval(() => {
        if (currentStepIdx < activeScenario.steps.length - 1) {
          setCurrentStepIdx(prev => prev + 1);
        } else {
          setAutoPlay(false);
        }
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [autoPlay, currentStepIdx, activeScenarioIdx]);

  const handleNext = () => {
    if (currentStepIdx < activeScenario.steps.length - 1) {
      setCurrentStepIdx(currentStepIdx + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx(currentStepIdx - 1);
    }
  };

  const handleReset = () => {
    setCurrentStepIdx(0);
    setAutoPlay(false);
  };

  const handleScenarioChange = (idx: number) => {
    setActiveScenarioIdx(idx);
    setCurrentStepIdx(0);
    setAutoPlay(false);
  };

  return (
    <div className="bg-white text-slate-900 rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden" id="event-loop-sim-container">
      {/* Decorative Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-6">
        <div>
          <h3 className="text-lg font-extrabold flex items-center gap-2 text-indigo-600 font-display">
            <Cpu className="w-5 h-5 animate-pulse text-indigo-600" />
            Event Loop Tracing Simulator
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed font-sans">Visualizes exactly how the Call Stack, Web APIs, Microtask Queue, Macrotask Queue, and Event Loop operate synchronous vs asynchronous code flow.</p>
        </div>
        
        {/* Scenario selection */}
        <div className="flex gap-2">
          {scenarios.map((s, idx) => (
            <button
              key={idx}
              onClick={() => handleScenarioChange(idx)}
              className={`px-3 py-1.5 text-xs rounded-xl font-bold transition-all ${
                activeScenarioIdx === idx
                  ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                  : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200 hover:text-slate-900'
              }`}
              id={`scenario-btn-${idx}`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="bg-slate-50 p-4 rounded-xl text-xs leading-relaxed text-slate-650 border border-slate-150 mb-6 flex justify-between items-center shadow-inner">
        <span><strong>Active Scenario:</strong> {activeScenario.description}</span>
        <span className="font-mono text-indigo-700 font-bold bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-150">
          Step {currentStepIdx + 1} of {activeScenario.steps.length}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Code Snippet on Left */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 font-mono text-xs flex-1 flex flex-col shadow-sm">
            <div className="text-slate-450 border-b border-slate-800 pb-2 mb-3 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-slate-450 tracking-wider">
                <Terminal className="w-3.5 h-3.5 text-indigo-400" /> Source Snippet
              </span>
              <span className="text-[10px] text-slate-500 bg-slate-950 border border-slate-850 px-1.5 py-0.5 rounded">
                ES6 JS Runtime
              </span>
            </div>
            
            <div className="space-y-1.5 leading-relaxed flex-1">
              {activeScenario.code.map((line, idx) => {
                const isActive = (currentStep.codeHighlightLine === idx);
                return (
                  <div
                    key={idx}
                    className={`py-1 px-2.5 rounded transition-all duration-300 flex items-center justify-between ${
                      isActive 
                        ? 'bg-indigo-600/20 text-indigo-300 font-semibold border-l-4 border-indigo-500 pl-1.5' 
                        : 'text-slate-405 bg-transparent'
                    }`}
                  >
                    <span>{line}</span>
                    {isActive && (
                      <span className="text-[8px] bg-indigo-550 text-white font-bold px-1.5 rounded uppercase animate-pulse">
                        Active
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Sim Controller */}
            <div className="mt-4 pt-3 border-t border-slate-850 flex gap-2 justify-center">
              <button
                onClick={handlePrev}
                disabled={currentStepIdx === 0}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-750 disabled:opacity-30 disabled:cursor-not-allowed transition"
                title="Previous Step"
                id="sim-prev-btn"
              >
                <SkipForward className="w-4 h-4 rotate-180" />
              </button>
              
              <button
                onClick={() => setAutoPlay(!autoPlay)}
                className={`py-1.5 px-4 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                  autoPlay ? 'bg-amber-600 text-white hover:bg-amber-500' : 'bg-indigo-600 text-white hover:bg-indigo-750 shadow-sm'
                }`}
                id="sim-play-btn"
              >
                {autoPlay ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                {autoPlay ? "Pause Auto" : "Auto Play (2.5s)"}
              </button>

              <button
                onClick={handleNext}
                disabled={currentStepIdx === activeScenario.steps.length - 1}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-750 disabled:opacity-30 disabled:cursor-not-allowed transition"
                title="Next Step"
                id="sim-next-btn"
              >
                <SkipForward className="w-4 h-4" />
              </button>

              <button
                onClick={handleReset}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:bg-slate-750 transition"
                title="Restart Simulation"
                id="sim-reset-btn"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Explanation Banner */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              💡 Current State: {currentStep.title}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">{currentStep.description}</p>
          </div>
        </div>

        {/* Runtime Viz Core on Right */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Call Stack Element */}
            <div className="bg-slate-950 rounded-lg p-3.5 border border-slate-800 flex flex-col h-[200px]">
              <span className="text-[10px] font-bold text-pink-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" /> Call Stack (LIFO)
              </span>
              <div className="flex-1 flex flex-col justify-end gap-1.5 border border-dashed border-slate-800 p-2 rounded-md bg-slate-900/50">
                {currentStep.stack.length === 0 ? (
                  <div className="text-[10px] text-slate-500 text-center py-8 italic flex-1 flex items-center justify-center">
                    Call Stack is Empty
                  </div>
                ) : (
                  currentStep.stack.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-gradient-to-r from-pink-500/20 to-pink-600/30 text-pink-300 border border-pink-500/40 py-1.5 px-3 rounded-md text-xs font-mono font-semibold animate-fade-in flex items-center justify-between"
                    >
                      <span>{item}</span>
                      <span className="text-[8px] bg-pink-500/40 text-pink-200 px-1 rounded uppercase">
                        {idx === 0 ? 'Top Action' : 'Pending'}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Web API Element */}
            <div className="bg-slate-950 rounded-lg p-3.5 border border-slate-800 flex flex-col h-[200px]">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5" /> Web APIs (Async Threads)
              </span>
              <div className="flex-1 flex flex-col justify-center gap-1.5 border border-dashed border-slate-800 p-2 rounded-md bg-slate-900/50">
                {currentStep.webApi.length === 0 ? (
                  <div className="text-[10px] text-slate-500 text-center py-8 italic flex-1 flex items-center justify-center">
                    No active Web APIs (Sync Flow)
                  </div>
                ) : (
                  currentStep.webApi.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-amber-500/10 text-amber-300 border border-amber-500/30 py-2 px-3 rounded-md text-xs font-mono font-medium animate-pulse flex items-center justify-between"
                    >
                      <span className="text-[10px]">{item.name}</span>
                      <span className="text-[8px] bg-amber-505/30 px-1.5 py-0.5 rounded font-black">WAITING</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Microtask Queue (Promise .then) */}
            <div className="bg-slate-950 rounded-lg p-3.5 border border-slate-800 flex flex-col h-[180px]">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                ⚡ Microtask Queue (Promises, await)
              </span>
              <div className="flex-1 flex gap-2 overflow-x-auto items-center border border-dashed border-slate-800 p-2 rounded-md bg-slate-900/50">
                {currentStep.microtasks.length === 0 ? (
                  <div className="text-[10px] text-slate-500 text-center w-full italic">
                    Microtask Queue Empty
                  </div>
                ) : (
                  currentStep.microtasks.map((task, idx) => (
                    <div
                      key={idx}
                      className="bg-emerald-950/80 text-emerald-200 border border-emerald-500/50 py-2 px-3 rounded-md text-xs font-mono font-bold whitespace-nowrap min-w-[120px] text-center"
                    >
                      {task}
                      <div className="text-[8px] text-emerald-400 uppercase mt-1">Priority {idx+1}</div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Macrotask Queue (setTimeout) */}
            <div className="bg-slate-950 rounded-lg p-3.5 border border-slate-800 flex flex-col h-[180px]">
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                ⏰ Macrotask Queue (setTimeout, timers)
              </span>
              <div className="flex-1 flex gap-2 overflow-x-auto items-center border border-dashed border-slate-800 p-2 rounded-md bg-slate-900/50">
                {currentStep.macrotasks.length === 0 ? (
                  <div className="text-[10px] text-slate-500 text-center w-full italic">
                    Macrotask Queue Empty
                  </div>
                ) : (
                  currentStep.macrotasks.map((task, idx) => (
                    <div
                      key={idx}
                      className="bg-cyan-950/80 text-cyan-200 border border-cyan-500/50 py-2 px-3 rounded-md text-xs font-mono font-bold whitespace-nowrap min-w-[120px] text-center"
                    >
                      {task}
                      <div className="text-[8px] text-cyan-400 uppercase mt-1">Pending {idx+1}</div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* Console Output Screen */}
          <div className="bg-slate-950 rounded-lg border border-slate-800 p-3 flex flex-col flex-1 min-h-[140px]">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1"><Terminal className="w-3.5 h-3.5 text-cyan-400" /> Output Console</span>
              <span className="text-[9px] text-slate-550 italic">Updates live in micro-thread speed</span>
            </span>
            <div className="bg-slate-900 rounded border border-slate-800 p-3 font-mono text-xs flex-1 min-h-[80px] overflow-y-auto space-y-1">
              {currentStep.console.length === 0 ? (
                <span className="text-slate-600 block italic py-3">[No Console Logs Printed Yet]</span>
              ) : (
                currentStep.console.map((log, idx) => (
                  <div key={idx} className="flex gap-2">
                    <span className="select-none text-slate-650 font-bold">&gt;</span>
                    <span className="text-cyan-300 font-bold tracking-wide animate-fade-in">{log}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Golden Rule Tip */}
          <div className="bg-cyan-950/50 border border-cyan-800/40 rounded-lg p-3 flex gap-2">
            <AlertTriangle className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-cyan-200">
              <span className="font-bold block text-cyan-300 uppercase tracking-wider text-[10px] mb-0.5">Golden Rule of Event Loop questions:</span>
              Synchronous script executes first from top to bottom. Then, the microtask queue is emptied COMPLETELY. Lastly, ONE single Macrotask (setTimeout callback) runs, which may queue further microtasks. Repeat!
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
