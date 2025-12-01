import { logger, consoleTransport } from "react-native-logs";
import { saveLogToDB } from "../models/LogModel";

// Niveles de log
const logLevels = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const colorTransport = consoleTransport;

// Guardar solo logs de error en SQLite
const sqliteTransport = async (props) => {
  const { level, msg } = props;

  if (level.severity === logLevels.error) {
    await saveLogToDB(level.text, msg);
  }
};

// Función para formatear argumentos (objetos, strings, errores, etc)
function formatArgs(args) {
  return args
    .map((a) => {
      if (a instanceof Error) {
        return `${a.message}\n${a.stack}`;
      }
      if (typeof a === "object") {
        return JSON.stringify(a, null, 2);
      }
      return String(a);
    })
    .join(" ");
}

// Crear logger
const customLogger = logger.createLogger({
  transport: (props) => {
    colorTransport(props);   // consola con colores
    sqliteTransport(props);  // guardar errores en SQLite
  },
  transportOptions: {
    colors: {
      debug: "blueBright",
      info: "greenBright",
      warn: "yellowBright",
      error: "redBright",
    },
  },
  levels: logLevels,
  severity: "debug",
  async: true,
  dateFormat: "time",
  printLevel: true,
  printDate: true,
  enabled: true,
});

// =============================
//   FUNCIONES DE LOG PUBLICAS
// =============================

export function logDebug(...args) {
  customLogger.debug(formatArgs(args));
}

export function logInfo(...args) {
  customLogger.info(formatArgs(args));
}

export function logWarn(...args) {
  customLogger.warn(formatArgs(args));
}

export function logError(...args) {
  customLogger.error(formatArgs(args));
}

export default customLogger;
