import {expect} from 'chai';
import {AgroDrones} from '../../../src/cards/pathfinders/AgroDrones';
import {Game} from '../../../src/Game';
import {TestPlayer} from '../../TestPlayer';
import {TestPlayers} from '../../TestPlayers';

describe('AgroDrones', function() {
  let card: AgroDrones;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new AgroDrones();
    player = TestPlayers.BLUE.newPlayer();
    game = Game.newInstance('foobar', [player], player);
    player.playedCards.push(card);
  });

  it('canPlay', function() {
    (game as any).temperature = -20;
    expect(player.canPlayIgnoringCost(card)).is.false;

    (game as any).temperature = -18;
    expect(player.canPlayIgnoringCost(card)).is.true;
  });

  it('Can act', function() {
    player.steel = 0;
    player.energy = 0;

    expect(card.canAct(player)).is.false;

    player.steel = 0;
    player.energy = 1;

    expect(card.canAct(player)).is.false;

    player.steel = 1;
    player.energy = 0;

    expect(card.canAct(player)).is.false;

    player.steel = 1;
    player.energy = 1;

    expect(card.canAct(player)).is.true;
  });

  it('act', function() {
    player.steel = 1;
    player.energy = 1;
    player.plants = 0;

    card.action(player);

    expect(player.steel).eq(0);
    expect(player.energy).eq(0);
    expect(player.plants).eq(3);
  });
});
