import {expect} from 'chai';
import {cast, formatMessage} from '../TestingUtils';
import {TestPlayer} from '../TestPlayer';
import {InputRequest} from '../../src/server/InputRequest';
import {SelectSpace} from '../../src/server/inputs/SelectSpace';
import {ICard} from '../../src/server/cards/ICard';
import {SelectCard} from '../../src/server/inputs/SelectCard';
import {TileType} from '../../src/common/TileType';
import {SelectColony} from '../../src/server/inputs/SelectColony';
import {OrOptions} from '../../src/server/inputs/OrOptions';
import {UnderworldExpansion} from '../../src/server/underworld/UnderworldExpansion';
import {oneWayDifference} from '../../src/common/utils/utils';

export class UnderworldTestHelper {
  public static assertIsExcavationAction(player: TestPlayer, input: InputRequest | undefined, ignorePlacementRestrictions: boolean = false) {
    const selectSpace = cast(input, SelectSpace);
    const candidateSpaces = selectSpace.spaces;

    if (ignorePlacementRestrictions) {
      const strictlyExcavatableSpaces = UnderworldExpansion.excavatableSpaces(player, false, true);
      expect(oneWayDifference(candidateSpaces, strictlyExcavatableSpaces)).is.not.empty;
    }

    const space = selectSpace.spaces[0];

    expect(space.excavator).is.undefined;

    const plants = player.plants;
    space.undergroundResources = 'plant1';
    selectSpace.cb(space);

    expect(space.excavator).eq(player);
    expect(player.plants - plants).eq(1);
  }

  public static assertIsIdentificationAction(player: TestPlayer, input: InputRequest | undefined) {
    const selectSpace = cast(input, SelectSpace);
    const space = selectSpace.spaces[0];

    expect(space.undergroundResources).is.undefined;

    player.defer(selectSpace.cb(space));

    expect(space.undergroundResources).is.not.undefined;
  }

  public static assertIsMaybeBlock(_player :TestPlayer, input: InputRequest | undefined, choice: 'fighters' | 'corruption' | 'do not block') {
    const orOptions = cast(input, OrOptions);

    expect(formatMessage(orOptions.title)).contains('Spend 1 corruption to block an attack by');

    const option = orOptions.options.find((o) => formatMessage(o.title).toLowerCase().indexOf(choice) > -1);
    option!.cb();
  }

  public static assertIsAddResourceToCard(input: InputRequest | undefined, count: number, expectedCards: Array<ICard>, card: ICard) {
    const selectCard = cast(input, SelectCard);
    expect(selectCard.cards).to.have.members(expectedCards);

    const initialValue = card.resourceCount;
    selectCard.cb([card]);
    expect(initialValue + count).eq(card.resourceCount);
  }

  public static assertPlaceCity(player: TestPlayer, input: InputRequest | undefined, idx: number = 0) {
    this.assertPlaceTile(player, input, TileType.CITY, idx);
  }

  public static assertPlaceOcean(player: TestPlayer, input: InputRequest | undefined, idx: number = 0) {
    this.assertPlaceTile(player, input, TileType.OCEAN, idx);
  }


  public static assertPlaceTile(player: TestPlayer, input: InputRequest | undefined, tileType: TileType, idx: number = 0) {
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

  public static assertBuildColony(player: TestPlayer, input: InputRequest | undefined, idx: number = 0) {
    const selectColony = cast(input, SelectColony);
    const colony = selectColony.colonies[idx];
    expect(colony.colonies).is.empty;

    selectColony.cb(colony);

    expect(colony.colonies).deep.eq([player.id]);
  }
}
