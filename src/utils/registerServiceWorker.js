if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(error => {
      console.warn('TypeFlow could not register offline support.', error);
    });
  }, { once: true });
}
