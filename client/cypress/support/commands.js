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

Cypress.Commands.add('signin', ({ username, password }) => {
  cy.visit('/signin');

  cy.intercept({
    method: 'POST',
    url: '/signin',
  }).as('signin');

  cy.get('[data-cy=username]').type(username);
  cy.get('[data-cy=password]').type(password);
  cy.get('[data-cy=submit]').click();

  cy.wait('@signin');
  cy.location('pathname').should('eq', '/challenges');
});

Cypress.Commands.add('signup', ({ username, email, password }) => {
  cy.visit('/signup');
  cy.intercept({
    method: 'POST',
    url: '/signup',
  }).as('signup');

  cy.get('[data-cy=username]').type(username);
  cy.get('[data-cy=email]').type(email);
  cy.get('[data-cy=password]').type(password);
  cy.get('[data-cy=confirm]').type(password);
  cy.get('[data-cy=submit]').click();

  cy.wait('@signup');
  cy.location('pathname').should('eq', '/challenges');
});
