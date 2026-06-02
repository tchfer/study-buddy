describe('Navigation', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('navigates to courses', () => {
    cy.get('a[routerlink="/courses"]').first().click();

    cy.url().should('include', '/courses');
  });

  it('navigates to dashboard', () => {
    cy.contains('Dashboard').click();

    cy.url().should('include', '/dashboard');
  });

  it('navigates to analytics', () => {
    cy.contains('Analytics').click();

    cy.url().should('include', '/analytics');
  });
});
