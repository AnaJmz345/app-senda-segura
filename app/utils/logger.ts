import { logger,consoleTransport } from 'react-native-logs';
import AsyncStorage from '@react-native-async-storage/async-storage';
//import * as Sentry from 'sentry-expo';

// Configurar niveles
const logLevels = {
  debug: 0,
    info: 1,
    warn: 2,
    error: 3,
};

// Configurar el logger principal
const customLogger = logger.createLogger({
  transport: consoleTransport,
  transportOptions: {
    
    colors: {
      debug: 'blueBright' as const,
      info: 'greenBright' as const,
      warn: 'yellowBright' as const,
      error: 'redBright' as const,
    },
  },
  levels: logLevels,
  severity: 'debug', // nivel mínimo a mostrar
  async: true,
  dateFormat: 'time' as const,
  printLevel: true,
  printDate: true,
  enabled: true,

  enabledExtensions: [],
});
type LogLevel = keyof typeof logLevels;

// Guardar log localmente
async function saveLogLocally(level: LogLevel , message: string) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
  };

  try {
    const existing = JSON.parse((await AsyncStorage.getItem('logs')) || '[]');
    existing.push(logEntry);
    await AsyncStorage.setItem('logs', JSON.stringify(existing));
  } catch (err) {
    console.error('Error guardando log local:', err);
  }
}

// Funciones para loguear
export async function logInfo(message: string) {
  customLogger.info(message);
  await saveLogLocally('info', message);
  //sendLogToSentry('info', message);

}

export async function logWarn(message: string) {
  customLogger.warn(message);
  await saveLogLocally('warn', message);
  //sendLogToSentry('warn', message);
}

export async function logError(message: string, error?: any) {
  const fullMessage = error ? `${message} | ${error.message}` : message;
  customLogger.error(fullMessage);
  await saveLogLocally('error', fullMessage);
  //sendLogToSentry('error', fullMessage);
}

export async function logDebug(message: string) {
  customLogger.debug(message);
  await saveLogLocally('debug', message);
  //sendLogToSentry('debug', message);
}

/*
function sendLogToSentry(level: LogLevel, message: string) {
  switch (level) {
    case 'error':
      Sentry.Native.captureException(new Error(`[${level.toUpperCase()}] ${message}`));
      break;
    case 'warn':
      Sentry.Native.captureMessage(`[WARN] ${message}`, 'warning');
      break;
    case 'info':
      Sentry.Native.captureMessage(`[INFO] ${message}`, 'info');
      break;
    case 'debug':
      Sentry.Native.captureMessage(`[DEBUG] ${message}`, 'debug');
      break;
  }
}*/
/*export async function getLocalLogs() {
  try {
    const logs = await AsyncStorage.getItem('logs');
    return logs ? JSON.parse(logs) : [];
  } catch (error) {
    console.error('Error leyendo logs locales:', error);
    return [];
  }
}*/

export default customLogger;
