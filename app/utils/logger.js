import { logger, consoleTransport } from "react-native-logs";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Niveles de log
const logLevels = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

// Instancia del logger
const customLogger = logger.createLogger({
  transport: consoleTransport,
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

// Guardar log en almacenamiento local
async function saveLogLocally(level, message) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
  };

  try {
    const existing = JSON.parse((await AsyncStorage.getItem("logs")) || "[]");
    existing.push(logEntry);
    await AsyncStorage.setItem("logs", JSON.stringify(existing));
  } catch (err) {
    console.error("Error guardando log local:", err);
  }
}

// Funciones para loguear
export async function logInfo(message) {
  customLogger.info(message);
  await saveLogLocally("info", message);
}

export async function logWarn(message) {
  customLogger.warn(message);
  await saveLogLocally("warn", message);
}

export async function logError(message) {
  customLogger.error(message);
  await saveLogLocally("error", message);
}

export async function logDebug(message) {
  customLogger.debug(message);
  await saveLogLocally("debug", message);
}

// Leer logs
export async function getLocalLogs() {
  try {
    const logs = await AsyncStorage.getItem("logs");
    return logs ? JSON.parse(logs) : [];
  } catch (error) {
    console.error("Error leyendo logs locales:", error);
    return [];
  }
}

export default customLogger;