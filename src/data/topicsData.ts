import { TopicData } from '../types';

export const topicsData: TopicData[] = [
  {
    id: 'js-functions-callbacks',
    title: '1. JS Functions, Callbacks & Arrow Functions',
    category: 'JS-Basics',
    order: 1,
    description: 'Learn regular function declarations, arrow functions, and how callback functions are passed and executed in JavaScript.',
    explanations: [
      {
        subtitle: 'Function Declarations vs. Arrow Functions',
        text: 'A function declaration is hoisted, meaning it can be called before it is defined. An arrow function is a modern syntax introduced in ES6, which is not hoisted (if assigned to let/const) and has a lexical "this" binding (it inherits "this" from its surrounding scope).',
        codeSnippet: `// 1. Function Declaration (Hoisted)
function greet(name) {
  return "Hello, " + name;
}

// 2. Arrow Function (Not hoisted, concise syntax)
const greetArrow = (name) => "Hello, " + name;

// Arrow function with block body needs explicit return!
const greetBlock = (name) => {
  return "Hello, " + name;
};`
      },
      {
        subtitle: 'What is a Callback Function?',
        text: 'A callback is a function passed as an argument to another function, which is executed later. JavaScript treats functions as "first-class citizens," meaning they can be assigned to variables, passed into other functions, and returned from functions.',
        codeSnippet: `// A callback is passed as a ref, NOT called immediately!
function processUserInput(callback) {
  const name = "HCI Student";
  // We execute the callback here
  callback(name);
}

// We pass sayHi (the callback function) as an argument
function sayHi(name) {
  console.log("Hi " + name);
}

processUserInput(sayHi); // Output: "Hi HCI Student"`
      },
      {
        subtitle: 'Critical Pitfall: Calling vs. Referencing a Callback',
        text: 'A highly common exam mistake is executing a callback inside an event listener or parameter list instead of passing the reference.',
        points: [
          'Correct: addEventListener("click", handleClick) — Passes the function reference to run LATER when clicked.',
          'Incorrect: addEventListener("click", handleClick()) — Runs handleClick IMMEDIATELY when this line is parsed, and passes its return value (usually undefined) as the event listener!'
        ]
      }
    ],
    practices: [
      {
        id: 'func-q1',
        question: 'Identify which of the following passes a callback function reference correctly, without executing it immediately.',
        options: [
          'button.addEventListener("click", greetUser("Aria"))',
          'button.addEventListener("click", () => greetUser("Aria"))',
          'button.addEventListener("click", greetUser())',
          'button.addEventListener("click", greetUser.value)'
        ],
        correctOptionIndex: 1,
        explanation: 'Using an anonymous arrow function `() => greetUser("Aria")` creates a new function reference that wrapper-calls your target function with arguments *only* when the click event occurs. Wrapping it avoids immediate execution.',
        type: 'multiple-choice'
      },
      {
        id: 'func-q2',
        question: 'What is the exact output of tracing the console.log in the snippet below?',
        codeSnippet: `function run(cb) {
  console.log("Middle");
  cb();
}

console.log("Start");
run(() => console.log("Callback"));
console.log("End");`,
        options: [
          'Start -> Callback -> Middle -> End',
          'Start -> Middle -> Callback -> End',
          'Start -> Middle -> End -> Callback',
          'Callback -> Start -> Middle -> End'
        ],
        correctOptionIndex: 1,
        explanation: 'This entire code is synchronous! First "Start" is logged. Then run() is called, which synchronously logs "Middle" and then synchronously calls cb() which logs "Callback". Finally "End" is logged.',
        type: 'multiple-choice'
      }
    ]
  },
  {
    id: 'scope-closure',
    title: '2. Scope, Lexical Scope & Closure',
    category: 'JS-Basics',
    order: 2,
    description: 'Understand local, global, block scope, lexical scoping rules, and how closures allow outer scope variable persistence.',
    explanations: [
      {
        subtitle: 'Scoping Rules: var vs. let & const',
        text: 'Variables defined with var are function-scoped or globally scoped, meaning they ignore curly-brace block boundaries (like if-statements or loops). Variables defined with let and const are block-scoped, existing only within the enclosing curly braces {} where they are defined.',
        codeSnippet: `if (true) {
  var x = 10;
  let y = 20;
}
console.log(x); // 10 (var leaked out of block scope!)
console.log(y); // ReferenceError: y is not defined (let is blocked scoped!)`
      },
      {
        subtitle: 'Lexical Scoping',
        text: 'Lexical scope means that the scope of a variable is determined by its physical placement in the written source code. Inner functions have access to variables declared in their outer parent environments, but parents cannot see inside their children.',
        codeSnippet: `function outer() {
  const outerVar = "Outer scope";
  function inner() {
    console.log(outerVar); // Inner function has access to outerVar!
  }
  inner();
}
outer();`
      },
      {
        subtitle: 'What is a Closure?',
        text: 'A closure is the combination of a function bundled together with references to its surrounding state (the lexical environment). In simple terms: closure allows a nested inner function to access variables from its outer enclosing function even long after the outer function has finished executing.',
        codeSnippet: `function createCounter() {
  let count = 0; // Persistent variable enclosed by closure
  return function() {
    count++;
    return count;
  };
}

const counter = createCounter();
console.log(counter()); // 1
console.log(counter()); // 2
// The variable "count" stays alive in secret closure state!`
      },
      {
        subtitle: 'Immediately Invoked Function Expressions (IIFE)',
        text: 'An IIFE is a function that runs as soon as it is defined. It is used to create a private scope, preventing variables from polluting the global namespace.',
        codeSnippet: `(function() {
  let privateName = "IIFE Scope";
  console.log("Protected code executing!");
})();
// console.log(privateName) // Error! Protected.`
      }
    ],
    practices: [
      {
        id: 'scope-q1',
        question: 'What is the output of the following closure and lexical scope question?',
        codeSnippet: `function makeMultiplier(multiplier) {
  return function(num) {
    return num * multiplier;
  };
}

const double = makeMultiplier(2);
const triple = makeMultiplier(3);

console.log(double(10) + triple(5));`,
        options: [
          '35',
          '45',
          '25',
          '30'
        ],
        correctOptionIndex: 0,
        explanation: 'makeMultiplier(2) returns an inner function where the locked closure variable multiplier = 2. double(10) returns 20. makeMultiplier(3) returns a function with multiplier = 3. triple(5) returns 15. The sum of 20 + 15 is 35.',
        type: 'multiple-choice'
      },
      {
        id: 'scope-q2',
        question: 'Predict the console outputs when using var inside a standard loop comparison.',
        codeSnippet: `for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}`,
        options: [
          '0, 1, 2',
          '3, 3, 3',
          '2, 2, 2',
          '0, 0, 0'
        ],
        correctOptionIndex: 1,
        explanation: 'Because var is not block-scoped, there is only one "i" variable in the outer function scope. By the time the async setTimeout callbacks run, the loop has completed and the shared "i" variable has been incremented to 3. If let had been used, it would yield 0, 1, 2 due to block binding for every iteration.',
        type: 'multiple-choice'
      }
    ]
  },
  {
    id: 'array-methods',
    title: '3. Array Mutation & Iteration Methods',
    category: 'JS-Basics',
    order: 3,
    description: 'Master powerful functional array methods like map(), filter(), reduce(), forEach(), join() and practice array chunking.',
    explanations: [
      {
        subtitle: 'Overview of Iteration Methods',
        text: 'HCI lab exams heavily text you on writing concise array operations. Understand the exact returns of each of these methods:',
        points: [
          'forEach() - Iterates. Returns UNDEFINED, does not create a new array. Perfect for side effects (like adding elements to DOM).',
          'map() - Transforms. Returns a NEW array of the exact same length, containing values returned by the callback.',
          'filter() - Filters. Returns a NEW array containing only elements for which the callback returned a truthy value.',
          'reduce() - Accumulates. Reduces your array down to a SINGLE value (an object, number, array, string) using an accumulator.',
          'join() - Concatenates elements of an array into a single string, separated by a specified delimiter (comma by default).'
        ]
      },
      {
        subtitle: 'Sample Code Examples',
        text: 'Study these standard formats. Note that map and filter do not mutate (change) the original array; they create copies.',
        codeSnippet: `const numbers = [1, 2, 3, 4, 5];

// Map: Square all values
const squares = numbers.map(num => num * num); // [1, 4, 9, 16, 25]

// Filter: Evens only
const evens = numbers.filter(num => num % 2 === 0); // [2, 4]

// Reduce: Sum all numbers
const sum = numbers.reduce((acc, current) => acc + current, 0); // 15 (initial value is 0)

// Join: CSV layout
const joined = numbers.join("-"); // "1-2-3-4-5"`
      },
      {
        subtitle: 'Chunking / Grouping Arrays',
        text: 'Chunking is splitting a single array into smaller subgroups of an arbitrary size (e.g., chunk size of 2 on [1,2,3,4] becomes [[1,2],[3,4]]). Custom chunking functions are common exam questions.',
        codeSnippet: `function chunkArray(arr, size) {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}
console.log(chunkArray([1, 2, 3, 4, 5], 2)); // [[1, 2], [3, 4], [5]]`
      }
    ],
    practices: [
      {
        id: 'array-q1',
        question: 'What is the final value of combined in this nested array pipeline processing?',
        codeSnippet: `const fruits = ["apple", "banana", "peach", "plum"];
const result = fruits
  .filter(f => f.startsWith("p"))
  .map(f => f.toUpperCase())
  .join(",");
console.log(result);`,
        options: [
          '"APPLE,BANANA"',
          '"PEACH,PLUM"',
          '"PEACH,pLUM"',
          '"peach,plum"'
        ],
        correctOptionIndex: 1,
        explanation: 'First, filter leaves only ["peach", "plum"] (both start with "p"). Next, map transforms them to ["PEACH", "PLUM"]. Finally, join joins them with a comma, resulting in "PEACH,PLUM".',
        type: 'multiple-choice'
      },
      {
        id: 'array-q2',
        question: 'Translate the following reduce function operation on an initial empty accumulator.',
        codeSnippet: `const items = [1, 2, 3];
const outcome = items.reduce((acc, val) => {
  acc["num" + val] = val * 10;
  return acc;
}, {});
console.log(outcome);`,
        options: [
          '{ num1: 10, num2: 20, num3: 30 }',
          '[10, 20, 30]',
          '{ num1: 1, num2: 2, num3: 3 }',
          '60'
        ],
        correctOptionIndex: 0,
        explanation: 'reduce is called with an empty object `{}` as the initial value. For each iteration, a dynamic key ("num" + val) is made, containing value * 10, returning the updated accumulator. This maps [1, 2, 3] into the object `{ num1: 10, num2: 20, num3: 30 }`.',
        type: 'multiple-choice'
      }
    ]
  },
  {
    id: 'event-loop',
    title: '4. Event Loop, Call Stack, Microtasks & Macrotasks',
    category: 'JS-Runtime',
    order: 4,
    description: 'Deconstruct JavaScript’s single-threaded nature, call stack, task/macro queue, microtask queue, and output tracing orders.',
    explanations: [
      {
        subtitle: 'The Single-Threaded Runtime',
        text: 'JS is synchronous and single-threaded. It has ONE Call Stack and can execute only one instruction at a time. To perform time-consuming operations (network requests, timers), it offloads files to the Web APIs (broswer environment). When completed, browser API places the callback into queues for execution.',
        points: [
          'Call Stack: Tracks current active function executions.',
          'Web APIs: Timer handling (setTimeout), AJAX requests, DOM click event listening.',
          'Microtask Queue (PROMISES): High priority queue. Holds Promise callbacks (.then, .catch, awaiting blocks).',
          'Macrotask Queue / Task Queue: Normal priority queue. Holds setTimeout buffers, setInterval ticks, and IO tasks.',
          'Event Loop: Monitors the Call Stack. If the call stack is COMPLETELY EMPTY, it drains all items in the Microtask Queue first, then picks ONE item from the Macrotask Queue and pushes it to the Call Stack to run!'
        ]
      },
      {
        subtitle: 'The Core Tracing Hierarchy Rule',
        text: 'During tracing order questions, the evaluation follows a strict rule: synchronously run code executes first -> Then the microtask queue finishes entirely -> Then the macrotask queue runs.',
        codeSnippet: `console.log("1 Sync");

setTimeout(() => {
  console.log("2 Macrotask (setTimeout)");
}, 0);

Promise.resolve().then(() => {
  console.log("3 Microtask (Promise)");
});

console.log("4 Sync");

// Execution Order Output:
// 1 Sync
// 4 Sync
// 3 Microtask (Promise)
// 2 Macrotask (setTimeout)`
      },
      {
        subtitle: 'Understanding async/await',
        text: 'An async function immediately returns a Promise. When code hits an "await <promise>" statement, it executes that promise expression synchronously, and then effectively wraps the entire rest of the function inside a .then() microtask callback, returning control back to the outer stack thread.',
        codeSnippet: `async function myFn() {
  console.log("Inside async start");
  await Promise.resolve();
  console.log("Inside async after await"); // This runs as a Microtask!
}
console.log("Global start");
myFn();
console.log("Global end");

// Output trace:
// 1. "Global start"
// 2. "Inside async start"
// 3. "Global end" (Stack clears)
// 4. "Inside async after await" (Microtask executed)`
      }
    ],
    practices: [
      {
        id: 'el-q1',
        question: 'Week 15 & Mock: What is the exact trace output order of this specific layout?',
        codeSnippet: `console.log("A");

setTimeout(() => {
  console.log("B");
}, 0);

Promise.resolve().then(() => {
  console.log("C");
});

new Promise((resolve) => {
  console.log("D");
  resolve();
}).then(() => {
  console.log("E");
});

console.log("F");`,
        options: [
          'A -> D -> F -> C -> E -> B',
          'A -> F -> D -> C -> E -> B',
          'A -> D -> F -> B -> C -> E',
          'A -> F -> C -> E -> D -> B'
        ],
        correctOptionIndex: 0,
        explanation: '1. "A" logs synchronously. 2. setTimeout queues "B" in the macrotask queue. 3. Promise.resolve() queues "C" in the microtask queue. 4. `new Promise` executor runs SYNCHRONOUSLY, logging "D" immediately. The resolve() then queues "E" in the microtask queue. 5. "F" logs synchronously. 6. Call stack completes! We look at Microtask queue: "C" then "E" run. 7. Microtask is empty! Event Loop checks Macrotask queue: "B" runs. Order: A -> D -> F -> C -> E -> B.',
        type: 'multiple-choice'
      },
      {
        id: 'el-q2',
        question: 'Solve this async/await output question.',
        codeSnippet: `async function test() {
  console.log("One");
  await console.log("Two");
  console.log("Three");
}
console.log("Four");
test();
console.log("Five");`,
        options: [
          'Four -> One -> Two -> Five -> Three',
          'Four -> One -> Five -> Two -> Three',
          'Four -> Five -> One -> Two -> Three',
          'One -> Two -> Three -> Four -> Five'
        ],
        correctOptionIndex: 0,
        explanation: '1. Logs "Four" synchronously. 2. Calls test(), executing "One" synchronously. 3. Runs `await console.log("Two")` - meaning "Two" is executed synchronously, and then the rest of test() ("Three") gets deferred into the Microtask Queue. 4. Returns to parent thread, logging "Five". 5. Stack is empty! Microtask queue runs, logging "Three". Output: Four -> One -> Two -> Five -> Three.',
        type: 'multiple-choice'
      }
    ]
  },
  {
    id: 'performance-events',
    title: '5. Performance Events: Debouncing, Throttling & Polling',
    category: 'Performance',
    order: 5,
    description: 'Learn event performance mitigations. Differentiate debouncing timers from throttled limits, and implement standard polling loops.',
    explanations: [
      {
        subtitle: 'What is Debouncing?',
        text: 'Debouncing delays driving a function until a certain time window has passed without any new triggers. If a user presses a key inside that window, the timer resets. Essential for high frequency actions like searching/autocompleting to prevent hitting servers 100 times.',
        codeSnippet: `function debounce(func, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId); // Reset active timer on new trigger
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}`
      },
      {
        subtitle: 'What is Throttling?',
        text: 'Throttling ensures a function executes only once in a set time window, regardless of how many times the trigger clicks. Perfect for scrolling, window resize, or clicking buttons multiple times to prevent redundant updates.',
        codeSnippet: `function throttle(func, limit) {
  let inThrottle = false;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args); // Run immediately
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false; // Release lock after limit
      }, limit);
    }
  };
}`
      },
      {
        subtitle: 'Polling: repeating task triggers',
        text: 'Polling is repeatedly executing an action at regular intervals of time to fetch fresh updates. This utilizes setInterval or recursive setTimeout, paired with clearInterval to safely teardown active intervals.',
        codeSnippet: `// Standard polling configuration
let pollId = setInterval(() => {
  console.log("Fetching live updates from server...");
}, 1000);

// Tear down to prevent memory leaks!
function stopPolling() {
  clearInterval(pollId);
}`
      }
    ],
    practices: [
      {
        id: 'perf-q1',
        question: 'HCI Exam Question: A user rapidly double-clicks a throttled submit button (limit = 1000ms). What is the behavior?',
        options: [
          'The action fires once on the first click, and ignores the second click.',
          'The action fires twice matching click count.',
          'The action triggers on the first click, then executes a delayed second call after 1000ms.',
          'The first click is cancelled and only the second click triggers.'
        ],
        correctOptionIndex: 0,
        explanation: 'Throttling runs the first invoke immediately, setting a lock. During the lock window (1000ms), any subsequent inputs are ignored. Thus: fires once, ignoring the double-click.',
        type: 'multiple-choice'
      },
      {
        id: 'perf-q2',
        question: 'A user is typing "REACT" into an input debounced by 300ms. They type one letter every 100ms. How many total times will the search trigger function execute?',
        options: [
          '5 times (once for each letter R, RE, REA, REAC, REACT)',
          '1 time, 300ms after the user stops typing "T"',
          '2 times (at R and T)',
          '0 times because keys are cleared before 300ms passes'
        ],
        correctOptionIndex: 1,
        explanation: 'Since the typing interval (100ms) is smaller than the debounce delay (300ms), every keypress resets the debounce timer before it has a chance to execute. The search executes exactly once, 300ms after typing the final letter "T".',
        type: 'multiple-choice'
      }
    ]
  },
  {
    id: 'react-components-jsx',
    title: '6. React Components, JSX & App/Main Architecture',
    category: 'React-Basics',
    order: 6,
    description: 'Deconstruct fundamental modular layouts: React components, JSX rendering constraints, and import/export patterns.',
    explanations: [
      {
        subtitle: 'React and Vite Scaffold Entry points',
        text: 'In a typical Vite App system, we have: index.html -> src/main.tsx -> src/App.tsx.',
        points: [
          'index.html: The static root HTML. Simply contains container <div id="root"> and references main.tsx.',
          'main.tsx: The entry point. Imports React, ReactDOM, global CSS, and mounts App.tsx into the root div!',
          'App.tsx: The primary application layout. Contains the main wrapper code structure.'
        ]
      },
      {
        subtitle: 'JSX Syntax Rules',
        text: 'JSX (JavaScript XML) allows us to write HTML-like structures inside JavaScript files. Browsers do not understand JSX natively, so compilers compile it to standard React.createElement function calls.',
        points: [
          'Rule 1: Component function names must ALWAYS be Capitalized.',
          'Rule 2: You must return a SINGLE root element (e.g., wrapped in <div> or an empty Fragment <>...</>).',
          'Rule 3: Use "className" instead of "class" because class is a reserved word in JS.',
          'Rule 4: Write expressions inside curly braces { } (like state variables, map loops).'
        ]
      },
      {
        subtitle: 'Functional vs Class Components',
        text: 'Functional components are simply JavaScript functions returning JSX. Class components are legacy classes extending React.Component. Modern React heavily favors functional components combined with Hooks.',
        codeSnippet: `// 1. Functional Component (Standard & Modern)
export default function Card({ title }) {
  return (
    <div className="p-4 border rounded">
      <h3>{title}</h3>
    </div>
  );
}

// 2. Class Component (Legacy, uses render() method)
import React from 'react';
class LegacyCard extends React.Component {
  render() {
    return <div className="p-4 border">{this.props.title}</div>;
  }
}`
      }
    ],
    practices: [
      {
        id: 'react-q1',
        question: 'Which of the following violates standard JSX compiler regulations?',
        options: [
          'const Element = () => <div className="p-2">Hello</div>;',
          'const card = () => <div>No Title</div>;',
          'const Layout = () => <><h1>Heading</h1><p>Body</p></>;',
          'const Form = () => <input type="text" />;'
        ],
        correctOptionIndex: 1,
        explanation: 'Rule 1 of React Components states they MUST start with a Capital letter (e.g. `Card` instead of `card`). Lowercase elements are treated by React as standard native DOM host nodes (like <div> or <p>), resulting in warnings/errors.',
        type: 'multiple-choice'
      },
      {
        id: 'react-q2',
        question: 'Where is the DOM root mounting located in a modern Vite React architecture?',
        options: [
          'In App.tsx inside the return statement',
          'In main.tsx using createRoot(document.getElementById("root"))',
          'In tsconfig.json configuration',
          'Directly inside HTML head script'
        ],
        correctOptionIndex: 1,
        explanation: 'Vite binds the script in `index.html` to `src/main.tsx` where React’s wrapper client creates a virtual DOM root on the host node (`#root`) and renders the layout tree.',
        type: 'multiple-choice'
      }
    ]
  },
  {
    id: 'props-vs-state',
    title: '7. Props vs State & Component Rerendering',
    category: 'React-Data',
    order: 7,
    description: 'Understand the fundamental dividing line between Props (read-only passed data) and State (local mutable component memory).',
    explanations: [
      {
        subtitle: 'Props: Configuration Passed from Parent',
        text: 'Props (properties) act as function arguments. They are immutable (read-only) inside the child component. If a component attempts to modify its props, React throws warnings/errors.',
        codeSnippet: `// Parent passes "username" as a prop
<WelcomeMessage username="Aaria" />

// Child receives and displays it
function WelcomeMessage(props) {
  // props.username = "New" // ❌ CRITICAL ERROR! Props are read-only.
  return <h1>Welcome back, {props.username}!</h1>;
}`
      },
      {
        subtitle: 'State: Local Component Memory',
        text: 'State is local data belonging directly to a component that can change over time based on user interactions. Changing state triggers React to automatically re-render the component and its children with the new values.',
        codeSnippet: `import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0); // State variable & setter
  return (
    <button onClick={() => setCount(count + 1)}>
      Clicked {count} times
    </button>
  );
}`
      },
      {
        subtitle: 'Props vs State Comparison Table',
        text: 'A common theory question on HCI exams is parsing the properties of each:',
        points: [
          'Props: Passed into the component | Immutable inside the component | Triggers re-render if parent updates them.',
          'State: Defined inside the component | Fully Mutable using the set state function | Triggers local re-render on mutation.'
        ]
      }
    ],
    practices: [
      {
        id: 'propsstate-q1',
        question: 'HCI Lab Theory: An exam statement says: "A component can modify its own props to store temporary screen toggles." True or False?',
        options: [
          'True, props are variables so we can freely reassign them inside the child.',
          'False, props are read-only from the child’s perspective; parent controls them.',
          'True, but only if the props are declared using the let keyword in function signature.',
          'False, props can only be modified inside a class render method.'
        ],
        correctOptionIndex: 1,
        explanation: 'Props are strictly read-only within the receiving child component. To handle mutable local toggles, you MUST use local state (`useState`).',
        type: 'multiple-choice'
      },
      {
        id: 'propsstate-q2',
        question: 'What triggers a React component to execute its functional block again (re-render)?',
        options: [
          'Only when the window is resized',
          'Whenever global JavaScript variables change value',
          'When internal state values change, or when parent triggers new props',
          'Whenever standard timer interval setTimeout completes'
        ],
        correctOptionIndex: 2,
        explanation: 'React components re-render when they experience an internal State change (via a useState setter) or when their parent re-renders and passes down updated properties (Props).',
        type: 'multiple-choice'
      }
    ]
  },
  {
    id: 'usestate-controlled-inputs',
    title: '8. Controlled Inputs & State Select Dropdowns',
    category: 'React-Data',
    order: 8,
    description: 'Master controlled inputs (the single source of truth pattern) and select dropdown states in React applications.',
    explanations: [
      {
        subtitle: 'What is a Controlled Input?',
        text: 'An input is "controlled" when React state acts as the single source of truth for the input’s value. Instead of letting the browser maintain its internal input value independently, we bind the input’s "value" attribute to React state, and update that state on every keystroke using "onChange".',
        codeSnippet: `import { useState } from 'react';

function TextCounter() {
  const [text, setText] = useState("");

  return (
    <div>
      <input 
        type="text" 
        value={text} // Synchronized with React state
        onChange={(e) => setText(e.target.value)} // Update state on change
      />
      <p>Character count: {text.length}</p>
    </div>
  );
}`
      },
      {
        subtitle: 'Controlled Select Dropdowns',
        text: 'Dropdown selects are implemented identically to text fields. The <select> element contains a "value" bound to state, and its "onChange" reads the selected option’s value.',
        codeSnippet: `function Dropdown() {
  const [theme, setTheme] = useState("light");

  return (
    <div className={theme === "dark" ? "bg-black text-white" : "bg-white text-black"}>
      <select value={theme} onChange={(e) => setTheme(e.target.value)}>
        <option value="light">Light Theme</option>
        <option value="dark">Dark Theme</option>
        <option value="cosmic">Cosmic Indigo</option>
      </select>
    </div>
  );
}`
      },
      {
        subtitle: 'Common Pitfall: Stale/Direct State Mutations',
        text: 'Never mutate state directly (e.g., writing `count = count + 1` or `myArray.push(item)`). React does not detect direct assignments and will not re-render. Always use the setter function and provide a fresh object or array reference.',
        codeSnippet: `// ❌ INCORRECT (Direct mutation - App will not render updates)
const [items, setItems] = useState([]);
items.push("new value");

// ✅ CORRECT (Creating a brand new array reference)
setItems([...items, "new value"]);`
      }
    ],
    practices: [
      {
        id: 'usestate-q1',
        question: 'Identify the correct, standard handler function setup for updating a controlled input state in React.',
        options: [
          '<input onChange={(val) => setState(val)} />',
          '<input value={state} onChange={(e) => setState(e.target.value)} />',
          '<input value={state} onChange={(e) => state = e} />',
          '<input defaultValue={state} />'
        ],
        correctOptionIndex: 1,
        explanation: 'A fully controlled input requires BOTH binding `value={state}` (the single source of truth) AND hooking `onChange={(e) => setState(e.target.value)}` to grab the current text typed into the DOM element.',
        type: 'multiple-choice'
      },
      {
        id: 'usestate-q2',
        question: 'Look at the following snippet. What is wrong with updating the list state on submit?',
        codeSnippet: `const [list, setList] = useState(["Apple"]);
const addItem = () => {
  list.push("Banana");
  setList(list);
};`,
        options: [
          'It is perfectly correct.',
          'It mutates the list array directly, and React will not detect the change because the array reference remains identical.',
          'setList can only receive string arguments, not arrays.',
          'useState can only initialize simple primitive strings.'
        ],
        correctOptionIndex: 1,
        explanation: 'Because array.push mutates the same array reference, when you call `setList(list)`, React checks if the reference has changed. It hasn\'t (it is the same array object), so React skips rendering. You must do: `setList([...list, "Banana"])`.',
        type: 'multiple-choice'
      }
    ]
  },
  {
    id: 'useeffect-hooks',
    title: '9. Side Effects, useEffect & Infinite Renders',
    category: 'React-Hooks',
    order: 9,
    description: 'Learn when side effects run, how code mounts/unmounts, how dependency arrays work, and how infinite routing recursion is caused.',
    explanations: [
      {
        subtitle: 'What is a Side Effect?',
        text: 'Components should be pure functions that map inputs (props) to outputs (JSX). A Side Effect is any operation that affects something outside of the component itself (e.g., fetching network data, manually touching DOM nodes, setting timers/intervals, or subscribing to sockets).',
        codeSnippet: `import { useEffect } from 'react';

// useEffect runs your side effect function AFTER rendering completes.`
      },
      {
        subtitle: 'Demystifying the Dependency Array []',
        text: 'The behavior of useEffect is strictly determined by its second parameter - the dependency array:',
        points: [
          'No dependency array at all: useEffect(() => {}) - Runs after EVERY SINGLE RENDER. Can easily kill performance!',
          'Empty dependency array: useEffect(() => {}, []) - Runs EXACTLY ONCE, immediately after the component mounts (is added to the screen). Perfect for initial data fetching.',
          'With dependencies: useEffect(() => {}, [count]) - Runs after the component mounts, AND subsequently whenever the variable "count" changes value.'
        ]
      },
      {
        subtitle: ' Teardowns and Unmounting',
        text: 'If your effect starts an active listener, interval timer, or websocket connection, it must clean it up when the component leaves the screen (unmounts). To do this, return a cleanup function from your effect.',
        codeSnippet: `useEffect(() => {
  const handleResize = () => console.log(window.innerWidth);
  window.addEventListener("resize", handleResize);

  // Return a cleanup callback!
  return () => {
    window.removeEventListener("resize", handleResize);
  };
}, []);`
      },
      {
        subtitle: 'The Infinite Loop Gotcha',
        text: 'An infinite render loop occurs when you update state inside a useEffect, but failed to include a correct dependency array. The state update triggers a re-render, which calls useEffect, which executes the state update again, over and over infinitely.',
        codeSnippet: `// ❌ THE INFINITE TRIGGER (Do NOT write this!)
useEffect(() => {
  setCount(count + 1); // Mutates state, triggering rendering, running effect again!
}); // No dependency array means it repeats infinitely!

// ✅ FIXED (Dependent only on initial mount or separate triggers)
useEffect(() => {
  document.title = "Current Count: " + count;
}, [count]); // Runs ONLY when count variable shifts value`
      }
    ],
    practices: [
      {
        id: 'effect-q1',
        question: 'A React component contains the code below. How many times will "Fetching Data" be logged when the component mounts and count updates?',
        codeSnippet: `useEffect(() => {
  console.log("Fetching Data");
}, []);`,
        options: [
          'Once on initial mount, and then every time the screen updates.',
          'Exactly once when mounted, and never again.',
          'Zero times because of empty dependencies.',
          'Continuously in an infinite lock.'
        ],
        correctOptionIndex: 1,
        explanation: 'An empty dependency array `[]` dictates that the effect callback runs exactly once when the component initially mounts, and never fires on subsequent state/prop rendering cycles.',
        type: 'multiple-choice'
      },
      {
        id: 'effect-q2',
        question: 'Identify the code that causes an infinite loop in React.',
        options: [
          'useEffect(() => { console.log(count); }, [count]);',
          'useEffect(() => { setCount(c => c + 1); }, []);',
          'useEffect(() => { setCount(count + 1); }, [count]);',
          'useEffect(() => { document.title = "Loaded"; }, []);'
        ],
        correctOptionIndex: 2,
        explanation: 'Option 3 runs whenever count is changed. Inside, it runs `setCount(count + 1)`, which updates count. Because count changed, the effect runs again, updating state again, creating an infinite render loop!',
        type: 'multiple-choice'
      }
    ]
  },
  {
    id: 'mock-code-table',
    title: '10. Mock Code Identification Puzzle',
    category: 'Exam-Special',
    order: 10,
    description: 'Practice reading code and identifying the exact JavaScript or React syntax names, features, and roles. Direct prep for the Mock Exam Q5 table.',
    explanations: [
      {
        subtitle: 'The Q5 Identification Pattern',
        text: 'HCI lab exams contain code tables where you must map code lines to JavaScript constructs or React terminology. Let’s review critical matching rows:',
        points: [
          'Line "const [mode, setMode] = useState(\'cool\')" -> Mapping: useState React Hook, State Initialization, returns array [state, setter].',
          'Line "e.target.value" -> Mapping: Accesses the current input string from the Native DOM event target.',
          'Line "() => setMode(\'warm\')" -> Mapping: Arrow function callback passed as reference to an onClick prop.',
          'Line "mode === \'cool\' ? \'#00f\' : \'#ff0\'" -> Mapping: Ternary operator for dynamic styling evaluation / condition expression.'
        ]
      },
      {
        subtitle: 'Reviewing the color switcher Mock pattern',
        text: 'The color switcher involves a central canvas component tracking active color in state, rendering option buttons. Let’s practice identifying details from the mock code fragment:',
        codeSnippet: `import { useState, useEffect } from 'react';

export default function ColorSwitcher({ defaultMode }) {
  const [mode, setMode] = useState(defaultMode || "cool");

  useEffect(() => {
    console.log("Mode shifted:", mode);
  }, [mode]);

  const toggle = () => {
    setMode(prev => prev === "cool" ? "warm" : "cool");
  };

  return (
    <div className={mode === "cool" ? "bg-cyan-100" : "bg-solar-100"}>
      <button onClick={toggle}>Toggle Mode ({mode})</button>
    </div>
  );
}`
      }
    ],
    practices: [
      {
        id: 'mock-q1',
        question: 'Match the code fragment "defaultMode || \'cool\'" inside the color-switcher constructor:',
        options: [
          'A binary closure representation.',
          'Logical OR Operator providing a fallback default value.',
          'React Hook declaration sequence.',
          'JSX render syntax wrapper.'
        ],
        correctOptionIndex: 1,
        explanation: 'The logical OR (`||`) checks if `defaultMode` is truthy. If not, it falls back to the default string `"cool"`. Common initializer logic in Javascript.',
        type: 'multiple-choice'
      },
      {
        id: 'mock-q2',
        question: 'What React lifecycle step does the array in "}, [mode]);" handle?',
        options: [
          'It forces the component to return a class instance.',
          'It is a dependency array limiting when the effect runs - only on mount and when `mode` state changes.',
          'It is the list of props that the parent component updates.',
          'It triggers immediate unmounting of DOM listeners.'
        ],
        correctOptionIndex: 1,
        explanation: 'In useEffect, `[mode]` acts as a dependency array. It ensures the side effect block executes whenever the `mode` variable undergoes a value shift.',
        type: 'multiple-choice'
      }
    ]
  }
];
