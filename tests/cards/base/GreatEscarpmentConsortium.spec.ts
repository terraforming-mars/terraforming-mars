import {expect} from 'chai';
import {GreatEscarpmentConsortium} from '../../../src/cards/base/GreatEscarpmentConsortium';
import {Game} from '../../../src/Game';
import {SelectPlayer} from '../../../src/inputs/SelectPlayer';
import {TestPlayer} from '../../TestPlayer';
import {Resources} from '../../../src/common/Resources';
import {TestPlayers} from '../../TestPlayers';
import {TestingUtils} from '../../TestingUtils';

describe('GreatEscarpmentConsortium', function() {
  let card : GreatEscarpmentConsortium; let player : TestPlayer; let player2 : TestPlayer; let game : Game;

  beforeEach(function() {
    card = new GreatEscarpmentConsortium();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, player2], player);
    player.popWaitingFor(); // Remove SelectInitialCards
  });

  it('Cannot play without steel production', function() {
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Can play if player has steel production', function() {
    player.addProduction(Resources.STEEL, 1);
    expect(player.canPlayIgnoringCost(card)).is.true;
  });

  it('Should play - auto select if single target', function() {
    player2.addProduction(Resources.STEEL, 1);

    card.play(player);
    TestingUtils.runAllActions(game);

    expect(player.popWaitingFor()).is.undefined;
    expect(player.getProduction(Resources.STEEL)).to.eq(1);
    expect(player2.getProduction(Resources.STEEL)).to.eq(0);
  });

  it('Should play - multiple targets', function() {
    player.addProduction(Resources.STEEL, 1);
    player2.addProduction(Resources.STEEL, 1);
    card.play(player);

    TestingUtils.runAllActions(game);
    const selectPlayer = TestingUtils.cast(player.popWaitingFor(), SelectPlayer);
    selectPlayer.cb(player2);
    TestingUtils.runAllActions(game);

    expect(player.getProduction(Resources.STEEL)).to.eq(2);
    expect(player2.getProduction(Resources.STEEL)).to.eq(0);
  });

  it('Can play in solo - will not reduce own production', function() {
    const game = Game.newInstance('foobar', [player], player);
    player.popWaitingFor(); // Remove SelectInitialCards
    player.addProduction(Resources.STEEL, 1);
    expect(player.getProduction(Resources.STEEL)).to.eq(1);

    card.play(player);
    TestingUtils.runAllActions(game);

    expect(player.popWaitingFor()).is.undefined;
    expect(player.getProduction(Resources.STEEL)).to.eq(2); // should increase
  });
});
