function generateRandomString(len, append = '') {
  return (
    Math.random().toString(36).substring(2, 4) +
    Math.random().toString(36).substring(2, 4) +
    append
  );
}

const username = generateRandomString(8);
const password = 'pass';

describe('Signup page', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('[data-cy=signup]').click();
  });

  it('Invalid fields should show validation errors', () => {
    const invalidUsername = 'r';
    const invalidEmail = 't';
    const invalidPassword = 'p';

    cy.get('[data-cy=username]').type(invalidUsername);
    cy.get('[data-cy=email]').type(invalidEmail);
    cy.get('[data-cy=password]').type(invalidPassword);
    cy.get('[data-cy=confirm]').type(invalidPassword);
    cy.get('[data-cy=submit]').click();

    cy.get('[data-cy=error]').should('have.length', 3);
  });

  it('Valid fields should redirect to challenge page', () => {
    const email = generateRandomString(8, '@email.com');

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
});

describe('Signin Page', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('[data-cy=signin]').click();
  });

  it('Invalid username/password should display error', () => {
    cy.get('[data-cy=username]').type(`${username}1`);
    cy.get('[data-cy=password]').type(password);
    cy.get('[data-cy=submit]').click();

    cy.get('[data-cy=error]');
  });

  it('Valid username/password should redirect to challenges page', () => {
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
});

describe('Recovery Page', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('[data-cy=signin]').click();
    cy.get('[data-cy=recovery]').click();
  });

  it('Valid request should show notification message', () => {
    cy.get('[data-cy=field]').type('test');
    cy.get('[data-cy=submit]').click();

    cy.get('[data-cy=success]');
  });
});

describe('Account register Github', () => {
  const username2 = generateRandomString(8);
  const email = generateRandomString(8, '@email.com');

  it('Non-auth user will be redirected to signin page', () => {
    cy.visit('/account/register');

    cy.location('pathname').should('eq', '/signin');
  });

  it('Auth user will be redirected to challenge page', () => {
    // Signup
    cy.signup({ username: username2, password, email });

    cy.visit('/account/register');

    cy.location('pathname').should('eq', '/challenges');
  });
});

describe('Password reset', () => {
  const route = '/account/reset/password?id=1&token=1';
  beforeEach(() => {
    cy.visit(route);
  });

  it('Invalid password should spawn error boxes', () => {
    const newPassword = 't';
    const newPasswordConfirm = `${newPassword}1`;

    cy.get('[data-cy=password]').type(newPassword);
    cy.get('[data-cy=passwordConfirm]').type(newPasswordConfirm);
    cy.get('[data-cy=submit]').click();

    cy.get('[data-cy=error]').should('have.length', 2);
  });

  it('Invalid token/id pair should spawn error box', () => {
    const newPassword = 'pass';
    const newPasswordConfirm = newPassword;

    cy.get('[data-cy=password]').type(newPassword);
    cy.get('[data-cy=passwordConfirm]').type(newPasswordConfirm);
    cy.get('[data-cy=submit]').click();

    cy.get('[data-cy=error]').should('have.length', 1);
  });

  it('Valid request should spawn success message', () => {
    const newPassword = 'pass';
    const newPasswordConfirm = newPassword;

    cy.intercept('POST', route, {
      statusCode: 200,
      body: '',
    });

    cy.get('[data-cy=password]').type(newPassword);
    cy.get('[data-cy=passwordConfirm]').type(newPasswordConfirm);
    cy.get('[data-cy=submit]').click();

    cy.get('[data-cy=success]').should('have.length', 1);
  });
});
