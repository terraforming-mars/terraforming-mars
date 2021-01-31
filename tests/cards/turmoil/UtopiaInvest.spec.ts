import {expect} from 'chai';
import {UtopiaInvest} from '../../../src/cards/turmoil/UtopiaInvest';
import {Game} from '../../../src/Game';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {Resources} from '../../../src/Resources';
import {setCustomGameOptions, TestPlayers} from '../../TestingUtils';

describe('UtopiaInvest', function() {
  it('Should play', function() {
    const card = new UtopiaInvest();
    const player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    Game.newInstance('id', [player, redPlayer], player, setCustomGameOptions());
    const play = card.play(player);
    expect(play).is.undefined;
    expect(player.getProduction(Resources.TITANIUM)).to.eq(1);
    expect(player.getProduction(Resources.STEEL)).to.eq(1);
    const action = card.action(player);
    expect(action).is.not.undefined;
    expect(action instanceof OrOptions).is.true;
    action.options[2].cb();
    expect(player.titanium).to.eq(4);
    expect(player.getProduction(Resources.TITANIUM)).to.eq(0);
  });
});
