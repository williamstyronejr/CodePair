import { createRandomString } from '../utils';

const username = createRandomString(8);
const password = 'pass';
const email = createRandomString(6, '@email.com');

before(() => {
  cy.signup(email, username, password);
  cy.signout();
});

describe('Local Signin', () => {
  beforeEach(() => {
    cy.visit('/');

    cy.contains('Signin').as('btn').click();
    cy.get('@btn').click();
  });

  it('Invalid username or password should show error message', () => {
    const username = 't';
    const password = 't';

    cy.get("input[name='username']").type(username);
    cy.get("input[name='password']").type(password);
    cy.get("button[type='submit']").click();

    cy.get('[data-cy="error"]').should('exist');
  });

  it('Valid fields should redirect user to challenges page and update header', () => {
    cy.get("[data-cy='unauth-header']");
    cy.get("input[name='username']").type(username);
    cy.get("input[name='password']").type(password);
    cy.get("button[type='submit']").click();

    cy.location('pathname').should('eq', '/challenges');
    cy.get("[data-cy='auth-header']");
  });
});

describe('Password Recovery', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.contains('Signin').click();
    cy.get('[data-cy="recovery"]').click();
  });

  it('Valid request should show notification message', () => {
    cy.get('[data-cy=field]').type('test');
    cy.get('button[type="submit"]').click();

    cy.get('[data-cy=success]');
  });
});

describe('Password Reset', () => {
  beforeEach(() => {
    cy.visit('/account/reset/password?id=1&token=1');
  });

  it('Invalid password should display error', () => {
    const newPassword = '1';
    const confirmPassword = `${newPassword}1`;

    cy.get('input[name="password"]').type(newPassword);
    cy.get('input[name="passwordC"]').type(confirmPassword);
    cy.get('button[type="submit"]').click();

    cy.get('[data-cy=error]').should('have.length', 2);
  });

  it('Invalid id and token pair should display error', () => {
    const newPassword = 'testing';

    cy.get('input[name="password"]').type(newPassword);
    cy.get('input[name="passwordC"]').type(newPassword);
    cy.get('button[type="submit"]').click();

    cy.get('[data-cy=error]').should('have.length', 1);
  });

  it('Valid request should display notification', () => {
    const newPassword = 'testing';

    // Mock Response
    cy.intercept('POST', '/api/account/reset/password?id=1&token=1', {
      statusCode: 200,
      body: '',
    });

    cy.get('input[name="password"]').type(newPassword);
    cy.get('input[name="passwordC"]').type(newPassword);
    cy.get('button[type="submit"]').click();

    cy.get('[data-cy=success]').should('have.length', 1);
  });
});
