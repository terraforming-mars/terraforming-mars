import {expect} from 'chai';
import {PowerSupplyConsortium} from '../../../src/cards/base/PowerSupplyConsortium';
import {Game} from '../../../src/Game';
import {SelectPlayer} from '../../../src/inputs/SelectPlayer';
import {TestPlayer} from '../../TestPlayer';
import {Resources} from '../../../src/common/Resources';
import {TestPlayers} from '../../TestPlayers';
import {TestingUtils} from '../../TestingUtils';

describe('PowerSupplyConsortium', function() {
  let card : PowerSupplyConsortium; let player : TestPlayer; let player2 : TestPlayer; let game : Game;

  beforeEach(function() {
    card = new PowerSupplyConsortium();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, player2], player);
    player.popWaitingFor(); // Remove SelectInitialCards
  });

  it('Cannot play without power tags', function() {
    player.addProduction(Resources.ENERGY, 3);
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Can play - no targets', function() {
    player.playedCards.push(card, card);
    expect(player.canPlayIgnoringCost(card)).is.true;

    card.play(player);
    TestingUtils.runAllActions(game);

    expect(player.popWaitingFor()).is.undefined;
    expect(player.getProduction(Resources.ENERGY)).to.eq(1);
  });

  it('Can play - single target', function() {
    player2.setProductionForTest({energy: 1});
    player.playedCards.push(card, card);
    expect(player.canPlayIgnoringCost(card)).is.true;

    card.play(player);
    TestingUtils.runAllActions(game);

    expect(player.popWaitingFor()).is.undefined;
    expect(player.getProduction(Resources.ENERGY)).to.eq(1);
    expect(player2.getProduction(Resources.ENERGY)).to.eq(0);
  });

  it('Can play - multiple targets', function() {
    player.addProduction(Resources.ENERGY, 1);
    player2.addProduction(Resources.ENERGY, 3);

    card.play(player);

    TestingUtils.runAllActions(game);
    const selectPlayer = TestingUtils.cast(player.popWaitingFor(), SelectPlayer);
    selectPlayer.cb(player2);
    TestingUtils.runAllActions(game);
    expect(player.getProduction(Resources.ENERGY)).to.eq(2);
    expect(player2.getProduction(Resources.ENERGY)).to.eq(2);
  });

  it('Can play in solo mode if have enough power tags', function() {
    const game = Game.newInstance('foobar2', [player], player);
    player.playedCards.push(card, card);
    expect(card.canPlay(player)).is.true;

    card.play(player);
    TestingUtils.runAllActions(game);
    expect(player.getProduction(Resources.ENERGY)).to.eq(1); // incremented
  });
});
