import {expect} from 'chai';
import {Birds} from '../../../src/server/cards/base/Birds';
import {Player} from '../../../src/server/Player';
import {Game} from '../../../src/server/Game';
import {Resources} from '../../../src/common/Resources';
import {SelectPlayer} from '../../../src/server/inputs/SelectPlayer';
import {TestPlayer} from '../../TestPlayer';
import {cast} from '../../TestingUtils';

describe('Birds', function() {
  let card: Birds;
  let player: Player;
  let player2: Player;

  beforeEach(function() {
    card = new Birds();
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, player2], player);
  });

  it('Cannot play without oxygen', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    const player3 = TestPlayer.GREEN.newPlayer();
    const game = Game.newInstance('gameid', [player, player2, player3], player);

    player2.production.add(Resources.PLANTS, 2);
    player3.production.add(Resources.PLANTS, 7);
    (game as any).oxygenLevel = 13;
    expect(card.canPlay(player)).is.true;

    card.play(player);
    expect(game.deferredActions).has.lengthOf(1);
    const selectPlayer = cast(game.deferredActions.peek()!.execute(), SelectPlayer);
    selectPlayer.cb(player2);

    expect(player2.production.plants).to.eq(0);
    expect(player3.production.plants).to.eq(7);
  });

  it('Should act', function() {
    card.action(player);
    expect(card.resourceCount).to.eq(1);
    expect(card.getVictoryPoints()).to.eq(1);
  });
});
