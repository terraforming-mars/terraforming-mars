import {expect} from 'chai';
import {setTemperature} from '../../TestingUtils';
import {AgroDrones} from '../../../src/server/cards/pathfinders/AgroDrones';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';

describe('AgroDrones', function() {
  let card: AgroDrones;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new AgroDrones();
    player = TestPlayer.BLUE.newPlayer();
    game = Game.newInstance('gameid', [player], player);
    player.playedCards.push(card);
  });

  it('canPlay', function() {
    setTemperature(game, -20);
    expect(card.canPlay(player)).is.false;

    setTemperature(game, -18);
    expect(card.canPlay(player)).is.true;
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
