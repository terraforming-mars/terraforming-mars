import {expect} from 'chai';
import {InvestorPlaza} from '../../../src/server/cards/underworld/InvestorPlaza';
import {testGame} from '../../TestGame';
import {cast, runAllActions} from '../../TestingUtils';
import {UnderworldTestHelper} from '../../underworld/UnderworldTestHelper';

describe('InvestorPlaza', () => {
  it('play', () => {
    const card = new InvestorPlaza();
    const [game, player] = testGame(2);

    cast(card.play(player), undefined);
    runAllActions(game);

    UnderworldTestHelper.assertPlaceCity(player, player.popWaitingFor());
    expect(player.underworldData.corruption).eq(1);
  });
});
