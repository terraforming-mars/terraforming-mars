import {expect} from 'chai';
import {UtopiaInvest} from '../../../src/cards/turmoil/UtopiaInvest';
import {Game} from '../../../src/Game';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {Resources} from '../../../src/Resources';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';

describe('UtopiaInvest', function() {
  it('Should play', function() {
    const card = new UtopiaInvest();
    const player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    Game.newInstance('id', [player, redPlayer], player, TestingUtils.setCustomGameOptions());
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
