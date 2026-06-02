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

  it('completes a quiz', () => {

    cy.visit('/quiz');

    cy.contains('Start')
      .click();

    cy.get('mat-radio-button')
      .first()
      .click();

    cy.contains('Submit')
      .click();

    cy.contains('Question')
      .should('exist');

  });

});
