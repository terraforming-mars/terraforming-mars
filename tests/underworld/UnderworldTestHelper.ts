import {expect} from 'chai';
import {cast} from '../TestingUtils';
import {TestPlayer} from '../TestPlayer';
import {PlayerInput} from '../../src/server/PlayerInput';
import {SelectSpace} from '../../src/server/inputs/SelectSpace';
import {ICard} from '../../src/server/cards/ICard';
import {SelectCard} from '../../src/server/inputs/SelectCard';

export class UnderworldTestHelper {
  public static assertIsExcavationAction(player: TestPlayer, input: PlayerInput | undefined) {
    const selectSpace = cast(input, SelectSpace);
    const space = selectSpace.spaces[0];

    expect(space.excavator).is.undefined;

    const plants = player.plants;
    space.undergroundResources = 'plant1';
    selectSpace.cb(space);

    expect(space.excavator).eq(player);
    expect(player.plants - plants).eq(1);
  }

  public static assertIsIdentificationAction(player: TestPlayer, input: PlayerInput | undefined) {
    const selectSpace = cast(input, SelectSpace);
    const space = selectSpace.spaces[0];

    expect(space.undergroundResources).is.undefined;

    player.defer(selectSpace.cb(space));

    expect(space.undergroundResources).is.not.undefined;
  }

  public static assertIsAddResourceToCard(input: PlayerInput | undefined, count: number, expectedCards: Array<ICard>, card: ICard) {
    const selectCard = cast(input, SelectCard);
    expect(selectCard.cards).to.have.members(expectedCards);

    const initialValue = card.resourceCount;
    selectCard.cb([card]);
    expect(initialValue + count).eq(card.resourceCount);
  }
}
