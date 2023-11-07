import {expect} from 'chai';
import {GeologicalExpertise} from '../../../src/server/cards/underworld/GeologicalExpertise';
import {testGame} from '../../TestGame';
import {cast, runAllActions} from '../../TestingUtils';
import {UnderworldTestHelper} from '../../underworld/UnderworldTestHelper';
import {Tag} from '../../../src/common/cards/Tag';

describe('GeologicalExpertise', () => {
  it('Should play', () => {
    const card = new GeologicalExpertise();
    const [game, player] = testGame(2, {underworldExpansion: true});

    cast(card.play(player), undefined);
    runAllActions(game);

    UnderworldTestHelper.assertIsIdentificationAction(player, player.popWaitingFor());
    runAllActions(game);
    UnderworldTestHelper.assertIsIdentificationAction(player, player.popWaitingFor());
    runAllActions(game);
    UnderworldTestHelper.assertIsIdentificationAction(player, player.popWaitingFor());
    runAllActions(game);
    UnderworldTestHelper.assertIsIdentificationAction(player, player.popWaitingFor());
    runAllActions(game);
    cast(player.popWaitingFor(), undefined);
    expect(player.cardsInHand).has.length(2);
    expect(player.cardsInHand[0].tags).includes(Tag.SCIENCE);
    expect(player.cardsInHand[1].tags).includes(Tag.SCIENCE);
  });
});
