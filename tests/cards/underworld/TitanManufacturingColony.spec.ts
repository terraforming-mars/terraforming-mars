import {expect} from 'chai';
import {TitanManufacturingColony} from '../../../src/server/cards/underworld/TitanManufacturingColony';
import {testGame} from '../../TestGame';
import {cast, fakeCard, runAllActions} from '../../TestingUtils';
import {Tag} from '../../../src/common/cards/Tag';
import {UnderworldTestHelper} from '../../underworld/UnderworldTestHelper';

describe('TitanManufacturingColony', () => {
  it('onCardPlayed', () => {
    const card = new TitanManufacturingColony();
    const [/* game */, player] = testGame(2);

    card.onCardPlayed(player, fakeCard());
    expect(card.resourceCount).eq(0);

    card.onCardPlayed(player, fakeCard({tags: [Tag.SCIENCE]}));
    expect(card.resourceCount).eq(0);

    card.onCardPlayed(player, fakeCard({tags: [Tag.JOVIAN]}));
    expect(card.resourceCount).eq(1);

    card.onCardPlayed(player, fakeCard({tags: [Tag.JOVIAN, Tag.JOVIAN]}));
    expect(card.resourceCount).eq(3);
  });

  it('canAct', () => {
    const card = new TitanManufacturingColony();
    const [/* game */, player] = testGame(2, {underworldExpansion: true});

    expect(card.canAct(player)).is.false;

    card.resourceCount = 1;

    expect(card.canAct(player)).is.true;
  });

  it('action', () => {
    const card = new TitanManufacturingColony();
    const [game, player] = testGame(2, {underworldExpansion: true});

    card.resourceCount = 1;

    cast(card.action(player), undefined);

    runAllActions(game);
    expect(card.resourceCount).eq(0);
    UnderworldTestHelper.assertIsExcavationAction(player, player.popWaitingFor());
    runAllActions(game);
    cast(player.popWaitingFor(), undefined);
  });
});
