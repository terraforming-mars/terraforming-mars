import {expect} from 'chai';
import {AsteroidMiningConsortium} from '../../../src/cards/base/AsteroidMiningConsortium';
import {Game} from '../../../src/Game';
import {SelectPlayer} from '../../../src/inputs/SelectPlayer';
import {TestPlayer} from '../../TestPlayer';
import {Resources} from '../../../src/common/Resources';
import {TestPlayers} from '../../TestPlayers';
import {TestingUtils} from '../../TestingUtils';

describe('AsteroidMiningConsortium', function() {
  let card : AsteroidMiningConsortium; let player : TestPlayer; let player2 : TestPlayer; let game : Game;

  beforeEach(function() {
    card = new AsteroidMiningConsortium();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, player2], player);
  });

  it('Can\'t play if no titanium production', function() {
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Can play if player has titanium production', function() {
    player.addProduction(Resources.TITANIUM, 1);
    expect(player.canPlayIgnoringCost(card)).is.true;
  });

  it('Should play - auto select if single target', function() {
    player.addProduction(Resources.TITANIUM, 1);
    card.play(player); // can decrease own production
    const input = game.deferredActions.peek()!.execute();
    expect(input).is.undefined;
    expect(player.getProduction(Resources.TITANIUM)).to.eq(1);
  });

  it('Should play - multiple targets', function() {
    player.addProduction(Resources.TITANIUM, 1);
    player2.addProduction(Resources.TITANIUM, 1);
    card.play(player);
    expect(player.getProduction(Resources.TITANIUM)).to.eq(2);

    TestingUtils.runAllActions(game);
    const selectPlayer = TestingUtils.cast(player.getWaitingFor(), SelectPlayer);
    selectPlayer.cb(player2);
    expect(player2.getProduction(Resources.TITANIUM)).to.eq(0);
  });

  it('Gives victory points', function() {
    expect(card.getVictoryPoints()).to.eq(1);
  });
});
