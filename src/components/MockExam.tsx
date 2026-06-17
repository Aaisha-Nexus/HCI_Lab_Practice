import { useState, useEffect, useRef } from 'react';
import { Award, Clock, BookOpen, AlertCircle, RefreshCw, CheckCircle2, ChevronRight, HelpCircle } from 'lucide-react';

interface ExamQuestion {
  id: string;
  category: string;
  question: string;
  codeSnippet?: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export default function MockExam() {
  const questions: ExamQuestion[] = [
    {
      id: 'eq-1',
      category: 'JS-Basics',
      question: 'Which console.log order is correct for the following arrow callback execution?',
      codeSnippet: `console.log("A");
const process = (cb) => {
  console.log("B");
  cb();
};
process(() => console.log("C"));
console.log("D");`,
      options: [
        'A -> B -> C -> D',
        'A -> B -> D -> C',
        'A -> C -> B -> D',
        'B -> A -> C -> D'
      ],
      correctOptionIndex: 0,
      explanation: 'Since there are no asynchronous functions (no setTimeout or Promise), execution flows strictly in order. A logs synchronously -> process() is called -> logging B -> runs wrapper cb() showing C -> finishes process() -> D logs last.',
    },
    {
      id: 'eq-2',
      category: 'JS-Runtime',
      question: 'Week 15 Q1: What is the exact output trace trace order of this Promise vs setTimeout setup?',
      codeSnippet: `console.log("1");
setTimeout(() => console.log("2"), 10);
Promise.resolve().then(() => console.log("3"));
setTimeout(() => console.log("4"), 0);
new Promise((res) => {
  console.log("5");
  res();
}).then(() => console.log("6"));
console.log("7");`,
      options: [
        '1, 5, 7, 3, 6, 4, 2',
        '1, 3, 5, 6, 7, 4, 2',
        '1, 5, 7, 4, 3, 6, 2',
        '1, 7, 5, 3, 6, 2, 4'
      ],
      correctOptionIndex: 0,
      explanation: '1. "1" output logs synchronously. \n2. setTimeout(2) is queued for 10ms. \n3. Promise.then(3) is scheduled to the Microtask Queue. \n4. setTimeout(4) is queued for 0ms. \n5. The new Promise executor executes synchronously - immediate output of "5". Res() schedules nested .then(6) to the Microtask Queue. \n6. "7" logs synchronously. \n7. Synchronous thread finishes! Drain Microtask Queue: logs "3" then "6". \n8. Microtasks empty. Fetch Macrotasks: first runs 0ms timer "4", then 10ms timer "2". Output: 1, 5, 7, 3, 6, 4, 2.',
    },
    {
      id: 'eq-3',
      category: 'Performance',
      question: 'A debounce function with a 400ms delay protects a searchable text input. The user types "H", "C", "I" with exactly 150ms of delay separating each keypress. How many times does the search function actually fire?',
      options: [
        '3 times (once for each character)',
        '1 time, exactly 400ms after "I" is entered',
        '1 time, exactly 550ms after "H" is entered',
        '0 times because keys are typed too quickly'
      ],
      correctOptionIndex: 1,
      explanation: 'Since the typing interval (150ms) is less than the debounce delay (400ms), each subsequent keypress cancels the previous pending timer before it can fire. The callback executes exactly once, 400ms after the last input ("I").',
    },
    {
      id: 'eq-4',
      category: 'Performance',
      question: 'A throttled click listener (interval limit = 800ms) is attached to a buy button. The user clicks it rapid-fire at 0ms, 200ms, 500ms, 900ms. Which click times successfully fire?',
      options: [
        'All 4 clicks successfully execute since throttle does not discard inputs',
        '0ms and 900ms',
        '0ms only',
        '0ms and 505ms'
      ],
      correctOptionIndex: 1,
      explanation: 'Throttling allows execution immediately on the first trigger (0ms) and starts an 800ms lock window. The clicks at 200ms and 500ms are discarded during active lock. After 800ms the lock releases. So the subsequent click at 900ms successfully triggers!',
    },
    {
      id: 'eq-5',
      category: 'React-Basics',
      question: 'Choose the syntax statement below that represents a correct, valid JSX nesting sequence.',
      codeSnippet: `// Option A: 
const El = () => <input type="text">;

// Option B: 
const El = () => <div><h1>Hello</h1><p>World</p></div>;

// Option C: 
const El = () => <div class="card">Hello</div>;`,
      options: [
        'Option A is correct (unclosed inputs are allowed)',
        'Option B is correct (capital tags and closed wrapper are valid)',
        'Option C is correct (uses class instead of className)',
        'None of options represent standard JSX syntax'
      ],
      correctOptionIndex: 1,
      explanation: 'Option B is perfectly valid because it wraps sibling components in a singular root `<div>`, and utilizes standard standard lowercase for host tags. Option A fails because input elements MUST be self-closing `<input />` in JSX. Option C fails because HTML elements must use `className` instead of `class`.',
    },
    {
      id: 'eq-6',
      category: 'React-Data',
      question: 'What is the standard, single source of truth method for modifying a component\'s state in React?',
      options: [
        'Direct reassignment (e.g. state = newValue)',
        'Passing newValue via component props',
        'Calling the setter function returned by the useState hook (e.g. setState(newValue))',
        'Modifying the local global session storage directly'
      ],
      correctOptionIndex: 2,
      explanation: 'Calling the setter variable function returned by the index `useState` hook is the only way React detects state changes and registers immediate layout re-render queue updates.',
    },
    {
      id: 'eq-7',
      category: 'React-Hooks',
      question: 'A student creates a component that fetches grades from an API, writing the following code. What is the execution behavior?',
      codeSnippet: `function Grades() {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch('/api/grades')
      .then(r => r.json())
      .then(arr => setData(arr));
  }); // Unassigned dependency block!
  return <div>Grades list height: {data.length}</div>;
}`,
      options: [
        'It loads grades once and works perfectly.',
        'It causes an infinite loop of network requests leading to page crash.',
        'It fails to render because useEffect cannot access setData.',
        'It runs on unmount only.'
      ],
      correctOptionIndex: 1,
      explanation: 'Because useEffect lacks a dependency array, it executes on EVERY SINGLE RENDER. Inside, setData updates state, which triggers a re-render, which fires the effect again, restarting the fetch infinitely, triggering severe rate limits or page crashes. It must be written: `}, [])` to run once on mount.',
    },
    {
      id: 'eq-8',
      category: 'React-Hooks',
      question: 'Which useEffect template demonstrates code execution strictly when the component leaf leaves the screen (unmounts)?',
      options: [
        'useEffect(() => { console.log("cleanup"); }, []);',
        'useEffect(() => { return () => { console.log("cleanup"); }; }, []);',
        'useEffect(() => { console.log("cleanup"); });',
        'useEffect(() => { return () => { console.log("cleanup"); }; }, [dependencies]);'
      ],
      correctOptionIndex: 1,
      explanation: 'To handle unmounting exclusively, return a cleanup function from an effect that has an EMPTY dependency array `[]`. This return function executes only once when the component is being removed from the DOM.',
    }
  ];

  const [activeIdx, setActiveIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Countdown timer effect
  useEffect(() => {
    if (isTimerRunning && timeLeft > 0 && !examSubmitted) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (timeLeft === 0 && !examSubmitted) {
      handleSubmitExam();
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timeLeft, isTimerRunning, examSubmitted]);

  const handleSelectOption = (questionId: string, optionIdx: number) => {
    if (examSubmitted) return;
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionIdx }));
  };

