const ENABLE_LOGGING = true;

const timerMap = new Map();

// Clean, professional color palette with excellent readability
export const logStyles = {
  // Function/Handler styles - clean and prominent
  handler: [
    "color: #e8ff75ff; font-weight: normal; font-size: 12px;",
    "color: #374151; font-weight: normal; font-size: 11px;",
  ],

  // Component styles - clean hierarchy
  component: [
    "color: #00ffaeff; font-weight: normal; font-size: 12px;", // component name
    "color: #c4cbd8ff; font-weight: normal;", // separator
    "color: #00e1ffff; font-weight: normal;", // label
    "color: #c4cbd8ff; font-weight: normal;", // separator
    "color: #af90ffff; font-weight: normal;", // phase
    "color: #c4cbd8ff; font-weight: normal;", // separator
    "color: #ffd07fff; font-weight: normal;", // count
    "color: #c4cbd8ff; font-weight: normal;", // separator
  ],

  // Status styles - clean and clear
  timer: "color: #a8ffc8ff; font-weight: normal; font-size: 12px;",
  error: "color: #dc2626; font-weight: bold; font-size: 12px;",
  success: "color: #16a34a; font-weight: bold; font-size: 12px;",
  warning: "color: #d97706; font-weight: bold; font-size: 12px;",
  info: "color: #2563eb; font-weight: bold; font-size: 12px;",

  // Value styles - distinct and readable
  value: "color: #3b82f6; font-weight: normal;",
  string: "color: #ffbb62ff; font-weight: normal;",
  number: "color: #ffffffff; font-weight: normal;",
  boolean: "color: #d97706; font-weight: normal;",
  null: "color: #6b7280; font-weight: normal; font-style: italic;",
  undefined: "color: #6b7280; font-weight: normal; font-style: italic;",

  // Result styles - consistent and clean
  result: [
    "color: #e8ff75ff; font-weight: normal; font-size: 12px;",
    "color: #6b7280; font-weight: normal;",
    "color: #374151; font-weight: normal;",
    "color: #6b7280; font-weight: normal;",
  ],

  // Message styles
  msg: "color: #d97706; font-weight: bold; font-size: 12px;",

  // State styles - professional and clear
  state: [
    "color: #ffffff; background: #2c333dff; padding: 2px 6px; border-radius: 4px; font-weight: bold; font-size: 11px;",
    "color: #c4cbd8ff; font-weight: normal;",
    "color: #79adffff; font-weight: normal;",
    "color: #c4cbd8ff; font-weight: normal;",
    "color: #059669; font-weight: normal;",
    "color: #c4cbd8ff; font-weight: normal;",
  ],

  // Object styles - clean and structured
  object: [
    "color: #a37fffff; font-weight: normal;",
    "color: #6b7280; font-weight: normal;",
    "color: #374151; font-weight: normal;",
  ],

  // Array styles - distinct from objects
  array: [
    "color: #be185d; font-weight: bold;",
    "color: #6b7280; font-weight: normal;",
    "color: #374151; font-weight: normal;",
  ],

  // Clean separator and spacing
  separator: "color: #d1d5db; font-weight: 300;",
  label: "color: #a7b4c9ff; font-weight: 500;",
};

// Utility function to get the appropriate style based on data type
const getValueStyle = (value) => {
  const type = typeof value;
  switch (type) {
    case "string":
      return logStyles.string;
    case "number":
      return logStyles.number;
    case "boolean":
      return logStyles.boolean;
    case "undefined":
      return logStyles.undefined;
    default:
      if (value === null) return logStyles.null;
      if (Array.isArray(value)) return logStyles.array[0];
      if (typeof value === "object") return logStyles.object[0];
      return logStyles.value;
  }
};

