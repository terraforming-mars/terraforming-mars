import {expect} from 'chai';
import {Player} from '../../src/Player';
import {Game} from '../../src/Game';
import {TestPlayers} from '../TestPlayers';
import {GrantVenusAltTrackBonusDeferred} from '../../src/venusNext/GrantVenusAltTrackBonusDeferred';
import {Units} from '../../src/Units';

describe('GrantVenusAltTrackBonusDeferred', function() {
  let player: Player;
  let game: Game;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    game = Game.newInstance('x', [player], player);
  });

  it('grant single bonus', () => {
    player.heat = 0;
    const action = new GrantVenusAltTrackBonusDeferred(player, 1, false);
    action.execute().cb(Units.of({heat: 1}));
    expect(player.heat).eq(1);
  });

  it('reject too many bonuses', () => {
    const action = new GrantVenusAltTrackBonusDeferred(player, 2, false);
    expect(() => action.execute().cb(Units.of({heat: 3}))).to.throw('Select no more than 2 distinct units.');

    player.heat = 0;
    action.execute().cb(Units.of({heat: 2}));
    expect(player.heat).eq(2);
  });
});
