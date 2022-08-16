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
