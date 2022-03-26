import {expect} from 'chai';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {CoordinatedRaid} from '../../../src/cards/pathfinders/CoordinatedRaid';
import {SelectColony} from '../../../src/inputs/SelectColony';
import {ColonyName} from '../../../src/common/colonies/ColonyName';
import {Game} from '../../../src/Game';
import {TestPlayer} from '../../TestPlayer';
import {Colony} from '../../../src/colonies/Colony';
import {ColonyBenefit} from '../../../src/colonies/ColonyBenefit';
import {Resources} from '../../../src/common/Resources';
import {TestingUtils} from '../../TestingUtils';
import {Units} from '../../../src/common/Units';
import {ShouldIncreaseTrack} from '../../../src/common/colonies/ShouldIncreaseTrack';

export class TestColony extends Colony {
  public name = 'TestColony' as ColonyName;
  public description = 'Test';
  public buildType = ColonyBenefit.GAIN_RESOURCES;
  public override buildQuantity = [3, 3, 3];
  public override buildResource = Resources.TITANIUM;
  public tradeType = ColonyBenefit.GAIN_RESOURCES;
  public override tradeQuantity = [4, 5, 6, 7, 8, 9, 10];
  public override tradeResource = Resources.MEGACREDITS;
  public colonyBonusType = ColonyBenefit.GAIN_RESOURCES;
  public override colonyBonusQuantity = 7;
  public override colonyBonusResource = Resources.STEEL;
  public override shouldIncreaseTrack = ShouldIncreaseTrack.YES;
}

describe('CoordinatedRaid', function() {
  let card: CoordinatedRaid;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new CoordinatedRaid();
    game = newTestGame(2, {
      coloniesExtension: true,
      customColoniesList: [
        ColonyName.PLUTO,
        ColonyName.TRITON,
        ColonyName.CALLISTO,
        ColonyName.ENCELADUS,
        ColonyName.LUNA,
      ],
    });
    player = getTestPlayer(game, 0);
    player2 = getTestPlayer(game, 1);
    // This shortens the array.
    game.colonies = [game.colonies[0], new TestColony()];
  });

  it('play', function() {
    const colony = game.colonies[1];
    colony.addColony(player2);
    colony.addColony(player2);
    const action = card.play(player);
    const selectColony = TestingUtils.cast(action, SelectColony);

    expect(player.getResourcesForTest()).deep.eq(Units.EMPTY);
    expect(player2.getResourcesForTest()).deep.eq(Units.of({titanium: 6}));

    selectColony.cb(colony);
    TestingUtils.runAllActions(game);

    expect(player.getResourcesForTest()).deep.eq(Units.of({titanium: 0, steel: 14, megacredits: 6}));
    expect(player2.getResourcesForTest()).deep.eq(Units.of({titanium: 6}));
  });

  it('Coordinated Raid ignores Trade Envoys', function() {
    player.colonyTradeOffset += 2;
    const colony = game.colonies[1];
    colony.addColony(player2);
    const selectColony = TestingUtils.cast(card.play(player), SelectColony);

    expect(player.getResourcesForTest()).deep.eq(Units.EMPTY);

    selectColony.cb(colony);
    TestingUtils.runAllActions(game);

    expect(player.getResourcesForTest()).deep.eq(Units.of({titanium: 0, steel: 7, megacredits: 5}));
  });
});
