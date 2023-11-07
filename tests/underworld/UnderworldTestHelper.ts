import {expect} from 'chai';
import {cast} from '../TestingUtils';
import {TestPlayer} from '../TestPlayer';
import {PlayerInput} from '../../src/server/PlayerInput';
import {SelectSpace} from '../../src/server/inputs/SelectSpace';
import {ICard} from '../../src/server/cards/ICard';
import {SelectCard} from '../../src/server/inputs/SelectCard';
import {TileType} from '../../src/common/TileType';
import {SelectColony} from '../../src/server/inputs/SelectColony';

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

  public static assertPlaceCity(player: TestPlayer, input: PlayerInput | undefined, idx: number = 0) {
    this.assertPlaceTile(player, input, TileType.CITY, idx);
  }

  public static assertPlaceOcean(player: TestPlayer, input: PlayerInput | undefined, idx: number = 0) {
    this.assertPlaceTile(player, input, TileType.OCEAN, idx);
  }


  public static assertPlaceTile(player: TestPlayer, input: PlayerInput | undefined, tileType: TileType, idx: number = 0) {
    const selectSpace = cast(input, SelectSpace);
    const space = selectSpace.spaces[idx];
    space.bonus = [];
    expect(space?.tile?.tileType).is.undefined;
    expect(space.player).is.undefined;

    selectSpace.cb(space);

    expect(space?.tile?.tileType).eq(tileType);
    if (tileType !== TileType.OCEAN) {
      expect(space.player).eq(player);
    }
  }

  public static assertBuildColony(player: TestPlayer, input: PlayerInput | undefined, idx: number = 0) {
    const selectColony = cast(input, SelectColony);
    const colony = selectColony.colonies[idx];
    expect(colony.colonies).is.empty;

    selectColony.cb(colony);

    expect(colony.colonies).deep.eq([player.id]);
  }
}
