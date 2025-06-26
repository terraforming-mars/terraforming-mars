import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {CoordinatedRaid} from '../../../src/server/cards/pathfinders/CoordinatedRaid';
import {SelectColony} from '../../../src/server/inputs/SelectColony';
import {ColonyName} from '../../../src/common/colonies/ColonyName';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {Colony} from '../../../src/server/colonies/Colony';
import {ColonyBenefit} from '../../../src/common/colonies/ColonyBenefit';
import {Resource} from '../../../src/common/Resource';
import {cast, runAllActions} from '../../TestingUtils';
import {Units} from '../../../src/common/Units';

export class TestColony extends Colony {
  constructor() {
    super({
      name: 'TestColony' as ColonyName,
      description: {
        buildBonus: '',
        tradeBonus: '',
        colonyBonus: '',
      },
      buildType: ColonyBenefit.GAIN_RESOURCES,
      buildQuantity: [3, 3, 3],
      buildResource: Resource.TITANIUM,
      tradeType: ColonyBenefit.GAIN_RESOURCES,
      tradeQuantity: [4, 5, 6, 7, 8, 9, 10],
      tradeResource: Resource.MEGACREDITS,
      colonyBonusType: ColonyBenefit.GAIN_RESOURCES,
      colonyBonusQuantity: 7,
      colonyBonusResource: Resource.STEEL,
      shouldIncreaseTrack: 'yes',
    });
  }
}

describe('CoordinatedRaid', () => {
  let card: CoordinatedRaid;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new CoordinatedRaid();
    [game, player, player2] = testGame(2, {
      coloniesExtension: true,
      customColoniesList: [
        ColonyName.PLUTO,
        ColonyName.TRITON,
        ColonyName.CALLISTO,
        ColonyName.ENCELADUS,
        ColonyName.LUNA,
      ],
    });
    // This shortens the array.
    game.colonies = [game.colonies[0], new TestColony()];
  });

  it('play', () => {
    const colony = game.colonies[1];
    colony.addColony(player2);
    colony.addColony(player2);
    const action = card.play(player);
    const selectColony = cast(action, SelectColony);

    expect(player.stock.asUnits()).deep.eq(Units.EMPTY);
    expect(player2.stock.asUnits()).deep.eq(Units.of({titanium: 6}));

    selectColony.cb(colony);
    runAllActions(game);

    expect(player.stock.asUnits()).deep.eq(Units.of({titanium: 0, steel: 14, megacredits: 6}));
    expect(player2.stock.asUnits()).deep.eq(Units.of({titanium: 6}));
  });

  it('Coordinated Raid ignores Trade Envoys', () => {
    player.colonies.tradeOffset += 2;
    const colony = game.colonies[1];
    colony.addColony(player2);
    const selectColony = cast(card.play(player), SelectColony);

    expect(player.stock.asUnits()).deep.eq(Units.EMPTY);

    selectColony.cb(colony);
    runAllActions(game);

    expect(player.stock.asUnits()).deep.eq(Units.of({titanium: 0, steel: 7, megacredits: 5}));
  });
});