// Utility function to format value for display
const formatValue = (value) => {
  const type = typeof value;
  switch (type) {
    case "string":
      return `'${value}'`;
    case "number":
      return value.toString();
    case "boolean":
      return value.toString();
    case "undefined":
      return "undefined";
    default:
      if (value === null) return "null";
      if (Array.isArray(value)) return `Array(${value.length})`;
      if (typeof value === "object")
        return `Object{${Object.keys(value).length} keys}`;
      return String(value);
  }
};

export const logTimer = (label) => {
  if (!ENABLE_LOGGING)
    return {
      end: () => null,
    };

  const startTime = performance.now();
  console.log(`%c⏱️ START`, logStyles.result[1]);

  return {
    end: () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      console.log(
        `%c⏱️ DURATION: %c${duration.toFixed(2)}ms`,
        logStyles.result[1],
        logStyles.timer
      );
    },
  };
};

// Start a collapsible log group
export const logStart = (label, props, timer = true) => {
  if (!ENABLE_LOGGING) return { end: () => {} };
  console.groupCollapsed(`%c${label}:%c`, ...logStyles.handler, props);
  if (timer) {
    const timer = logTimer();
    timerMap.set(label, timer);
    return timer;
  }
};

// Component performance logging - clean format
export const logCmpt = (
  id,
  why,
  phase,
  actualDuration,
  count,
  totalDuration
) => {
  if (!ENABLE_LOGGING) return;
  console.log(
    `%c<${id}/>%c 
  • For: %c${why}%c 
  • Phase: %c${phase}%c (${actualDuration.toFixed(2)}ms) 
  • Render Count: %c${count}%c`,
    ...logStyles.component
  );
};

// Enhanced info logging with clean format
export const logInfo = (label, value, customType = null) => {
  if (!ENABLE_LOGGING) return;
  const style = customType
    ? logStyles[customType] || logStyles.value
    : getValueStyle(value);
  const formattedValue = formatValue(value);
  console.log(
    `%c${label}:%c %c${formattedValue}`,
    logStyles.label,
    logStyles.separator,
    style
  );
};

// Object logging with clean formatting
export const logObj = (label, value, expanded = false) => {
  if (!ENABLE_LOGGING) return;

  if (Array.isArray(value)) {
    console.log(
      `%c${label}:%c %cArray[${value.length}]`,
      logStyles.label,
      logStyles.separator,
      logStyles.array[0]
    );
  } else if (typeof value === "object" && value !== null) {
    console.log(
      `%c${label}:%c %cObject{${Object.keys(value).length}}`,
      logStyles.label,
      logStyles.separator,
      logStyles.object[0]
    );
  } else {
    const style = getValueStyle(value);
    const formattedValue = formatValue(value);
    console.log(
      `%c${label}:%c %c${formattedValue}`,
      logStyles.label,
      logStyles.separator,
      style
    );
  }

  // Show the actual object for inspection (clean, no extra noise)
  if (expanded || typeof value === "object") {
    console.log(value);
  }
};

// Success logging
export const logSuccess = (msg, value = null) => {
  if (!ENABLE_LOGGING) return;
  if (value !== null) {
    console.log(`%c✅ ${msg}:`, logStyles.success);
    console.log(value);
  } else {
    console.log(`%c✅ ${msg}`, logStyles.success);
  }
};

// Error logging
export const logError = (msg, value = null) => {
  if (!ENABLE_LOGGING) return;
  if (value !== null) {
    console.log(`%c❌ ${msg}:`, logStyles.error);
    console.log(value);
  } else {
    console.log(`%c❌ ${msg}`, logStyles.error);
  }
};

// Warning logging
export const logWarning = (msg, value = null) => {
  if (!ENABLE_LOGGING) return;
  if (value !== null) {
    console.log(`%c⚠️ ${msg}:`, logStyles.warning);
    console.log(value);
  } else {
    console.log(`%c⚠️ ${msg}`, logStyles.warning);
  }
};

