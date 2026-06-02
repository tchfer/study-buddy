describe('Quiz Flow', () => {

  beforeEach(() => {

    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.setItem(
          'studyBuddy.progress.v1',
          JSON.stringify({
            'lesson-alg-1': 100
          })
        );
      }
    });

  });

  it('completes an entire quiz', () => {

    cy.visit('/quiz');

    cy.get('[data-cy="start-quiz"]')
      .click();

    for (let i = 0; i < 3; i++) {

      cy.get('mat-radio-button')
        .first()
        .click();

      cy.get('[data-cy="submit-answer"]')
        .click();

    }

    cy.get('[data-cy="quiz-completed"]')
      .should('exist');

  });

});
