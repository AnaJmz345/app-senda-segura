import { logger, consoleTransport } from "react-native-logs";
import { saveLogToDB } from "../models/LogModel"; // la función SQLite

// Niveles de log
const logLevels = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const colorTransport = consoleTransport;


const sqliteTransport = async (props) => {
  const { level, msg } = props;
  await saveLogToDB(level.text, msg);  // Aquí guardamos REAL al SQLite
};

// Instancia del logger
const customLogger = logger.createLogger({
  transport: (props) => {
    // Consola con colores
    colorTransport(props);

    // Guardar en SQLite
    sqliteTransport(props);
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

export function logInfo(msg) { customLogger.info(msg); }
export function logWarn(msg) { customLogger.warn(msg); }
export function logError(msg) { customLogger.error(msg); }
export function logDebug(msg) { customLogger.debug(msg); }

export default customLogger;
