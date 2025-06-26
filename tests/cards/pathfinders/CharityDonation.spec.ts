import {expect} from 'chai';
import {CharityDonation} from '../../../src/server/cards/pathfinders/CharityDonation';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {AcquiredCompany} from '../../../src/server/cards/base/AcquiredCompany';
import {BeamFromAThoriumAsteroid} from '../../../src/server/cards/base/BeamFromAThoriumAsteroid';
import {CEOsFavoriteProject} from '../../../src/server/cards/base/CEOsFavoriteProject';
import {Decomposers} from '../../../src/server/cards/base/Decomposers';
import {cast, runAllActions} from '../../TestingUtils';
import {testGame} from '../../TestGame';
import {SelectCard} from '../../../src/server/inputs/SelectCard';

describe('CharityDonation', () => {
  let card: CharityDonation;
  let player1: TestPlayer;
  let player2: TestPlayer;
  let player3: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new CharityDonation();
    [game, player1, player2, player3] = testGame(3);
  });

  const canPlayRuns = [
    {deck: 2, expected: false},
    {deck: 3, expected: false},
    {deck: 4, expected: true},
  ] as const;
  for (const run of canPlayRuns) {
    it('canPlay: ' + JSON.stringify(run), () => {
      game.projectDeck.drawPile.length = run.deck;

      expect(card.canPlay(player1)).eq(run.expected);
    });
  }

  it('play', () => {
    const acquiredCompany = new AcquiredCompany();
    const beamFromAThoriumAsteroid = new BeamFromAThoriumAsteroid();
    const ceosFavoriteProject = new CEOsFavoriteProject();
    const decomposers = new Decomposers();
    game.projectDeck.drawPile.push(decomposers, ceosFavoriteProject, beamFromAThoriumAsteroid, acquiredCompany);

    player1.popWaitingFor();
    player2.popWaitingFor();
    player3.popWaitingFor();

    // Letting player 2 go first to test the wraparound nature of the algorithm.
    card.play(player2);
    runAllActions(game);

    cast(player1.getWaitingFor(), undefined);
    cast(player3.getWaitingFor(), undefined);
    const selectCard2 = cast(player2.getWaitingFor(), SelectCard);

    expect(selectCard2.cards).deep.eq([acquiredCompany, beamFromAThoriumAsteroid, ceosFavoriteProject, decomposers]);

    player2.process({type: 'card', cards: [beamFromAThoriumAsteroid.name]});

    runAllActions(game);

    cast(player1.getWaitingFor(), undefined);
    cast(player2.getWaitingFor(), undefined);
    const selectCard3 = cast(player3.getWaitingFor(), SelectCard);

    expect(selectCard3.cards).deep.eq([acquiredCompany, ceosFavoriteProject, decomposers]);

    player3.process({type: 'card', cards: [decomposers.name]});

    runAllActions(game);

    cast(player2.getWaitingFor(), undefined);
    cast(player3.getWaitingFor(), undefined);
    const selectCard1 = cast(player1.getWaitingFor(), SelectCard);

    expect(selectCard1.cards).deep.eq([acquiredCompany, ceosFavoriteProject]);

    player1.process({type: 'card', cards: [acquiredCompany.name]});

    runAllActions(game);

    cast(player1.getWaitingFor(), undefined);
    cast(player2.getWaitingFor(), undefined);
    cast(player3.getWaitingFor(), undefined);

    expect(player1.cardsInHand).deep.eq([acquiredCompany]);
    expect(player2.cardsInHand).deep.eq([beamFromAThoriumAsteroid]);
    expect(player3.cardsInHand).deep.eq([decomposers]);
    expect(game.projectDeck.discardPile).deep.eq([ceosFavoriteProject]);
  });
});
