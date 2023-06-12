/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
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
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

Cypress.Commands.add('signup', (email, username, password) => {
  cy.session(username, () => {
    cy.visit('/');
    cy.contains('Signup').click();
    cy.get("input[name='email']").type(email);
    cy.get("input[name='username']").type(username);
    cy.get("input[name='password']").type(password);
    cy.get("input[name='confirmPassword']").type(password);
    cy.get("button[type='submit']").click();

    cy.location('pathname').should('eq', '/challenges');
  });
});

Cypress.Commands.add('signin', (username, password) => {
  cy.session(username, () => {
    cy.visit('/');
    cy.contains('Signin').click();
    cy.get("input[name='username']").type(username);
    cy.get("input[name='password']").type(password);
    cy.get("button[type='submit']").click();

    cy.location('pathname').should('eq', '/challenges');
    cy.get("[data-cy='auth-header']");
  });
});

Cypress.Commands.add('signout', () => {
  cy.visit('/');

  cy.get("[data-cy='auth-header']");
  cy.get('[data-cy="menu"]').click();
  cy.contains('Signout').click();

  cy.location('pathname').should('eq', '/');
});
