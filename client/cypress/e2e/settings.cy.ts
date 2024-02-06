import { createRandomString } from '../utils';

const username = createRandomString(6);
const email = createRandomString(6, '@email.com');
const password = 'password';

describe('Settings - Account', () => {
  beforeEach(() => {
    cy.signup(email, username, password);
    cy.visit('/');
    cy.get("[data-cy='menu']").click();
    cy.contains('Settings').click();
  });

  it('Invalid email should display error message', () => {
    const email = 'test';

    cy.get("input[name='email']").type(email);
    cy.get("button[type='submit']").click();

    cy.get("[data-cy='error']").should('have.length', 1);
  });

  it('Invalid username should display error message', () => {
    const username = 't';

    cy.get("input[name='username']").type(username);
    cy.get("button[type='submit']").click();

    cy.get("[data-cy='error']").should('have.length', 1);
  });

  it('Valid username and email change should display notification', () => {
    const newUsername = createRandomString(8);

    cy.get("input[name='username']").type(newUsername);
    cy.get("button[type='submit']").click();

    cy.get("[data-cy='notification-success']").should('have.length', 1);

    // Check if new username works for login
    cy.get("[data-cy='menu']").click();
    cy.contains('Signout').click();
    cy.signin(newUsername, password);
  });
});
