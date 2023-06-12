import { createRandomString } from '../utils';

describe('Signup', () => {
  const username = createRandomString(8);
  const password = 'pass';
  const email = createRandomString(6, '@email.com');

  beforeEach(() => {
    cy.visit('/');
    cy.contains('Signup').click();
  });

  it('Invalid fields should show 4 error messages', () => {
    cy.get("input[name='email']").type('t');
    cy.get("input[name='username']").type('t');
    cy.get("input[name='password']").type('t');
    cy.get("input[name='confirmPassword']").type('12');
    cy.get("button[type='submit']").click();

    cy.get("[data-cy='error']").should('have.length', 3);
  });

  it('Valid request should redirect user to new page', () => {
    cy.get("input[name='email']").type(email);
    cy.get("input[name='username']").type(username);
    cy.get("input[name='password']").type(password);
    cy.get("input[name='confirmPassword']").type(password);
    cy.get("button[type='submit']").click();

    cy.location('pathname').should('eq', '/challenges');
  });
});
