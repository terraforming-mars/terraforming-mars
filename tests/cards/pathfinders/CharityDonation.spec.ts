import {expect} from 'chai';
import {CharityDonation} from '../../../src/server/cards/pathfinders/CharityDonation';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {AcquiredCompany} from '../../../src/server/cards/base/AcquiredCompany';
import {BeamFromAThoriumAsteroid} from '../../../src/server/cards/base/BeamFromAThoriumAsteroid';
import {CEOsFavoriteProject} from '../../../src/server/cards/base/CEOsFavoriteProject';
import {Decomposers} from '../../../src/server/cards/base/Decomposers';
import {cast, runAllActions} from '../../TestingUtils';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {SelectCard} from '../../../src/server/inputs/SelectCard';

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
    game.projectDeck.drawPile.push(decomposers, ceosFavoriteProject, beamFromAThoriumAsteroid, acquiredCompany);

    player1.popWaitingFor();
    player2.popWaitingFor();
    player3.popWaitingFor();

    // Letting player 2 go first to test the wraparound nature of the algorithm.
    card.play(player2);
    runAllActions(game);

    expect(player1.getWaitingFor()).is.undefined;
    expect(player3.getWaitingFor()).is.undefined;
    const selectCard2 = cast(player2.getWaitingFor(), SelectCard);

    expect(selectCard2.cards).deep.eq([acquiredCompany, beamFromAThoriumAsteroid, ceosFavoriteProject, decomposers]);

    player2.process([[beamFromAThoriumAsteroid.name]]);

    runAllActions(game);

    expect(player1.getWaitingFor()).is.undefined;
    expect(player2.getWaitingFor()).is.undefined;
    const selectCard3 = cast(player3.getWaitingFor(), SelectCard);

    expect(selectCard3.cards).deep.eq([acquiredCompany, ceosFavoriteProject, decomposers]);

    player3.process([[decomposers.name]]);

    runAllActions(game);

    expect(player2.getWaitingFor()).is.undefined;
    expect(player3.getWaitingFor()).is.undefined;
    const selectCard1 = cast(player1.getWaitingFor(), SelectCard);

    expect(selectCard1.cards).deep.eq([acquiredCompany, ceosFavoriteProject]);

    player1.process([[acquiredCompany.name]]);

    runAllActions(game);

    expect(player1.getWaitingFor()).is.undefined;
    expect(player2.getWaitingFor()).is.undefined;
    expect(player3.getWaitingFor()).is.undefined;

    expect(player1.cardsInHand).deep.eq([acquiredCompany]);
    expect(player2.cardsInHand).deep.eq([beamFromAThoriumAsteroid]);
    expect(player3.cardsInHand).deep.eq([decomposers]);
    expect(game.projectDeck.discardPile).deep.eq([ceosFavoriteProject]);
  });
});
