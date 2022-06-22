import {expect} from 'chai';
import {Birds} from '../../../src/cards/base/Birds';
import {Player} from '../../../src/Player';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/common/Resources';
import {SelectPlayer} from '../../../src/inputs/SelectPlayer';
import {TestPlayers} from '../../TestPlayers';

describe('Birds', function() {
  let card : Birds; let player : Player; let player2 : Player;

  beforeEach(function() {
    card = new Birds();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, player2], player);
  });

  it('Cannot play without oxygen', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    const player3 = TestPlayers.GREEN.newPlayer();
    const game = Game.newInstance('foobar', [player, player2, player3], player);

    player2.addProduction(Resources.PLANTS, 2);
    player3.addProduction(Resources.PLANTS, 7);
    (game as any).oxygenLevel = 13;
    expect(card.canPlay(player)).is.true;

    card.play(player);
    expect(game.deferredActions).has.lengthOf(1);
    const selectPlayer = game.deferredActions.peek()!.execute() as SelectPlayer;
    selectPlayer.cb(player2);

    expect(player2.getProduction(Resources.PLANTS)).to.eq(0);
    expect(player3.getProduction(Resources.PLANTS)).to.eq(7);
  });

  it('Should act', function() {
    card.action(player);
    expect(card.resourceCount).to.eq(1);
    expect(card.getVictoryPoints()).to.eq(1);
  });
});
