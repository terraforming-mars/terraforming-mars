import {expect} from 'chai';
import {CharityDonation} from '../../../src/cards/pathfinders/CharityDonation';
import {Game} from '../../../src/Game';
import {TestPlayer} from '../../TestPlayer';
import {AcquiredCompany} from '../../../src/cards/base/AcquiredCompany';
import {BeamFromAThoriumAsteroid} from '../../../src/cards/base/BeamFromAThoriumAsteroid';
import {CEOsFavoriteProject} from '../../../src/cards/base/CEOsFavoriteProject';
import {Decomposers} from '../../../src/cards/base/Decomposers';
import {TestingUtils} from '../../TestingUtils';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {SelectCard} from '../../../src/inputs/SelectCard';

describe('CharityDonation', function() {
  let card: CharityDonation;
  let player1: TestPlayer;
  let player2: TestPlayer;
  let player3: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new CharityDonation();
    game = newTestGame(3);
    player1 = getTestPlayer(game, 0);
    player2 = getTestPlayer(game, 1);
    player3 = getTestPlayer(game, 2);
  });

  it('play', function() {
    const acquiredCompany = new AcquiredCompany();
    const beamFromAThoriumAsteroid = new BeamFromAThoriumAsteroid();
    const ceosFavoriteProject = new CEOsFavoriteProject();
    const decomposers = new Decomposers();
    game.dealer.deck.push(decomposers, ceosFavoriteProject, beamFromAThoriumAsteroid, acquiredCompany);

    (player1 as any).waitingFor = undefined;
    (player2 as any).waitingFor = undefined;
    (player3 as any).waitingFor = undefined;

    // Letting player 2 go first to test the wraparound nature of the algorithm.
    card.play(player2);
    TestingUtils.runAllActions(game);

    expect(player1.getWaitingFor()).is.undefined;
    expect(player3.getWaitingFor()).is.undefined;
    const selectCard2 = TestingUtils.cast(player2.getWaitingFor(), SelectCard);

    expect(selectCard2.cards).deep.eq([acquiredCompany, beamFromAThoriumAsteroid, ceosFavoriteProject, decomposers]);

    player2.process([[beamFromAThoriumAsteroid.name]]);

    TestingUtils.runAllActions(game);

    expect(player1.getWaitingFor()).is.undefined;
    expect(player2.getWaitingFor()).is.undefined;
    const selectCard3 = TestingUtils.cast(player3.getWaitingFor(), SelectCard);

    expect(selectCard3.cards).deep.eq([acquiredCompany, ceosFavoriteProject, decomposers]);

    player3.process([[decomposers.name]]);

    TestingUtils.runAllActions(game);

    expect(player2.getWaitingFor()).is.undefined;
    expect(player3.getWaitingFor()).is.undefined;
    const selectCard1 = TestingUtils.cast(player1.getWaitingFor(), SelectCard);

    expect(selectCard1.cards).deep.eq([acquiredCompany, ceosFavoriteProject]);

    player1.process([[acquiredCompany.name]]);

    TestingUtils.runAllActions(game);

    expect(player1.getWaitingFor()).is.undefined;
    expect(player2.getWaitingFor()).is.undefined;
    expect(player3.getWaitingFor()).is.undefined;

    expect(player1.cardsInHand).deep.eq([acquiredCompany]);
    expect(player2.cardsInHand).deep.eq([beamFromAThoriumAsteroid]);
    expect(player3.cardsInHand).deep.eq([decomposers]);
    expect(game.dealer.discarded).deep.eq([ceosFavoriteProject]);
  });
});
