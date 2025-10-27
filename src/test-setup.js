// src/test-setup.js
import { configure } from '@testing-library/react';

// Usar data-testid (ok con Jasmine/Karma)
configure({ testIdAttribute: 'data-testid' });

// Silenciar consola para que no “ensucie” el output
global.console = {
  ...console,
  error: jasmine.createSpy('console.error'),
  warn: jasmine.createSpy('console.warn'),
};

// Subir timeout global (opcional)
beforeEach(() => {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
});

// Helpers opcionales
window.testHelpers = {
  flushPromises: () => new Promise((r) => setTimeout(r, 0)),
  waitForCondition: (cond, timeout = 3000) =>
    new Promise((resolve, reject) => {
      const step = 100;
      let t = 0;
      const tick = () => {
        if (cond()) return resolve();
        if (t >= timeout) return reject(new Error('Timeout waiting for condition'));
        t += step; setTimeout(tick, step);
      };
      tick();
    }),
};
