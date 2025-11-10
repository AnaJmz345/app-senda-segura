// evita carga de winter runtime
global.TextDecoderStream = function () {};
global.TextEncoderStream = function () {};
global.ReadableStream = function () {};

// evita fallos de expo internals
jest.mock('expo', () => ({}));
