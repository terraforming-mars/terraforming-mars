import {expect} from 'chai';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {FloaterLeasing} from '../../../src/cards/colonies/FloaterLeasing';
import {Resources} from '../../../src/common/Resources';
import {JovianLanterns} from '../../../src/cards/colonies/JovianLanterns';
import {SearchForLife} from '../../../src/cards/base/SearchForLife';

describe('FloaterLeasing', function() {
  it('Should play', function() {
    const card = new FloaterLeasing();
    const game = newTestGame(1);
    const player = getTestPlayer(game, 0);
    const action = card.play(player);

    expect(action).is.undefined;

    expect(player.getProduction(Resources.MEGACREDITS)).eq(0);

    const jovianLanterns = new JovianLanterns();
    const searchForLife = new SearchForLife();

    player.playedCards = [jovianLanterns, searchForLife];

    searchForLife.resourceCount = 5;
    jovianLanterns.resourceCount = 2;
    card.play(player);

    expect(player.getProduction(Resources.MEGACREDITS)).eq(0);

    searchForLife.resourceCount = 0;
    jovianLanterns.resourceCount = 5;
    card.play(player);

    expect(player.getProduction(Resources.MEGACREDITS)).eq(1);

    player.setProductionForTest({megacredits: 0});
    searchForLife.resourceCount = 0;
    jovianLanterns.resourceCount = 6;
    card.play(player);

    expect(player.getProduction(Resources.MEGACREDITS)).eq(2);
  });
});