// Info message logging
export const logMsg = (msg, type = "info") => {
  if (!ENABLE_LOGGING) return;
  const style = logStyles[type] || logStyles.msg;
  const icon =
    type === "info"
      ? "ℹ️"
      : type === "warning"
      ? "⚠️"
      : type === "error"
      ? "❌"
      : "📝";
  console.log(`%c${icon} ${msg}`, style);
};

// State update logging - clean and consistent
export const logStateUpdate = (msg, changes, timer, end = true) => {
  if (!ENABLE_LOGGING) return;
  const isPrimitive =
    ["string", "number", "boolean"].includes(typeof changes) ||
    changes === null ||
    changes === undefined;

  if (isPrimitive) {
    console.log(
      `%c[STATE]%c 
  • %c${msg}%c 
  • %c${formatValue(changes)}`,
      logStyles.state[0],
      logStyles.state[1],
      logStyles.state[2],
      logStyles.state[3],
      getValueStyle(changes)
    );
  } else {
    console.log(
      `%c[STATE]%c 
  • %c${msg}%c 
  • %cObject Changes`,
      logStyles.state[0],
      logStyles.state[1],
      logStyles.state[2],
      logStyles.state[3],
      logStyles.object[0],
      changes
    );
  }
  if (timer) timer.end();
  if (end) console.groupEnd();
};

// Enhanced result logging - clean and professional
export const logResult = (label, result) => {
  if (!ENABLE_LOGGING) return;

  const timer = timerMap.get(label);
  if (timer) timer.end();

  const isPrimitive =
    ["string", "number", "boolean"].includes(typeof result) ||
    result === null ||
    result === undefined;

  if (isPrimitive) {
    const style = getValueStyle(result);
    const formattedResult = formatValue(result);
    console.log(
      `%c${label}:%c 
    Result: %c${formattedResult}`,
      logStyles.result[0],
      logStyles.separator,
      style
    );
  } else if (Array.isArray(result)) {
    console.log(
      `%c${label}:%c 
    Result: %cArray[${result.length}]`,
      logStyles.result[0],
      logStyles.separator,
      logStyles.array[0],
      result
    );
  } else if (typeof result === "object") {
    console.log(
      `%c${label}:%c 
    Result: %cObject{${Object.keys(result).length}}`,
      logStyles.result[0],
      logStyles.separator,
      logStyles.object[0],
      result
    );
  } else {
    console.log(
      `%c${label}:%c 
    Result:`,
      logStyles.result[0],
      logStyles.separator
    );
    console.log(result);
  }

  console.groupEnd();
};

// End log group
export const logEnd = () => {
  if (!ENABLE_LOGGING) return;
  console.groupEnd();
};

// Comprehensive logging function that handles any data type
export const logData = (label, data, options = {}) => {
  if (!ENABLE_LOGGING) return;

  const {
    expanded = false,
    type = null,
    groupCollapsed = false,
    showType = true,
  } = options;

  const dataType = Array.isArray(data) ? "array" : typeof data;
  const typeLabel = showType ? ` (${dataType})` : "";

  if (groupCollapsed) {
    console.groupCollapsed(
      `%c${label}${typeLabel}:%c`,
      logStyles.result[0],
      logStyles.result[1]
    );
  }

  logObj(label, data, expanded);

  if (groupCollapsed) {
    console.groupEnd();
  }
};

// Performance timing utility

// Batch logging for multiple related items
export const logBatch = (title, items) => {
  if (!ENABLE_LOGGING) return;

  console.groupCollapsed(`%c📦 ${title}:`, logStyles.handler[0]);
  items.forEach(({ label, data, options = {} }) => {
    logData(label, data, options);
  });
  console.groupEnd();
};

// // Toggle logging on/off
// export const toggleLogging = (enabled) => {
//   ENABLE_LOGGING = enabled;
//   console.log(
//     `%cLogging ${enabled ? "enabled" : "disabled"}`,
//     enabled ? logStyles.success : logStyles.warning
//   );
// };
