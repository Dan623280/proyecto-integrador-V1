const esEntornoLocal = [
    'localhost',
    '127.0.0.1'
].includes(window.location.hostname);

export const API_URL = esEntornoLocal
    ? 'http://127.0.0.1:8000'
    : window.location.origin;
