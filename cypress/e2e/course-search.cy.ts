describe('Course Search', () => {

  beforeEach(() => {
    cy.visit('/courses');
  });

  it('updates search input', () => {

    cy.get('[data-cy="course-search"]')
      .type('biology')
      .should('have.value', 'biology');

  });

});
