import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {expect} from 'chai';
import {ReturntoAbandonedTechnology} from '../../../src/server/cards/pathfinders/ReturntoAbandonedTechnology';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {Ants} from '../../../src/server/cards/base/Ants';
import {Birds} from '../../../src/server/cards/base/Birds';
import {Capital} from '../../../src/server/cards/base/Capital';
import {Decomposers} from '../../../src/server/cards/base/Decomposers';
import {EarthOffice} from '../../../src/server/cards/base/EarthOffice';
import {cast, runAllActions} from '../../TestingUtils';
import {testGame} from '../../TestGame';

describe('ReturntoAbandonedTechnology', () => {
  let card: ReturntoAbandonedTechnology;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new ReturntoAbandonedTechnology();
    [game, player] = testGame(1);
    player.playedCards.push(card);
  });

  it('play when discard pile is empty', () => {
    game.projectDeck.discardPile = [];

    cast(card.play(player), undefined);
    runAllActions(game);
    const action = cast(player.popWaitingFor(), SelectCard);

    expect(action.cards).is.empty;
  });

  it('play when discard pile has 1 card', () => {
    const ants = new Ants();
    game.projectDeck.discardPile = [];
    game.projectDeck.discard(ants);

    cast(card.play(player), undefined);
    runAllActions(game);
    const action = cast(player.popWaitingFor(), SelectCard);

    expect(action.cards).deep.eq([ants]);
    expect(game.projectDeck.discardPile).is.empty;
  });

  it('play when discard pile has 5 cards', () => {
    const ants = new Ants();
    const birds = new Birds();
    const capital = new Capital();
    const decomposers = new Decomposers();
    const earthOffice = new EarthOffice();

    game.projectDeck.discardPile = [];
    game.projectDeck.discard(ants);
    game.projectDeck.discard(birds);
    game.projectDeck.discard(capital);
    game.projectDeck.discard(decomposers);
    game.projectDeck.discard(earthOffice);

    cast(card.play(player), undefined);
    runAllActions(game);
    const action = cast(player.popWaitingFor(), SelectCard);

    expect(action.cards).to.have.members([birds, capital, decomposers, earthOffice]);
    expect(game.projectDeck.discardPile).deep.eq([ants]);
  });
});
