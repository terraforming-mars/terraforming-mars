import {expect} from 'chai';
import {InvestorPlaza} from '../../../src/server/cards/underworld/InvestorPlaza';
import {testGame} from '../../TestGame';
import {runAllActions} from '../../TestingUtils';
import {assertPlaceCity} from '../../assertions';
import {cast} from '../../../src/common/utils/utils';

describe('InvestorPlaza', () => {
  it('play', () => {
    const card = new InvestorPlaza();
    const [game, player] = testGame(2);

    cast(card.play(player), undefined);
    runAllActions(game);

    assertPlaceCity(player, player.popWaitingFor());
    expect(player.underworldData.corruption).eq(1);
  });
});
