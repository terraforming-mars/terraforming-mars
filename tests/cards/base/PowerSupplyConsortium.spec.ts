import {expect} from 'chai';
import {PowerSupplyConsortium} from '../../../src/cards/base/PowerSupplyConsortium';
import {Game} from '../../../src/Game';
import {SelectPlayer} from '../../../src/inputs/SelectPlayer';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestingUtils';

describe('PowerSupplyConsortium', function() {
  let card : PowerSupplyConsortium; let player : Player; let player2 : Player; let game : Game;

  beforeEach(function() {
    card = new PowerSupplyConsortium();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, player2], player);
  });

  it('Can\'t play without power tags', function() {
    player.addProduction(Resources.ENERGY, 3);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Can play - single target', function() {
    player.playedCards.push(card, card);
    expect(card.canPlay(player)).is.true;

    card.play(player, game);
    expect(player.getProduction(Resources.ENERGY)).to.eq(1);
    const input = game.deferredActions.next()!.execute();
    expect(input).is.undefined;
    expect(player.getProduction(Resources.ENERGY)).to.eq(0);
  });

  it('Can play - multiple targets', function() {
    player2.addProduction(Resources.ENERGY, 3);

    card.play(player, game);
    expect(player.getProduction(Resources.ENERGY)).to.eq(1);

    expect(game.deferredActions).has.lengthOf(1);
    const selectPlayer = game.deferredActions.next()!.execute() as SelectPlayer;
    selectPlayer.cb(player2);
    expect(player.getProduction(Resources.ENERGY)).to.eq(1);
    expect(player2.getProduction(Resources.ENERGY)).to.eq(2);
  });

  it('Can play in solo mode if have enough power tags', function() {
    const game = Game.newInstance('foobar2', [player], player);
    player.playedCards.push(card, card);
    expect(card.canPlay(player)).is.true;

    card.play(player, game);
    expect(player.getProduction(Resources.ENERGY)).to.eq(1); // incremented
  });
});
