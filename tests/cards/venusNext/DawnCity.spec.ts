import {expect} from 'chai';
import {DawnCity} from '../../../src/cards/venusNext/DawnCity';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/common/Resources';
import {setCustomGameOptions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';

describe('DawnCity', function() {
  it('Should play', function() {
    const card = new DawnCity();
    const player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    const gameOptions = setCustomGameOptions();
    Game.newInstance('gameid', [player, redPlayer], player, gameOptions);
    player.addProduction(Resources.ENERGY, 1);
    expect(player.canPlayIgnoringCost(card)).is.not.true;

    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getProduction(Resources.ENERGY)).to.eq(0);
    expect(player.getProduction(Resources.TITANIUM)).to.eq(1);
  });
});
