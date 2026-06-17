import { useState } from 'react';
import { Table, CheckCircle2, AlertCircle, HelpCircle, GraduationCap } from 'lucide-react';

interface RowAnswer {
  snippet: string;
  category: string;
  role: string;
  correctCategory: string;
  correctRole: string;
  explanation: string;
}

export default function CodeIdentificationPuzzle() {
  const initialRows: RowAnswer[] = [
    {
      snippet: "const [mode, setMode] = useState('cool')",
      category: "",
      role: "",
      correctCategory: "React Hook Initialization",
      correctRole: "Declares state variable and its matching updater method with default value 'cool'",
      explanation: "useState is a React composite Hook. It returns a state variable and a setter function, destructured in array syntax."
    },
    {
      snippet: "dependency: [mode]",
      category: "",
      role: "",
      correctCategory: "useEffect Dependency Array",
      correctRole: "Restricts hook execution, re-firing the effect callback *only* when 'mode' changes",
      explanation: "The values placed inside [] represent dependencies. Changes trigger re-renders, while leaving [] empty runs the side effect on mount only."
    },
    {
      snippet: "e.target.value",
      category: "",
      role: "",
      correctCategory: "Native DOM Event Access",
      correctRole: "Directly accesses the typed text content from the keyboard event target",
      explanation: "The 'e' object is an Event. target points to the HTML input element, and target.value yields its current character string."
    },
    {
      snippet: "() => setMode('warm')",
      category: "",
      role: "",
      correctCategory: "Arrow Callback Reference",
      correctRole: "Wraps state update function to avoid immediate execution during script parsing",
      explanation: "Wrapping execution inside `() => ...` returns a fresh functional reference that only runs when the onClick event occurs."
    },
    {
      snippet: "mode === 'cool' ? '#00f' : '#ff0'",
      category: "",
      role: "",
      correctCategory: "Ternary Operator (Expression)",
      correctRole: "Evaluates inline conditional styling or layout values on single-line blocks",
      explanation: "The ternary operator (`condition ? truthy : falsy`) is a concise alternative to traditional if/else blocks, usable directly inside returns."
    },
    {
      snippet: "let count = 0;",
      category: "",
      role: "",
      correctCategory: "Block-Scoped Variable",
      correctRole: "Provides local mutable variable bound exclusively to the enclosing curly-bracket scope",
      explanation: "Unlike var (which leaks out and has function-scope), 'let' is block-scoped, meaning it respects block curly braces."
    },
    {
      snippet: "defaultMode || 'cool'",
      category: "",
      role: "",
      correctCategory: "Logical OR Operator",
      correctRole: "Provides a reliable default fallback value if the left expression evaluates to falsy",
      explanation: "The logical '||' returns the right-hand operand if the left operand is falsy (like null, undefined, empty string)."
    }
  ];

  const uniqueCategories = [
    "React Hook Initialization",
    "useEffect Dependency Array",
    "Native DOM Event Access",
    "Arrow Callback Reference",
    "Ternary Operator (Expression)",
    "Block-Scoped Variable",
    "Logical OR Operator"
  ];

  const uniqueRoles = [
    "Declares state variable and its matching updater method with default value 'cool'",
    "Restricts hook execution, re-firing the effect callback *only* when 'mode' changes",
    "Directly accesses the typed text content from the keyboard event target",
    "Wraps state update function to avoid immediate execution during script parsing",
    "Evaluates inline conditional styling or layout values on single-line blocks",
    "Provides local mutable variable bound exclusively to the enclosing curly-bracket scope",
    "Provides a reliable default fallback value if the left expression evaluates to falsy"
  ];

  const [rows, setRows] = useState<RowAnswer[]>(initialRows);
  const [showSolutions, setShowSolutions] = useState(false);

  const handleCategoryChange = (index: number, value: string) => {
    setRows(prev => prev.map((row, idx) => idx === index ? { ...row, category: value } : row));
  };

  const handleRoleChange = (index: number, value: string) => {
    setRows(prev => prev.map((row, idx) => idx === index ? { ...row, role: value } : row));
  };

  const handleReset = () => {
    setRows(initialRows);
    setShowSolutions(false);
  };

  // Check how many are fully perfect
  const correctCount = rows.filter(r => r.category === r.correctCategory && r.role === r.correctRole).length;
  const isPerfect = correctCount === rows.length;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6 text-slate-900" id="identification-puzzle-root">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-lg font-extrabold text-indigo-600 flex items-center gap-2 font-display">
            <GraduationCap className="w-5 h-5 text-indigo-600 animate-bounce" />
            Topic 10: Code Identification Table Game
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed font-sans">Match active code lines to their formal HCI structural terminology and runtime behaviors.</p>
        </div>
        
        <div className="flex gap-2 mt-4 md:mt-0 font-bold">
          <button
            onClick={() => setShowSolutions(!showSolutions)}
            className="text-xs font-bold py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-650 hover:bg-slate-100 transition shadow-sm"
            id="toggle-sol-btn"
          >
            {showSolutions ? "Hide Answers" : "Show Answers"}
          </button>
          <button
            onClick={handleReset}
            className="text-xs font-bold py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition shadow-md"
            id="reset-puzzle-btn"
          >
            Reset Game
          </button>
        </div>
      </div>

      <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl text-xs leading-relaxed text-slate-600 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <span>Instructions: Parse each code snippet. Select its precise <strong>Construct Category</strong> and <strong>Operational Role</strong> from the dropdown lists of choices options.</span>
        <div className="bg-white border border-slate-200 rounded-lg py-1 px-3 text-center text-slate-705 font-bold whitespace-nowrap self-start shadow-sm">
          Completed: <strong className="text-indigo-600">{correctCount} / {rows.length}</strong> Correct
        </div>
      </div>

      {isPerfect && (
        <div className="bg-emerald-50 border border-emerald-250 rounded-xl p-4 flex gap-3 items-center animate-fade-in shadow-sm">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
          <div className="text-xs text-emerald-800">
            <strong className="text-emerald-700 block uppercase font-bold text-[11px] tracking-wider mb-0.5">Perfect Match Score! 🎉</strong>
            You successfully registered every single identifier row. You possess a great mastery of Javascript compiler rules and React lifecycle hooks.
          </div>
        </div>
      )}

      {/* Grid of Identification puzzles */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-slate-400 font-bold">
              <th className="pb-3 pr-4">Active Code Snippet</th>
              <th className="pb-3 px-4">Construct Category</th>
              <th className="pb-3 px-4">Operational Role</th>
              <th className="pb-3 pl-4">Feedback</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row, idx) => {
              const categoryMatch = row.category === row.correctCategory;
              const roleMatch = row.role === row.correctRole;
              const isRowCorrect = categoryMatch && roleMatch;

              return (
                <tr key={idx} className="hover:bg-slate-50/50 transition">
                  {/* Code snippet block */}
                  <td className="py-4 pr-4 font-mono font-bold text-indigo-700 whitespace-nowrap">
                    <span className="bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 block shadow-inner text-[11px] text-slate-800 font-semibold">
                      {row.snippet}
                    </span>
                  </td>

                  {/* Construct Category selector */}
                  <td className="py-4 px-3 min-w-[200px]">
                    <select
                      value={row.category}
                      onChange={(e) => handleCategoryChange(idx, e.target.value)}
                      className={`w-full bg-white text-xs py-1.5 px-3 rounded-xl outline-none border focus:border-indigo-600 focus:ring-1 focus:ring-indigo-500 shadow-sm transition font-medium ${
                        showSolutions 
                          ? 'border-emerald-600 text-emerald-700 font-bold' 
                          : row.category === "" 
                          ? 'border-slate-200 text-slate-400' 
                          : categoryMatch 
                          ? 'border-emerald-600 text-emerald-700 font-bold' 
                          : 'border-rose-450 text-rose-700 font-bold bg-rose-50/30'
                      }`}
                      id={`puzzle-category-select-${idx}`}
                    >
                      <option value="">-- Choose Category --</option>
                      {uniqueCategories.map((cat, i) => (
                        <option key={i} value={cat}>{cat}</option>
                      ))}
                    </select>
                    {showSolutions && (
                      <span className="text-[10px] text-emerald-600 block mt-1 font-semibold">
                        Sol: {row.correctCategory}
                      </span>
                    )}
                  </td>

                  {/* Operational Role selector */}
                  <td className="py-4 px-3 min-w-[260px]">
                    <select
                      value={row.role}
                      onChange={(e) => handleRoleChange(idx, e.target.value)}
                      className={`w-full bg-white text-xs py-1.5 px-3 rounded-xl outline-none border focus:border-indigo-600 focus:ring-1 focus:ring-indigo-500 shadow-sm transition font-medium ${
                        showSolutions 
                          ? 'border-emerald-600 text-emerald-700 font-bold'
                          : row.role === "" 
                          ? 'border-slate-200 text-slate-400' 
                          : roleMatch 
                          ? 'border-emerald-600 text-emerald-700 font-bold' 
                          : 'border-rose-450 text-rose-700 font-bold bg-rose-50/30'
                      }`}
                      id={`puzzle-role-select-${idx}`}
                    >
                      <option value="">-- Choose Role --</option>
                      {uniqueRoles.map((role, i) => (
                        <option key={i} value={role}>{role}</option>
                      ))}
                    </select>
                    {showSolutions && (
                      <span className="text-[10px] text-emerald-600 block mt-1 leading-tight font-semibold">
                        Sol: {row.correctRole}
                      </span>
                    )}
                  </td>

                  {/* Status Indicator & Explanation */}
                  <td className="py-4 pl-4 whitespace-nowrap">
                    {isRowCorrect ? (
                      <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Match!</span>
                      </div>
                    ) : (row.category !== "" || row.role !== "") ? (
                      <div className="flex items-center gap-1.5 text-rose-400">
                        <AlertCircle className="w-4 h-4 text-rose-450" />
                        <span>Keep matching...</span>
                      </div>
                    ) : (
                      <span className="text-slate-600">-</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Explanations dropdown of cards */}
      <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-3">
        <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
          <GraduationCap className="w-4 h-4" /> Explanation Reference Guide
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {rows.map((row, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-850 p-3 rounded space-y-1.5 text-[11px] leading-relaxed">
              <code className="text-cyan-300 font-bold block bg-slate-950 py-0.5 px-1 rounded truncate text-center">{row.snippet}</code>
              <p className="text-slate-400">{row.explanation}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
