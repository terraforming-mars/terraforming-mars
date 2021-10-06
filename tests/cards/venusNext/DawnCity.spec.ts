import {expect} from 'chai';
import {DawnCity} from '../../../src/cards/venusNext/DawnCity';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/Resources';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';

describe('DawnCity', function() {
  it('Should play', function() {
    const card = new DawnCity();
    const player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    const gameOptions = TestingUtils.setCustomGameOptions();
    Game.newInstance('foobar', [player, redPlayer], player, gameOptions);
    player.addProduction(Resources.ENERGY, 1);
    expect(player.canPlayIgnoringCost(card)).is.not.true;

    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getProduction(Resources.ENERGY)).to.eq(0);
    expect(player.getProduction(Resources.TITANIUM)).to.eq(1);
  });
});