  const handleSubmitExam = () => {
    setIsTimerRunning(false);
    setExamSubmitted(true);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctOptionIndex) {
        score += 1;
      }
    });
    return score;
  };

  const handleResetExam = () => {
    setSelectedAnswers({});
    setExamSubmitted(false);
    setTimeLeft(600);
    setIsTimerRunning(true);
    setActiveIdx(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const activeQuestion = questions[activeIdx];
  const score = calculateScore();
  const passingScore = 5; // out of 8
  const isPassed = score >= passingScore;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6 text-slate-900" id="mock-exam-container" style={{ display: 'flex', flexDirection: 'column' }}>
      
      {/* Header section with Timer */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 pb-4 gap-4">
        <div>
          <h3 className="text-lg font-extrabold text-indigo-600 flex items-center gap-2 font-display">
            <BookOpen className="w-5 h-5 text-indigo-650" />
            HCI Lab Exam Assessment Simulator
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed font-sans">Pencil down simulation targeting Lab 14 + 15 critical multiple choice theory and rendering outputs.</p>
        </div>

        {/* Live Timer */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 flex items-center gap-2 font-mono shadow-inner">
            <Clock className={`w-4 h-4 ${timeLeft < 120 ? 'text-rose-500 animate-pulse' : 'text-slate-400'}`} />
            <span className={`text-xs font-bold ${timeLeft < 120 ? 'text-rose-600 font-extrabold' : 'text-slate-600'}`}>
              {examSubmitted ? "EXAM SUBMITTED" : `Time Remaining: ${formatTime(timeLeft)}`}
            </span>
          </div>

          {examSubmitted && (
            <button
              onClick={handleResetExam}
              className="py-2 px-3 text-xs font-bold rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 transition flex items-center gap-1.5 shadow-sm"
              id="restart-exam-btn"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Restart Exam
            </button>
          )}
        </div>
      </div>

      {examSubmitted ? (
        /* Scorecard Report layout */
        <div className="space-y-6 animate-fade-in" id="exam-grading-scorecard">
          <div className={`p-6 rounded-2xl text-center space-y-3 ${
            isPassed 
              ? 'bg-emerald-50 border border-emerald-250 text-emerald-800' 
              : 'bg-rose-50 border border-rose-250 text-rose-800'
          }`}>
            <Award className={`w-12 h-12 mx-auto ${isPassed ? 'text-emerald-600' : 'text-rose-600'}`} />
            <div>
              <h4 className="text-lg font-black uppercase tracking-wider">
                {isPassed ? 'Passed Study Simulation!' : 'Incomplete Grading Marks'}
              </h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                {isPassed 
                  ? 'Fantastic work! You have configured correct operations and cleared this mock session. Look through specific explanations below.'
                  : 'Requires reviewing slides. Study JavaScript asynchronous event sequences and useEffect rendering boundaries and try again.'}
              </p>
            </div>
            
            <div className="inline-block bg-white border border-slate-205 py-2.5 px-6 rounded-full font-mono text-sm font-bold mt-2 text-slate-800 shadow-sm">
              Score: <strong className={isPassed ? "text-emerald-600" : "text-rose-600"}>{score}</strong> / {questions.length} ({Math.round((score / questions.length) * 100)}%)
            </div>
          </div>

          {/* Solution detailed walkthrough cards */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-widest text-slate-400">Detailed Solutions Breakdown</h4>
            
            {questions.map((q, idx) => {
              const userAnswerIdx = selectedAnswers[q.id];
              const isCorrectRow = userAnswerIdx === q.correctOptionIndex;

              return (
                <div key={q.id} className="bg-slate-950 p-5 rounded-lg border border-slate-850 space-y-3.5">
                  <div className="flex justify-between items-start gap-4">
                    <span className="text-xs font-bold text-slate-450 uppercase font-mono tracking-widest">
                      Question {idx + 1} ({q.category})
                    </span>
                    <span className={`py-1 px-2.5 rounded text-[10px] font-bold ${
                      isCorrectRow 
                        ? 'bg-emerald-955/40 text-emerald-300 border border-emerald-800' 
                        : 'bg-rose-955/40 text-rose-300 border border-rose-800'
                    }`}>
                      {isCorrectRow ? 'CORRECT' : 'WRONG'}
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-slate-200">{q.question}</p>

                  {/* Optional code snippet */}
                  {q.codeSnippet && (
                    <pre className="bg-slate-900 p-3 rounded text-xs px-4 border border-slate-800 font-mono text-cyan-300 overflow-x-auto leading-relaxed">
                      {q.codeSnippet}
                    </pre>
                  )}

                  {/* Selected option vs correct highlight */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
                      <span className="text-[10px] text-slate-500 block">YOUR SUBMISSION:</span>
                      <strong className={isCorrectRow ? "text-emerald-400" : "text-rose-400"}>
                        {userAnswerIdx === undefined ? '[Unanswered]' : q.options[userAnswerIdx]}
                      </strong>
                    </div>
                    <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
                      <span className="text-[10px] text-slate-555 block">CORRECT ANSWER ANSWERKEY:</span>
                      <strong className="text-emerald-400">{q.options[q.correctOptionIndex]}</strong>
                    </div>
                  </div>

                  {/* Academic explanation */}
                  <div className="bg-cyan-950/20 p-3 rounded.lg border border-cyan-850/60 text-xs text-cyan-300 leading-relaxed font-sans">
                    <strong>Theory Explanation:</strong> {q.explanation}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      ) : (
        /* Active test taking environment view */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          
          {/* Question selection sidebar */}
          <div className="lg:col-span-1 space-y-2.5">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold block mb-1">Index Tracker</span>
            <div className="grid grid-cols-4 gap-2">
              {questions.map((q, idx) => {
                const isSelected = selectedAnswers[q.id] !== undefined;
                return (
                  <button
                    key={q.id}
                    onClick={() => setActiveIdx(idx)}
                    className={`h-11 rounded-xl text-xs font-bold transition flex flex-col justify-center items-center relative ${
                      activeIdx === idx 
                        ? 'bg-indigo-600 text-white border border-indigo-500 shadow-sm font-black' 
                        : isSelected 
                        ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' 
                        : 'bg-slate-100 border border-slate-200/60 text-slate-500 hover:bg-slate-200/60'
                    }`}
                    id={`exam-idx-selector-${idx}`}
                  >
                    <span>Q{idx + 1}</span>
                    {isSelected && (
                      <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    )}
                  </button>
                );
              })}
            </div>
 
            <div className="bg-slate-50 p-4 border border-slate-200 rounded-2xl text-xs text-slate-600 leading-relaxed space-y-2 shadow-sm">
              <span className="font-extrabold text-slate-700 block">Assessment Guideline:</span>
              <p>Once you fill answers for all 8 core questions, press the button below to request auto-execution grading.</p>
              
              <button
                onClick={handleSubmitExam}
                className="w-full mt-2 font-bold text-xs uppercase bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-xl shadow-md transition flex items-center justify-center gap-1.5"
                id="submit-exam-btn"
              >
                Submit Exam Sheet
              </button>
            </div>
          </div>
 
          {/* Active Question workspace rendering */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 flex flex-col justify-between min-h-[360px] shadow-sm">
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-1 rounded-xl font-mono font-bold uppercase text-[9px] tracking-wider">
                  {activeQuestion.category}
                </span>
                <span className="text-slate-400 font-bold">
                  Question {activeIdx + 1} of {questions.length}
                </span>
              </div>

              <h4 className="text-sm font-extrabold text-slate-800 leading-snug">{activeQuestion.question}</h4>

              {/* Dynamic code blocks */}
              {activeQuestion.codeSnippet && (
                <pre className="bg-slate-50 border border-slate-200/60 p-4 rounded-xl text-xs font-mono text-slate-805 leading-relaxed overflow-x-auto select-all shadow-inner">
                  {activeQuestion.codeSnippet}
                </pre>
              )}

              {/* Multiple choice options */}
              <div className="space-y-2.5 pt-2">
                {activeQuestion.options.map((option, idx) => {
                  const isChecked = selectedAnswers[activeQuestion.id] === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(activeQuestion.id, idx)}
                      className={`w-full py-3.5 px-4 rounded-xl border text-left text-xs transition flex items-center gap-3 ${
                        isChecked 
                          ? 'bg-indigo-50/60 border-indigo-500 text-indigo-900 font-bold shadow-sm' 
                          : 'bg-white border-slate-200 text-slate-705 hover:bg-slate-50 hover:border-slate-300'
                      }`}
                      id={`opt-btn-${idx}`}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        isChecked ? 'border-indigo-600 bg-indigo-50/10' : 'border-slate-300'
                      }`}>
                        {isChecked && <div className="w-2 h-2 rounded-full bg-indigo-650 animate-scale-in"></div>}
                      </div>
                      <span className="leading-relaxed">{option}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom navigation selectors */}
            <div className="flex justify-between pt-5 border-t border-slate-100 mt-6">
              <button
                onClick={() => setActiveIdx(prev => Math.max(0, prev - 1))}
                disabled={activeIdx === 0}
                className="py-2 px-4 rounded-xl text-xs bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition font-bold shadow-sm"
                id="exam-prev-btn"
              >
                Previous
              </button>
              
              <button
                onClick={() => {
                  if (activeIdx < questions.length - 1) {
                    setActiveIdx(prev => prev + 1);
                  } else {
                    handleSubmitExam();
                  }
                }}
                className="py-2 px-5 rounded-xl text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold shadow-md transition flex items-center gap-1"
                id="exam-next-btn"
              >
                <span>{activeIdx === questions.length - 1 ? "Submit Sheet" : "Next Question"}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
