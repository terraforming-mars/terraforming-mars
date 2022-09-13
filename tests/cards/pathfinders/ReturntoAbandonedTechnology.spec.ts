import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {expect} from 'chai';
import {ReturntoAbandonedTechnology} from '../../../src/server/cards/pathfinders/ReturntoAbandonedTechnology';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {Ants} from '../../../src/server/cards/base/Ants';
import {Birds} from '../../../src/server/cards/base/Birds';
import {Capital} from '../../../src/server/cards/base/Capital';
import {Decomposers} from '../../../src/server/cards/base/Decomposers';
import {EarthOffice} from '../../../src/server/cards/base/EarthOffice';
import {cast} from '../../TestingUtils';

describe('ReturntoAbandonedTechnology', function() {
  let card: ReturntoAbandonedTechnology;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new ReturntoAbandonedTechnology();
    player = TestPlayer.BLUE.newPlayer();
    game = Game.newInstance('gameid', [player], player);
    player.playedCards.push(card);
  });

  it('play when discard pile is empty', function() {
    game.projectDeck.discardPile = [];

    const action = cast(card.play(player), SelectCard);
    expect(action.cards).is.empty;
  });

  it('play when discard pile has 1 card', function() {
    const ants = new Ants();
    game.projectDeck.discardPile = [];
    game.projectDeck.discard(ants);

    const action = cast(card.play(player), SelectCard);

    expect(action.cards).deep.eq([ants]);
    expect(game.projectDeck.discardPile).is.empty;
  });

  it('play when discard pile has 5 cards', function() {
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

    const action = cast(card.play(player), SelectCard);

    expect(action.cards).to.have.members([birds, capital, decomposers, earthOffice]);
    expect(game.projectDeck.discardPile).deep.eq([ants]);
  });
});
