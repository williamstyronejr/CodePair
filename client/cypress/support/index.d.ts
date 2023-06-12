/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject> {
    signup(email: string, username: string, password: string): Chainable<void>;
    signin(username: string, password: string): Chainable<void>;
    signout(): Chainable<void>;
  }
}
