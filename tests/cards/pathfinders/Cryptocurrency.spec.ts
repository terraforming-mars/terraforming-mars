import {expect} from 'chai';
import {Cryptocurrency} from '../../../src/server/cards/pathfinders/Cryptocurrency';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {cast} from '../../TestingUtils';

describe('Cryptocurrency', function() {
  let card: Cryptocurrency;
  let player: TestPlayer;

  beforeEach(function() {
    card = new Cryptocurrency();
    player = TestPlayer.BLUE.newPlayer();
    Game.newInstance('gameid', [player], player);
  });

  it('canAct with energy', function() {
    expect(card.canAct(player)).is.false;
    player.stock.energy = 1;
    expect(card.canAct(player)).is.true;
  });

  it('canAct with resources', function() {
    expect(card.canAct(player)).is.false;
    card.resourceCount = 1;
    expect(card.canAct(player)).is.true;
  });

  it('action - energy to data', function() {
    player.stock.energy = 3;
    card.resourceCount = 0;
    card.action(player);
    expect(player.stock.energy).eq(2);
    expect(card.resourceCount).eq(1);
  });

  it('action - data to money', function() {
    player.stock.energy = 0;
    player.stock.megacredits = 0;
    card.resourceCount = 6;
    card.action(player);
    expect(card.resourceCount).eq(0);
    expect(player.stock.megacredits).eq(18);
  });

  it('action - both', function() {
    player.stock.energy = 4;
    player.stock.megacredits = 0;
    card.resourceCount = 6;
    const options = card.action(player);

    const orOptions = cast(options, OrOptions);

    orOptions.options[0].cb();

    expect(player.stock.energy).eq(3);
    expect(card.resourceCount).eq(7);

    orOptions.options[1].cb();

    expect(card.resourceCount).eq(0);
    expect(player.stock.megacredits).eq(21);
  });
});
