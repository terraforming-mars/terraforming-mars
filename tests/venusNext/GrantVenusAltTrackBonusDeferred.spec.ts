import {expect} from 'chai';
import {Player} from '../../src/Player';
import {Game} from '../../src/Game';
import {TestPlayers} from '../TestPlayers';
import {GrantVenusAltTrackBonusDeferred} from '../../src/venusNext/GrantVenusAltTrackBonusDeferred';
import {AndOptions} from '../../src/inputs/AndOptions';

describe('GrantVenusAltTrackBonusDeferred', function() {
  let player: Player;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('x', [player], player);
  });

  it('grant single bonus', () => {
    const input = new GrantVenusAltTrackBonusDeferred(player, 1, false).execute() as AndOptions;
    input.options[0].cb(0);
    input.options[1].cb(0);
    input.options[2].cb(0);
    input.options[3].cb(0);
    input.options[4].cb(0);
    input.options[5].cb(1);
    input.cb();
    expect(player.megaCredits).eq(0);
    expect(player.steel).eq(0);
    expect(player.titanium).eq(0);
    expect(player.plants).eq(0);
    expect(player.energy).eq(0);
    expect(player.heat).eq(1);
  });

  it('reject too many bonuses', () => {
    const input = new GrantVenusAltTrackBonusDeferred(player, 2, false).execute() as AndOptions;
    input.options[0].cb(0);
    input.options[0].cb(0);
    input.options[0].cb(0);
    input.options[0].cb(0);
    input.options[0].cb(0);
    input.options[5].cb(3);

    expect(() => input.cb()).to.throw('Select 2 resources.');

    player.heat = 0;
    input.options[5].cb(2);
    input.cb();
    expect(player.heat).eq(2);
  });
});
