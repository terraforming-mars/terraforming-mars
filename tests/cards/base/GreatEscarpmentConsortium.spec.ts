import {expect} from 'chai';
import {GreatEscarpmentConsortium} from '../../../src/cards/base/GreatEscarpmentConsortium';
import {Game} from '../../../src/Game';
import {SelectPlayer} from '../../../src/inputs/SelectPlayer';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/common/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('GreatEscarpmentConsortium', function() {
  let card : GreatEscarpmentConsortium; let player : Player; let player2 : Player; let game : Game;

  beforeEach(function() {
    card = new GreatEscarpmentConsortium();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, player2], player);
  });

  it('Cannot play without steel production', function() {
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Can play if player has steel production', function() {
    player.addProduction(Resources.STEEL, 1);
    expect(player.canPlayIgnoringCost(card)).is.true;
  });

  it('Should play - auto select if single target', function() {
    player.addProduction(Resources.STEEL, 1);
    card.play(player); // can decrease own production
    const input = game.deferredActions.peek()!.execute();
    expect(input).is.undefined;
    expect(player.getProduction(Resources.STEEL)).to.eq(1);
  });

  it('Should play - multiple targets', function() {
    player.addProduction(Resources.STEEL, 1);
    player2.addProduction(Resources.STEEL, 1);
    card.play(player);
    expect(player.getProduction(Resources.STEEL)).to.eq(2);

    expect(game.deferredActions).has.lengthOf(1);
    const selectPlayer = game.deferredActions.peek()!.execute() as SelectPlayer;
    selectPlayer.cb(player2);
    expect(player2.getProduction(Resources.STEEL)).to.eq(0);
  });

  it('Can play in solo - won\'t reduce own production', function() {
    game = Game.newInstance('foobar', [player], player);
    player.addProduction(Resources.STEEL, 1);
    expect(player.getProduction(Resources.STEEL)).to.eq(1);

    card.play(player);

    const input = game.deferredActions.peek()!.execute();
    expect(input).is.undefined;
    expect(player.getProduction(Resources.STEEL)).to.eq(2); // should increase
  });
});
