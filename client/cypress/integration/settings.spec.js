function generateRandomString(len, append = '') {
  return (
    Math.random().toString(36).substring(2, 4) +
    Math.random().toString(36).substring(2, 4) +
    append
  );
}

const password = 'test';
let username;

describe('Password settings', () => {
  beforeEach(() => {
    const email = generateRandomString(8, '@email.com');
    username = generateRandomString(8);

    cy.signup({ username, email, password });
    cy.visit('/settings/password');
  });

  it('Invalid new password should show at least 1 error', () => {
    const invalidPassword = 't';

    cy.get('[data-cy=password]').type(password);
    cy.get('[data-cy=newPassword]').type(invalidPassword);
    cy.get('[data-cy=confirmPassword]').type(invalidPassword);
    cy.get('[data-cy=submit]').click();

    cy.get('[data-cy=error]').should('have.length', 1);
  });

  it('Incorrect current password should show 1 error', () => {
    const newPassword = 'test2';

    cy.intercept({
      method: 'POST',
      url: '/settings/password',
    }).as('password');

    cy.get('[data-cy=password]').type(`${password}1`);
    cy.get('[data-cy=newPassword]').type(newPassword);
    cy.get('[data-cy=confirmPassword]').type(newPassword);
    cy.get('[data-cy=submit]').click();

    cy.wait('@password');
    cy.get('[data-cy=error]').should('have.length', 1);
  });

  it('Correct inputs should show notification and allow new password for login', () => {
    const newPassword = 'test2';

    cy.intercept({
      method: 'POST',
      url: '/settings/password',
    }).as('password');

    cy.get('[data-cy=password]').type(password);
    cy.get('[data-cy=newPassword]').type(newPassword);
    cy.get('[data-cy=confirmPassword]').type(newPassword);
    cy.get('[data-cy=submit]').click();

    cy.wait('@password');
    cy.get('[data-cy=notification]').should('have.length', 1);

    // Signout and attempt to login with new password
    cy.get('[data-cy=menu]').click();
    cy.get('[data-cy=signout]').click();
    cy.signin({ username, password: newPassword });
  });
});

describe('Account settings', () => {
  beforeEach(() => {
    const email = generateRandomString(8, '@email.com');
    username = generateRandomString(8);

    cy.signup({ username, email, password });
    cy.visit('/settings/account');
  });

  it('Invalid username and email should show 2 errors', () => {
    const invalidUsername = 't';
    const invalidEmail = 't';

    cy.get('[data-cy=username]').type(invalidUsername);
    cy.get('[data-cy=email]').type(invalidEmail);
    cy.get('[data-cy=submit]').click();

    cy.get('[data-cy=error]').should('have.length', 2);
  });

  it('Valid username and email should show notification', () => {
    const newUsername = generateRandomString(8);
    const newEmail = generateRandomString(8, '@email.com');

    cy.get('[data-cy=username]').type(newUsername);
    cy.get('[data-cy=email]').type(newEmail);
    cy.get('[data-cy=submit]').click();

    cy.get('[data-cy=notification]');
  });
});
