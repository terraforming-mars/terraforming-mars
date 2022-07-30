import {expect} from 'chai';
import {UtopiaInvest} from '../../../src/cards/turmoil/UtopiaInvest';
import {Game} from '../../../src/Game';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {Resources} from '../../../src/common/Resources';
import {setCustomGameOptions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';

describe('UtopiaInvest', function() {
  it('Should play', function() {
    const card = new UtopiaInvest();
    const player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player, setCustomGameOptions());
    const play = card.play(player);
    expect(play).is.undefined;
    expect(player.getProduction(Resources.TITANIUM)).to.eq(1);
    expect(player.getProduction(Resources.STEEL)).to.eq(1);
    const action = card.action(player);
    expect(action).is.not.undefined;
    expect(action).instanceOf(OrOptions);
    action.options[2].cb();
    expect(player.titanium).to.eq(4);
    expect(player.getProduction(Resources.TITANIUM)).to.eq(0);
  });
});
