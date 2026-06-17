import { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Layers, 
  Activity, 
  Terminal, 
  GraduationCap, 
  CheckCircle, 
  CheckCircle2, 
  Circle, 
  Info, 
  AlertTriangle,
  Award,
  ChevronRight,
  ShieldCheck,
  Zap,
  Cpu,
  BookmarkCheck
} from 'lucide-react';

import { topicsData } from './data/topicsData';
import EventLoopSimulator from './components/EventLoopSimulator';
import PerformanceVisualizer from './components/PerformanceVisualizer';
import ArrayPlayground from './components/ArrayPlayground';
import ReactDataInspector from './components/ReactDataInspector';
import CodeIdentificationPuzzle from './components/CodeIdentificationPuzzle';
import MockExam from './components/MockExam';

export default function App() {
  // Navigation Tabs: 'hub' (topic explorer), 'playgrounds', 'mock-exam', 'progress'
  const [activeMainTab, setActiveMainTab] = useState<'hub' | 'playgrounds' | 'mock-exam' | 'progress'>('hub');
  
  // Topic active indexes for the Study Hub
  const [activeTopicIdx, setActiveTopicIdx] = useState(0);
  
  // Track completed topics
  const [completedTopics, setCompletedTopics] = useState<string[]>([]);
  // Track completed quiz questions (stores: quizId -> electedOptionIdx)
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizChecked, setQuizChecked] = useState<Record<string, boolean>>({});

  // Active Sandbox inside playgrounds tab: 'event-loop' | 'perf' | 'array' | 'react' | 'table'
  const [activeSandbox, setActiveSandbox] = useState<'event-loop' | 'perf' | 'array' | 'react' | 'table'>('event-loop');

  // Load progress from localStorage on initial boot
  useEffect(() => {
    try {
      const storedCompletion = localStorage.getItem('hci_completed_topics');
      if (storedCompletion) {
        setCompletedTopics(JSON.parse(storedCompletion));
      }
      
      const storedQuizAnswers = localStorage.getItem('hci_quiz_answers');
      if (storedQuizAnswers) {
        setQuizAnswers(JSON.parse(storedQuizAnswers));
      }
    } catch (e) {
      console.warn("Could not retrieve localStorage values, fallback to local React state.", e);
    }
  }, []);

  // Save progress values
  const saveProgress = (newCompleted: string[]) => {
    setCompletedTopics(newCompleted);
    try {
      localStorage.setItem('hci_completed_topics', JSON.stringify(newCompleted));
    } catch (e) {
      console.error(e);
    }
  };

  const toggleTopicCompleted = (topicId: string) => {
    let next;
    if (completedTopics.includes(topicId)) {
      next = completedTopics.filter(id => id !== topicId);
    } else {
      next = [...completedTopics, topicId];
    }
    saveProgress(next);
  };

  const handleQuizAnswer = (quizId: string, optionIdx: number) => {
    const nextAnswers = { ...quizAnswers, [quizId]: optionIdx };
    setQuizAnswers(nextAnswers);
    try {
      localStorage.setItem('hci_quiz_answers', JSON.stringify(nextAnswers));
    } catch (e) {
      console.error(e);
    }
    // reset check state for that quiz
    setQuizChecked(prev => ({ ...prev, [quizId]: false }));
  };

  const handleCheckQuiz = (quizId: string) => {
    setQuizChecked(prev => ({ ...prev, [quizId]: true }));
  };

  // Get current active study hub topic
  const activeTopic = topicsData[activeTopicIdx];

  // Global Progress metrics
  const completionPercentage = Math.round((completedTopics.length / topicsData.length) * 100);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans selection:bg-indigo-600 selection:text-white" id="main-studysub-layout">
      
      {/* Top Main Navigation Header */}
      <header className="bg-white border-b border-slate-205 sticky top-0 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-sm">
            <GraduationCap className="w-6 h-6 text-white stroke-[2.5]" id="header-grad-icon" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold tracking-tight text-slate-800 flex items-center gap-2">
              HCI LAB STUDY HUB
              <span className="text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-200/60 px-2 py-0.5 rounded font-mono font-bold">
                LAB 14 + 15 + MOCK
              </span>
            </h1>
            <p className="text-[10px] text-slate-550 leading-none">Complete Practice Material & Timed Exam Engine</p>
          </div>
        </div>

        {/* Navigation Categories */}
        <nav className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 self-stretch sm:self-auto overflow-x-auto space-x-1 shadow-inner">
          <button
            onClick={() => setActiveMainTab('hub')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeMainTab === 'hub' 
                ? 'bg-indigo-600 text-white shadow-sm' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
            id="tab-hub"
          >
            <BookOpen className="w-3.5 h-3.5" />
            Study Guides
          </button>
          
          <button
            onClick={() => setActiveMainTab('playgrounds')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeMainTab === 'playgrounds' 
                ? 'bg-indigo-600 text-white shadow-sm' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
            id="tab-playgrounds"
          >
            <Terminal className="w-3.5 h-3.5" />
            Interactive Sandboxes
          </button>

          <button
            onClick={() => setActiveMainTab('mock-exam')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeMainTab === 'mock-exam' 
                ? 'bg-indigo-600 text-white shadow-sm' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
            id="tab-mock-exam"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Mock Exam
          </button>

          <button
            onClick={() => setActiveMainTab('progress')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeMainTab === 'progress' 
                ? 'bg-indigo-600 text-white shadow-sm' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
            id="tab-progress"
          >
            <BookmarkCheck className="w-3.5 h-3.5" />
            Progress Track
          </button>
        </nav>
      </header>

      {/* Main Core Content Stage */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        
        {activeMainTab === 'hub' && (
          /* STUDY HUB tab - 10 ordered topics list layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
            
            {/* Sidebar with the 10 Topic items */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white border border-slate-205 p-5 rounded-2xl space-y-4 shadow-sm" id="topics-list-container">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                    📖 Syllabus Targets ({topicsData.length})
                  </span>
                  <span className="text-[10px] bg-indigo-50 px-2.5 py-1 rounded-full text-indigo-700 font-bold border border-indigo-100">
                    {completionPercentage}% Done
                  </span>
                </div>
                
                {/* 10 Topic selection list */}
                <div className="space-y-1.5 overflow-y-auto max-h-[500px] pr-1 scrollbar-thin">
                  {topicsData.map((topic, index) => {
                    const isSelected = activeTopicIdx === index;
                    const isCompleted = completedTopics.includes(topic.id);

                    return (
                      <button
                        key={topic.id}
                        onClick={() => setActiveTopicIdx(index)}
                        className={`w-full py-2.5 px-3 rounded-xl text-left text-xs transition flex items-center justify-between gap-2.5 border ${
                          isSelected 
                            ? 'bg-indigo-50 border-indigo-205 text-indigo-750 font-bold shadow-sm' 
                            : 'bg-white border-slate-100 text-slate-600 hover:bg-slate-50 hover:text-slate-900 shadow-sm'
                        }`}
                        id={`topic-menu-btn-${index}`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          {isCompleted ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-300 shrink-0" />
                          )}
                          <span className="truncate font-medium">{topic.title}</span>
                        </div>
                        <ChevronRight className={`w-3.5 h-3.5 text-slate-400 ${isSelected ? 'text-indigo-600' : ''}`} />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Fast Visualizer Shortcut Link card */}
              <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-3.5 shadow-sm" id="sandbox-shortcuts-card">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">
                  ⚙️ Quick Sandboxes Link
                </span>
                <p className="text-[11px] text-slate-550 leading-relaxed font-sans">Jump directly to one of our interactives to trace outputs live in visual sandboxes.</p>
                <div className="grid grid-cols-2 gap-2 text-center text-[10px] font-bold">
                  <button
                    onClick={() => { setActiveMainTab('playgrounds'); setActiveSandbox('event-loop'); }}
                    className="p-2 py-2.5 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:border-slate-350 text-indigo-700 transition shadow-sm"
                    id="quick-sandbox-link-1"
                  >
                    Event Loop Trace
                  </button>
                  <button
                    onClick={() => { setActiveMainTab('playgrounds'); setActiveSandbox('perf'); }}
                    className="p-2 py-2.5 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:border-slate-350 text-indigo-700 transition shadow-sm"
                    id="quick-sandbox-link-2"
                  >
                    Debounce/Throttle
                  </button>
                </div>
              </div>
            </div>

            {/* Active Topic workspace block */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 space-y-6 shadow-sm" id="active-topic-container">
                
                {/* Title Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-4">
                  <div>
                    <span className="text-[10px] bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded text-indigo-750 font-bold tracking-widest font-mono uppercase">
                      Target Module #{activeTopic.order}
                    </span>
                    <h2 className="text-xl font-black text-slate-805 mt-2 border-none outline-none font-display">{activeTopic.title}</h2>
                  </div>
                  
                  {/* Mark Completed button */}
                  <button
                    onClick={() => toggleTopicCompleted(activeTopic.id)}
                    className={`py-2 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shrink-0 ${
                      completedTopics.includes(activeTopic.id)
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm font-semibold'
                        : 'bg-slate-900 hover:bg-slate-800 text-white shadow-sm'
                    }`}
                    id="completion-toggle-btn"
                  >
                    <CheckCircle className="w-4 h-4" />
                    {completedTopics.includes(activeTopic.id) ? 'Completed checkmark' : 'Mark Topic Checked'}
                  </button>
                </div>

                {/* Main Body: Descriptions & Explanations list */}
                <div className="space-y-6">
                  <p className="text-xs text-slate-600 leading-relaxed italic bg-slate-50 p-4 rounded-xl border border-slate-100 shadow-inner">
                    <strong>HCI lab context:</strong> {activeTopic.description}
                  </p>

                  <div className="space-y-6 divide-y divide-slate-100">
                    {activeTopic.explanations.map((exp, idx) => (
                      <div key={idx} className={`space-y-3.5 ${idx > 0 ? 'pt-6' : ''}`}>
                        <h4 className="text-sm font-extrabold text-indigo-600 tracking-tight font-display">{exp.subtitle}</h4>
                        <p className="text-xs text-slate-650 leading-relaxed font-sans">{exp.text}</p>
                        
                        {/* Render bullet points if any */}
                        {exp.points && (
                          <ul className="space-y-1.5 text-xs text-slate-550 list-inside list-disc pl-2 leading-relaxed font-sans">
                            {exp.points.map((pt, pIdx) => (
                              <li key={pIdx}>{pt}</li>
                            ))}
                          </ul>
                        )}

                        {/* Optional code snippet */}
                        {exp.codeSnippet && (
                          <pre className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-xs font-mono text-indigo-300 overflow-x-auto leading-relaxed select-all shadow-md">
                            {exp.codeSnippet}
                          </pre>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Embedded Practice Sandbox context if applicable */}
                {activeTopic.id === 'event-loop' && (
                  <div className="pt-6 border-t border-slate-100 space-y-4">
                    <div className="bg-slate-50 p-4 border border-slate-100 rounded-xl flex items-center justify-between flex-col md:flex-row gap-4 shadow-sm">
                      <div className="flex items-center gap-3">
                        <Cpu className="text-indigo-600 w-8 h-8 shrink-0 animate-pulse" />
                        <div>
                          <span className="text-xs font-bold text-slate-805 block">Try the Event Loop sandbox below!</span>
                          <span className="text-[11px] text-slate-500 block leading-tight">We created a fully visual step-by-step model for you to practice.</span>
                        </div>
                      </div>
                      <button
                        onClick={() => { setActiveMainTab('playgrounds'); setActiveSandbox('event-loop'); }}
                        className="text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-xl transition shrink-0 shadow-sm"
                        id="embedded-sandbox-btn-1"
                      >
                        Open Event Loop Sim
                      </button>
                    </div>
                  </div>
                )}

                {activeTopic.id === 'performance-events' && (
                  <div className="pt-6 border-t border-slate-100 space-y-4">
                    <div className="bg-slate-50 p-4 border border-slate-100 rounded-xl flex items-center justify-between flex-col md:flex-row gap-4 shadow-sm">
                      <div className="flex items-center gap-3">
                        <Activity className="text-indigo-600 w-8 h-8 shrink-0" />
                        <div>
                          <span className="text-xs font-bold text-slate-800 block">Try the Debounce &amp; Throttle clicker timeline!</span>
                          <span className="text-[11px] text-slate-500 block">Configurable sliders with rolling timelines on raw inputs.</span>
                        </div>
                      </div>
                      <button
                        onClick={() => { setActiveMainTab('playgrounds'); setActiveSandbox('perf'); }}
                        className="text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-xl transition shrink-0 shadow-sm"
                        id="embedded-sandbox-btn-2"
                      >
                        Open Performance Clicker
                      </button>
                    </div>
                  </div>
                )}

                {activeTopic.id === 'array-methods' && (
                  <div className="pt-6 border-t border-slate-100 space-y-4">
                    <div className="bg-slate-50 p-4 border border-slate-100 rounded-xl flex items-center justify-between flex-col md:flex-row gap-4 shadow-sm">
                      <div className="flex items-center gap-3">
                        <Terminal className="text-indigo-600 w-8 h-8 shrink-0" />
                        <div>
                          <span className="text-xs font-bold text-slate-805 block">Test map, filter, and reduce operations</span>
                          <span className="text-[11px] text-slate-505 block font-sans">Interactive pipeline console featuring slice chunking models.</span>
                        </div>
                      </div>
                      <button
                        onClick={() => { setActiveMainTab('playgrounds'); setActiveSandbox('array'); }}
                        className="text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-xl transition shrink-0 shadow-sm"
                        id="embedded-sandbox-btn-3"
                      >
                        Open Array Playground
                      </button>
                    </div>
                  </div>
                )}

                {activeTopic.id === 'usestate-controlled-inputs' && (
                  <div className="pt-6 border-t border-slate-100 space-y-4">
                    <div className="bg-slate-50 p-4 border border-slate-100 rounded-xl flex items-center justify-between flex-col md:flex-row gap-4 shadow-sm">
                      <div className="flex items-center gap-3">
                        <Layers className="text-indigo-600 w-8 h-8 shrink-0" />
                        <div>
                          <span className="text-xs font-bold text-slate-800 block">Test Props and useEffect side effects</span>
                          <span className="text-[11px] text-slate-500 block">Controlled dropdown select state sandbox + unmount logs.</span>
                        </div>
                      </div>
                      <button
                        onClick={() => { setActiveMainTab('playgrounds'); setActiveSandbox('react'); }}
                        className="text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-xl transition shrink-0 shadow-sm"
                        id="embedded-sandbox-btn-4"
                      >
                        Open React Lifecycle Inspector
                      </button>
                    </div>
                  </div>
                )}

                {activeTopic.id === 'mock-code-table' && (
                  <div className="pt-6 border-t border-slate-100 space-y-4">
                    <div className="bg-slate-50 p-4 border border-slate-100 rounded-xl flex items-center justify-between flex-col md:flex-row gap-4 shadow-sm">
                      <div className="flex items-center gap-3">
                        <GraduationCap className="text-indigo-600 w-8 h-8 shrink-0" />
                        <div>
                          <span className="text-xs font-bold text-slate-800 block">Try the Code Identification Matching Game</span>
                          <span className="text-[11px] text-slate-505 block">Directly prepared matching row categories from the actual mock.</span>
                        </div>
                      </div>
                      <button
                        onClick={() => { setActiveMainTab('playgrounds'); setActiveSandbox('table'); }}
                        className="text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-xl transition shrink-0 shadow-sm"
                        id="embedded-sandbox-btn-5"
                      >
                        Open Matching Game
                      </button>
                    </div>
                  </div>
                )}

                {/* Embedded Practice Quiz section */}
                <div className="pt-6 border-t border-slate-200 space-y-4">
                  <h4 className="text-sm font-extrabold text-slate-800 uppercase tracking-widest flex items-center gap-1.5 font-display">
                    📝 Target Quiz &amp; Verification Exercises
                  </h4>
                  
                  <div className="space-y-4 font-sans">
                    {activeTopic.practices.map((quiz, qIdx) => {
                      const selectedOpt = quizAnswers[quiz.id];
                      const checked = quizChecked[quiz.id];
                      const isCorrect = selectedOpt === quiz.correctOptionIndex;

                      return (
                        <div key={quiz.id} className={`p-5 rounded-2xl border-2 transition-all space-y-3.5 ${
                          checked
                            ? isCorrect 
                              ? 'bg-[#F0FDF4] border-emerald-250' 
                              : 'bg-[#FEF2F2] border-red-250'
                            : 'bg-white border-slate-105 shadow-sm'
                        }`} id={`quiz-block-${quiz.id}`}>
                          <div className="flex justify-between items-center gap-3">
                            <span className="text-[10px] text-indigo-700 font-bold bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-md font-mono uppercase tracking-widest">
                              Concept Question {qIdx + 1}
                            </span>
                            {checked && (
                              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md border ${
                                isCorrect 
                                  ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                                  : 'bg-red-100 text-red-800 border-red-200'
                              }`}>
                                {isCorrect ? "CORRECT" : "RE-EVALUATE"}
                              </span>
                            )}
                          </div>

                          <p className="text-xs font-bold text-slate-800 leading-normal">{quiz.question}</p>

                          {/* Render optionally embedded quiz snippets */}
                          {quiz.codeSnippet && (
                            <pre className="bg-slate-900 border border-slate-805 p-4 rounded-xl text-xs font-mono text-indigo-300 overflow-x-auto leading-relaxed select-all shadow-md">
                              {quiz.codeSnippet}
                            </pre>
                          )}

                          {/* Choices list */}
                          <div className="space-y-2">
                            {quiz.options.map((opt, optIdx) => (
                              <button
                                key={optIdx}
                                onClick={() => handleQuizAnswer(quiz.id, optIdx)}
                                className={`w-full text-left py-2.5 px-4 rounded-xl text-xs transition border-2 flex items-center gap-3 ${
                                  selectedOpt === optIdx
                                    ? 'bg-indigo-50/50 border-indigo-600 text-indigo-850 font-bold shadow-sm'
                                    : 'bg-white border-slate-100 text-slate-650 hover:bg-slate-50 hover:border-slate-200 shadow-sm'
                                }`}
                                id={`quiz-option-${quiz.id}-${optIdx}`}
                              >
                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                  selectedOpt === optIdx ? 'border-indigo-600 bg-indigo-100' : 'border-slate-300'
                                }`}>
                                  {selectedOpt === optIdx && <div className="w-1.5 h-1.5 rounded-full bg-indigo-600"></div>}
                                </div>
                                <span className="leading-tight">{opt}</span>
                              </button>
                            ))}
                          </div>

                          {/* Submit Action */}
                          <div className="pt-2 flex justify-between items-center gap-4">
                            <span className="text-[10px] text-slate-400 block">Select your choice options and click Check answer.</span>
                            
                            <button
                              onClick={() => handleCheckQuiz(quiz.id)}
                              disabled={selectedOpt === undefined}
                              className="text-xs font-bold py-2 px-5 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-all shadow-md shadow-indigo-100"
                              id={`check-quiz-${quiz.id}`}
                            >
                              Check Answer
                            </button>
                          </div>

                          {/* Feedback Explanation popup */}
                          {checked && (
                            <div className={`p-4 rounded-xl text-xs leading-relaxed animate-fade-in space-y-1 ${
                              isCorrect ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' : 'bg-red-50 text-red-800 border border-red-100'
                            }`} id={`feedback-${quiz.id}`}>
                              <span className="font-bold flex items-center gap-1">
                                {isCorrect ? '✅ Well traced!' : '❌ Let\'s think again:'}
                              </span>
                              <p className="opacity-90 font-sans">{quiz.explanation}</p>
                            </div>
                          )}

                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Foot navigation */}
                <div className="flex justify-between items-center pt-5 border-t border-slate-100">
                  <button
                    onClick={() => setActiveTopicIdx(prev => Math.max(0, prev - 1))}
                    disabled={activeTopicIdx === 0}
                    className="text-xs bg-white border border-slate-200 rounded-lg py-2 px-4 text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 hover:text-slate-900 transition shadow-sm"
                    id="prev-topic-btn"
                  >
                    Previous Topic
                  </button>

                  <button
                    onClick={() => setActiveTopicIdx(prev => Math.min(topicsData.length - 1, prev + 1))}
                    disabled={activeTopicIdx === topicsData.length - 1}
                    className="text-xs bg-indigo-600 text-white hover:bg-indigo-700 font-bold rounded-lg py-2 px-5 transition shadow-sm shadow-indigo-100"
                    id="next-topic-btn"
                  >
                    Next Topic
                  </button>
                </div>

              </div>
            </div>

          </div>
        )}

        {activeMainTab === 'playgrounds' && (
          /* CORE INTERACTIVE SANDBOXES tab */
          <div className="space-y-6 animate-fade-in" id="playgrounds-stage-grid">
            {/* Horizontal Sub tab picker */}
            <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200 overflow-x-auto space-x-1 shadow-sm">
              <button
                onClick={() => setActiveSandbox('event-loop')}
                className={`flex-1 py-1.5 px-3 text-xs font-bold rounded-lg whitespace-nowrap transition flex items-center justify-center gap-1.5 ${
                  activeSandbox === 'event-loop' 
                    ? 'bg-indigo-600 text-white font-bold shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
                id="sandbox-opt-event-loop"
              >
                <Cpu className="w-4 h-4" />
                event-loop Simulator
              </button>
              
              <button
                onClick={() => setActiveSandbox('perf')}
                className={`flex-1 py-1.5 px-3 text-xs font-bold rounded-lg whitespace-nowrap transition flex items-center justify-center gap-1.5 ${
                  activeSandbox === 'perf' 
                    ? 'bg-indigo-600 text-white font-bold shadow-sm' 
                    : 'text-slate-655 hover:text-slate-900 hover:bg-white/50'
                }`}
                id="sandbox-opt-perf"
              >
                <Activity className="w-4 h-4" />
                Debounce &amp; Throttle Clicker
              </button>

              <button
                onClick={() => setActiveSandbox('array')}
                className={`flex-1 py-1.5 px-3 text-xs font-bold rounded-lg whitespace-nowrap transition flex items-center justify-center gap-1.5 ${
                  activeSandbox === 'array' 
                    ? 'bg-indigo-600 text-white font-bold shadow-sm' 
                    : 'text-slate-655 hover:text-slate-900 hover:bg-white/50'
                }`}
                id="sandbox-opt-array"
              >
                <Terminal className="w-4 h-4" />
                Array Mutation Console
              </button>

              <button
                onClick={() => setActiveSandbox('react')}
                className={`flex-1 py-1.5 px-3 text-xs font-bold rounded-lg whitespace-nowrap transition flex items-center justify-center gap-1.5 ${
                  activeSandbox === 'react' 
                    ? 'bg-indigo-600 text-white font-bold shadow-sm' 
                    : 'text-slate-655 hover:text-slate-905 hover:bg-white/50'
                }`}
                id="sandbox-opt-react"
              >
                <Layers className="w-4 h-4" />
                React Life Cycle inspector
              </button>

              <button
                onClick={() => setActiveSandbox('table')}
                className={`flex-1 py-1.5 px-3 text-xs font-bold rounded-lg whitespace-nowrap transition flex items-center justify-center gap-1.5 ${
                  activeSandbox === 'table' 
                    ? 'bg-indigo-600 text-white font-bold shadow-sm' 
                    : 'text-slate-655 hover:text-slate-905 hover:bg-white/50'
                }`}
                id="sandbox-opt-table"
              >
                <GraduationCap className="w-4 h-4" />
                Identifications game
              </button>
            </div>

            {/* Mount core active sandbox component */}
            <div className="transition-all duration-300">
              {activeSandbox === 'event-loop' && <EventLoopSimulator />}
              {activeSandbox === 'perf' && <PerformanceVisualizer />}
              {activeSandbox === 'array' && <ArrayPlayground />}
              {activeSandbox === 'react' && <ReactDataInspector />}
              {activeSandbox === 'table' && <CodeIdentificationPuzzle />}
            </div>
          </div>
        )}

        {activeMainTab === 'mock-exam' && (
          /* MOCK EXAM SYSTEM tab */
          <div className="animate-fade-in" id="mock-exam-stage-grid">
            <MockExam />
          </div>
        )}

        {activeMainTab === 'progress' && (
          /* PERSONAL PROGRESS TRACKER METRICS tab */
          <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 space-y-6 shadow-sm animate-fade-in" id="progress-view-panel">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <Award className="w-8 h-8 text-indigo-600 shadow-sm rounded-lg" />
              <div>
                <h3 className="text-lg font-bold text-slate-800 font-display">Your Personal HCI Study Metrics Dashboard</h3>
                <p className="text-xs text-slate-500 font-sans">Tracks syllabus goals tracked, quiz answer ratios, and local persistent completions.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Syllabus metrics card */}
              <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-4" id="stats-card-syllabus">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest block font-mono">
                  Syllabus Covered
                </span>
                
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-indigo-600">{completedTopics.length}</span>
                  <span className="text-slate-400 text-xs font-semibold">/ {topicsData.length} Target Modules</span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-indigo-600 h-full transition-all duration-500"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-400 block italic leading-tight">
                  Mark modules checked off inside the study hub to save your offline persistence checklist.
                </span>
              </div>

              {/* Quiz answer metrics card */}
              <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-4" id="stats-card-quizzes">
                <span className="text-xs font-bold text-slate-405 uppercase tracking-widest block font-mono">
                  Concept Exercises Traced
                </span>
                
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-indigo-600">
                    {Object.keys(quizAnswers).length}
                  </span>
                  <span className="text-slate-400 text-xs font-semibold">Answered Questions</span>
                </div>

                <div className="text-xs text-slate-600 leading-relaxed bg-slate-55 border border-slate-100 p-3.5 rounded-xl">
                  💡 <strong>Revision is key:</strong> Target quizzes can be answered as many times as you like. We preserve choices safely inside your browser.
                </div>
              </div>

              {/* Target items list progress table */}
              <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-3.5 md:col-span-2 lg:col-span-1" id="stats-card-checklist">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block border-b border-slate-100 pb-1.5">
                  Core Exam Checklist (ordered)
                </span>

                <div className="space-y-1.5 overflow-y-auto max-h-[160px] pr-1">
                  {topicsData.map((topic, index) => {
                    const isCompleted = completedTopics.includes(topic.id);
                    return (
                      <div key={topic.id} className="flex justify-between items-center text-[11px] font-medium leading-none py-2 border-b border-slate-100">
                        <span className="truncate text-slate-600">{index+1}. {topic.title.replace(/^\d+\.\s*/, '')}</span>
                        <span className={isCompleted ? "text-emerald-600 font-bold" : "text-rose-500 font-medium"}>
                          {isCompleted ? "Checked" : "Open"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Clear All Data */}
            <div className="border-t border-slate-100 pt-5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-sans">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-indigo-505 shrink-0" />
                Your mock stats and syllabus completions are secured in standard client-side secure localStorage keys.
              </span>

              <button
                onClick={() => {
                  if (confirm("Are you sure you would like to clear your study progress and exam records?")) {
                    localStorage.removeItem('hci_completed_topics');
                    localStorage.removeItem('hci_quiz_answers');
                    setCompletedTopics([]);
                    setQuizAnswers({});
                    setQuizChecked({});
                    alert("Study records cleared!");
                  }
                }}
                className="py-2 px-4 bg-red-50 border border-red-100 hover:bg-red-100 text-red-650 font-bold rounded-lg transition"
                id="clear-progress-btn"
              >
                Clear Study Logs
              </button>
            </div>

          </div>
        )}

      </main>

      {/* Humble visually polished footer */}
      <footer className="mt-auto bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-400 font-sans shadow-sm" id="main-hub-footer">
        <div className="w-full max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-3">
          <span>HCI Lab Exam Study Hub • Designed for Practice &amp; Review (Labs 14 &amp; 15 + Mock Q&amp;As)</span>
          <span className="font-mono text-[10px] text-slate-400 bg-slate-50 px-2.5 py-0.5 rounded border border-slate-100">ES6 JavaScript • React 19 • Stable Compiler Platform</span>
        </div>
      </footer>
      
    </div>
  );
}
