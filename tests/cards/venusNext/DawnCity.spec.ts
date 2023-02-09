import {expect} from 'chai';
import {DawnCity} from '../../../src/server/cards/venusNext/DawnCity';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {Resources} from '../../../src/common/Resources';
import {testGameOptions} from '../../TestingUtils';

describe('DawnCity', function() {
  it('Should play', function() {
    const card = new DawnCity();
    const game = newTestGame(2, testGameOptions({venusNextExtension: true}));
    const player = getTestPlayer(game, 0);
    player.production.add(Resources.ENERGY, 1);
    expect(player.canPlayIgnoringCost(card)).is.not.true;

    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.production.energy).to.eq(0);
    expect(player.production.titanium).to.eq(1);
  });
});
