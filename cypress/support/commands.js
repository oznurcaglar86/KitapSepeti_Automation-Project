// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })


// cypress/support/commands.js

// cypress/support/commands.js

// cypress/support/commands.js

// cypress/support/commands.js

import 'cypress-iframe';


Cypress.Commands.add('addProductToCart', () => {
    // örnek: sepete ürün ekleme işlemi
    cy.visit('/'); // site ana sayfasına git
    cy.get('.product-card').first().find('.add-to-cart-btn').click(); // ilk ürünü sepete ekle
});


Cypress.Commands.add("loginViaApi", () => {
    cy.session("userSession", () => {
        cy.request({
            method: "POST",
            url: "https://www.kitapsepeti.com/api/v1/authentication/login/?language=tr",
            form: true,
            body: {
                username: Cypress.env("username"),
                password: Cypress.env("password"),
                rememberMe: 0,
            },
            failOnStatusCode: false, // hata olsa bile response görebilmek için
        }).then((response) => {
            expect(response.status).to.eq(200);
        });
    });
});

