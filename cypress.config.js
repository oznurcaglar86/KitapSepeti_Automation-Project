// const { defineConfig } = require("cypress");

// module.exports = defineConfig({
//   e2e: {
//     baseUrl: "https://www.kitapsepeti.com",
//     experimentalSessionAndOrigin: true, // ✅ cy.session() için gerekli
//     chromeWebSecurity: false, // ✅ cross-origin engelini kaldırır
//     setupNodeEvents(on, config) {
//       // Node eventleri burada
//     },
//     reporter: "mochawesome",
//     reporterOptions: {
//       reportDir: "cypress/reports/html",
//       overwrite: false,
//       html: true,
//       json: true,
//     },
//   },
// });


// const { defineConfig } = require("cypress");

// module.exports = defineConfig({
//   e2e: {
//     reporter: 'mochawesome',
//     reporterOptions: {
//       reportDir: 'cypress/reports',
//       overwrite: false,
//       html: true,
//       json: true
//     },
//   },
// });

// import { defineConfig } from "cypress";

// export default defineConfig({
//   e2e: {
//     baseUrl: "https://www.kitapsepeti.com",
//     reporter: "mochawesome",
//     reporterOptions: {
//       reportDir: "cypress/reports",   // JSON raporların kaydedileceği klasör
//       overwrite: false,
//       html: false,                   // HTML'i ayrı oluşturacağız
//       json: true
//     },
//     video: true,                     // test çalışırken video kaydı al
//     screenshotOnRunFailure: true
//   },
// });

const { defineConfig } = require('cypress');

module.exports = defineConfig({
  reporter: 'mochawesome',
  reporterOptions: {
    reportDir: 'cypress/reports', // JSON dosyalarının kaydolacağı klasör
    overwrite: false,             // her spec kendi json'unu bırakır
    html: false,                  // mochawesome'ın kendisinin HTML üretmesini kapatıyoruz (biz marge ile üreteceğiz)
    json: true
  },
  e2e: {
    baseUrl: 'https://www.kitapsepeti.com',
    setupNodeEvents(on, config) {
      // Ek plugin'ler eklenecekse buraya
      return config;
    }
  },
  video: true
});
