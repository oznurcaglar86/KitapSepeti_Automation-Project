// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import "./commands";

// Cypress'in uncaught exceptionları testi bozmasını engelle
Cypress.on("uncaught:exception", (err, runnable) => {
  // true dönersek Cypress bu hatayı yok sayacak
  return false;
});

import "cypress-real-events";

// cypress/support/e2e.js
Cypress.on("session:created", (session) => {
  // eslint-disable-next-line no-console
  console.log("✅ session created", session);
});
Cypress.on("session:restored", (session) => {
  // eslint-disable-next-line no-console
  console.log("♻️ session restored", session);
});
