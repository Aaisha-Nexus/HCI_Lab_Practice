import { useState } from 'react';
import { ArrowRight, HelpCircle, Terminal, Play, CheckCircle2, Award } from 'lucide-react';

interface MethodPreset {
  name: string;
  method: 'map' | 'filter' | 'reduce' | 'join' | 'chunk';
  callbackCode: string;
  description: string;
  initialArray: number[];
  solution: string;
}

export default function ArrayPlayground() {
  const presets: MethodPreset[] = [
    {
      name: "Map: Square all values",
      method: "map",
      callbackCode: "num => num * num",
      description: "Applies a squaring transformation. Note how we receive a new array of identical length.",
      initialArray: [1, 2, 3, 4, 5],
      solution: "[1, 4, 9, 16, 25]"
    },
    {
      name: "Filter: Evens ONLY",
      method: "filter",
      callbackCode: "num => num % 2 === 0",
      description: "Prunes values where the check evaluates to false, returning a new filtered array listing matches.",
      initialArray: [14, 15, 22, 9, 30, 41],
      solution: "[14, 22, 30]"
    },
    {
      name: "Reduce: Accumulate sum",
      method: "reduce",
      callbackCode: "(acc, num) => acc + num, 0",
      description: "Folds the array down into a singular total. Starts with initial value of 0, iteratively adding numbers.",
      initialArray: [10, 20, 30, 40],
      solution: "100"
    },
    {
      name: "Join: Hyphenated dashes",
      method: "join",
      callbackCode: "'-'",
      description: "Renders elements concatenated as a unified string separated by dashes.",
      initialArray: [2026, 6, 17],
      solution: '"2026-6-17"'
    },
    {
      name: "Practice Chunking: Size 2",
      method: "chunk",
      callbackCode: "chunkSize = 2",
      description: "Splits an plain flat array into subgroups of maximum length 2. Essential mock coding question topic!",
      initialArray: [1, 2, 3, 4, 5],
      solution: "[[1, 2], [3, 4], [5]]"
    }
  ];

  const [activePresetIdx, setActivePresetIdx] = useState(0);
  const activePreset = presets[activePresetIdx];
  const [userGuess, setUserGuess] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showTrace, setShowTrace] = useState(false);

  const handleRunAndCheck = () => {
    setIsChecked(true);
    // basic cleanup matching formatting (whitespace, quotes, braces)
    const cleanGuess = userGuess.trim().replace(/\s+/g, '');
    const cleanSol = activePreset.solution.trim().replace(/\s+/g, '');
    setIsCorrect(cleanGuess === cleanSol);
  };

  const handleSelectPreset = (idx: number) => {
    setActivePresetIdx(idx);
    setUserGuess('');
    setIsChecked(false);
    setIsCorrect(false);
    setShowTrace(false);
  };

  // Helper mock tracer to visualize loops
  const renderTracerOutput = () => {
    const list = activePreset.initialArray;
    switch (activePreset.method) {
      case 'map':
        return (
          <div className="space-y-1.5 font-mono text-xs text-cyan-300">
            {list.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-slate-500">Step {idx+1}:</span>
                <span>Value {item}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                <span>{item} * {item} = <strong className="text-emerald-400 font-bold">{item * item}</strong></span>
              </div>
            ))}
          </div>
        );
      case 'filter':
        return (
          <div className="space-y-1.5 font-mono text-xs text-cyan-300">
            {list.map((item, idx) => {
              const passed = item % 2 === 0;
              return (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-slate-500">Step {idx+1}:</span>
                  <span>{item} % 2 === 0</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                  <span className={passed ? "text-emerald-400 font-bold" : "text-rose-400"}>
                    {passed ? "TRUE (Keep)" : "FALSE (Discard)"}
                  </span>
                </div>
              );
            })}
          </div>
        );
      case 'reduce':
        let currentSum = 0;
        return (
          <div className="space-y-1.5 font-mono text-xs text-cyan-300">
            <div className="text-slate-500">Seed Accumulator: acc = 0</div>
            {list.map((item, idx) => {
              const prev = currentSum;
              currentSum += item;
              return (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-slate-500">Step {idx+1}:</span>
                  <span>acc ({prev}) + val ({item})</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                  <span>New acc = <strong className="text-emerald-400 font-bold">{currentSum}</strong></span>
                </div>
              );
            })}
          </div>
        );
      case 'join':
        return (
          <div className="space-y-1.5 font-mono text-xs text-cyan-300">
            <div className="text-slate-500">Merge array nodes with delimiter &quot;-&quot;</div>
            <div className="flex gap-1.5 items-center">
              <span>Renders:</span>
              <span className="bg-slate-900 border border-slate-800 py-1 px-3.5 rounded text-emerald-400 font-bold">
                {list.join('-')}
              </span>
            </div>
          </div>
        );
      case 'chunk':
        return (
          <div className="space-y-1.5 font-mono text-xs text-cyan-300">
            <div className="text-slate-500">Chunk size = 2 (Splitting loops of i += 2)</div>
            <div className="space-y-1 pl-2">
              <div>Iteration 1 (i = 0): slice(0, 2) <ArrowRight className="w-3 h-3 inline text-slate-550" /> [1, 2]</div>
              <div>Iteration 2 (i = 2): slice(2, 4) <ArrowRight className="w-3 h-3 inline text-slate-550" /> [3, 4]</div>
              <div>Iteration 3 (i = 4): slice(4, 6) <ArrowRight className="w-3 h-3 inline text-slate-550" /> [5]</div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm" id="array-playground-container">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 pb-4 mb-6">
        <div>
          <h3 className="text-lg font-extrabold text-indigo-600 flex items-center gap-2 font-display">
            <Terminal className="w-5 h-5 text-indigo-650" />
            Array Pipeline &amp; Chunking Sandbox
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed font-sans">Trace array indices, mutable transforms, slice mechanisms, and aggregate closures.</p>
        </div>

        {/* List of tabs */}
        <div className="flex flex-wrap gap-1.5 mt-3 md:mt-0">
          {presets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectPreset(idx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activePresetIdx === idx
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-650 hover:bg-slate-200 hover:text-slate-900 border border-slate-200/60'
              }`}
              id={`preset-btn-${idx}`}
            >
              {preset.method.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Side: Array display and input */}
        <div className="md:col-span-6 space-y-4">
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 shadow-inner space-y-4">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider mb-2">Original Array</span>
              <div className="flex gap-2">
                {activePreset.initialArray.map((val, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-xl bg-white border border-slate-205 text-indigo-600 font-extrabold flex items-center justify-center font-mono hover:border-indigo-500 hover:text-indigo-700 transition shadow-sm"
                  >
                    {val}
                  </div>
                ))}
              </div>
            </div>

            {/* Simulated pipeline Code block */}
            <div className="bg-slate-900 p-4 rounded-md border border-slate-800 font-mono text-xs space-y-1.5">
              <div className="text-slate-500">// Run array operation:</div>
              <div className="text-slate-100 font-bold">
                const result = [<span className="text-cyan-300">{activePreset.initialArray.join(', ')}</span>]
              </div>
              <div className="text-purple-400 font-bold pl-4">
                .{activePreset.method}(
                <span className="text-emerald-300">{activePreset.callbackCode}</span>);
              </div>
              <div className="text-slate-500 mt-2">// What is the value of result?</div>
            </div>

            {/* Answer Input */}
            <div className="space-y-2">
              <label className="text-xs text-slate-500 block font-bold">Type your predicted output:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={userGuess}
                  onChange={(e) => {
                    setUserGuess(e.target.value);
                    setIsChecked(false);
                  }}
                  placeholder='e.g. [1, 4, 9] or "2-3-4" or 45'
                  className="bg-white border border-slate-200 rounded-xl text-xs py-2.5 px-4 focus:outline-none focus:border-indigo-500 font-mono flex-1 text-slate-800 shadow-sm"
                  id="array-guess-input"
                />
                <button
                  onClick={handleRunAndCheck}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl px-5 text-xs shadow-md transition flex items-center gap-1.5"
                  id="array-playground-run-btn"
                >
                  <Play className="w-3.5 h-3.5 fill-current" /> Run Code
                </button>
              </div>
            </div>

            {/* Result feedback */}
            {isChecked && (
              <div className={`p-4 rounded-xl flex items-start gap-2.5 animate-fade-in ${
                isCorrect 
                  ? 'bg-emerald-50 border border-emerald-250 text-emerald-800' 
                  : 'bg-rose-50 border border-rose-250 text-rose-800'
              }`}>
                {isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                ) : (
                  <HelpCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                )}
                <div>
                  <span className="font-extrabold block text-xs uppercase tracking-wider">
                    {isCorrect ? 'Correct Execution!' : 'Tracing Error'}
                  </span>
                  <p className="text-xs mt-1 font-sans">
                    {isCorrect 
                      ? 'Excellent. You tracked the indexes, loop callbacks, and output array correctly!' 
                      : `Check again. Expected solution matches: ${activePreset.solution}`}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Step-by-Step loop visualization */}
        <div className="md:col-span-6 bg-white rounded-2xl p-5 border border-slate-200 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Loop Execution Tracer
              </span>
              <button
                onClick={() => setShowTrace(!showTrace)}
                className="text-xs text-indigo-600 bg-indigo-50/80 border border-indigo-100 rounded-xl px-3 py-1.5 font-bold hover:bg-indigo-100 transition-colors"
                id="toggle-trace-btn"
              >
                {showTrace ? "Hide trace detail" : "Reveal detailed iteration stack"}
              </button>
            </div>

            <p className="text-xs text-slate-550 leading-relaxed mb-4">
              {activePreset.description}
            </p>

            {showTrace ? (
              <div className="bg-slate-900 p-4 border border-slate-800 rounded-xl space-y-2 animate-fade-in mb-4">
                <span className="text-[10px] text-slate-450 uppercase tracking-widest font-mono block font-bold">Active Threads:</span>
                {renderTracerOutput()}
              </div>
            ) : (
              <div className="h-28 bg-slate-50 border border-dashed border-slate-200 rounded-xl flex items-center justify-center p-4 text-center mb-4">
                <span className="text-xs text-slate-400 block italic">Click &quot;Reveal detailed iteration stack&quot; to see behind-the-scenes parameters parsed.</span>
              </div>
            )}
          </div>

          <div className="bg-amber-50/50 border border-amber-200/60 rounded-xl p-3.5 text-xs text-amber-900/80 flex gap-2">
            <Award className="text-amber-600 w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-800 block font-bold mb-0.5">HCI Lab Checklist Tip:</strong>
              Remember that map() and filter() NEVER edit the original array, but rather instantiate and return brand newly allocated array instances. Conversely, forEach() returns standard undefined.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
