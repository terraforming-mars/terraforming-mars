import {SelectCard} from '../../../src/inputs/SelectCard';
import {expect} from 'chai';
import {ReturntoAbandonedTechnology} from '../../../src/cards/pathfinders/ReturntoAbandonedTechnology';
import {Game} from '../../../src/Game';
import {TestPlayer} from '../../TestPlayer';
import {TestPlayers} from '../../TestPlayers';
import {Ants} from '../../../src/cards/base/Ants';
import {Birds} from '../../../src/cards/base/Birds';
import {Capital} from '../../../src/cards/base/Capital';
import {Decomposers} from '../../../src/cards/base/Decomposers';
import {EarthOffice} from '../../../src/cards/base/EarthOffice';

describe('ReturntoAbandonedTechnology', function() {
  let card: ReturntoAbandonedTechnology;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new ReturntoAbandonedTechnology();
    player = TestPlayers.BLUE.newPlayer();
    game = Game.newInstance('foobar', [player], player);
    player.playedCards.push(card);
  });

  it('play when discard pile is empty', function() {
    game.dealer.discarded = [];

    const action = card.play(player);

    expect(action).instanceof(SelectCard);
    expect((action as SelectCard<any>).cards).is.empty;
  });

  it('play when discard pile has 1 card', function() {
    const ants = new Ants();
    game.dealer.discarded = [];
    game.dealer.discard(ants);

    const action = card.play(player);

    expect(action).instanceof(SelectCard);
    expect((action as SelectCard<any>).cards).deep.eq([ants]);
    expect(game.dealer.discarded).is.empty;
  });

  it('play when discard pile has 5 cards', function() {
    const ants = new Ants();
    const birds = new Birds();
    const capital = new Capital();
    const decomposers = new Decomposers();
    const earthOffice = new EarthOffice();

    game.dealer.discarded = [];
    game.dealer.discard(ants);
    game.dealer.discard(birds);
    game.dealer.discard(capital);
    game.dealer.discard(decomposers);
    game.dealer.discard(earthOffice);

    const action = card.play(player);

    expect(action).instanceof(SelectCard);
    expect((action as SelectCard<any>).cards).to.have.members([birds, capital, decomposers, earthOffice]);
    expect(game.dealer.discarded).deep.eq([ants]);
  });
});
