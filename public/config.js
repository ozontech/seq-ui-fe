fetch(new URL('/config.json', document.location.origin))
  .then((data) => data.json())
  .then((data) => window.__CONFIG__ = data)
