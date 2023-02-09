import {Player} from '../../Player';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {StandardProjectCard} from '../StandardProjectCard';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {PlaceMoonRoadTile} from '../../moon/PlaceMoonRoadTile';
import {TileType} from '../../../common/TileType';
import {AltSecondaryTag} from '../../../common/cards/render/AltSecondaryTag';

export class MoonRoadStandardProject extends StandardProjectCard {
  constructor(properties = {
    name: CardName.MOON_ROAD_STANDARD_PROJECT,
    cost: 18,
    reserveUnits: {steel: 1},
    tr: {moonLogistics: 1},
    tilesBuilt: [TileType.MOON_ROAD],

    metadata: {
      cardNumber: '',
      renderData: CardRenderer.builder((b) =>
        b.standardProject('Spend 18 M€ and 1 steel to place a road on the moon and raise the Logistics Rate 1 step.', (eb) => {
          eb.megacredits(18).steel(1).startAction.moonRoad({secondaryTag: AltSecondaryTag.MOON_LOGISTICS_RATE});
        }),
      ),
    },
  }) {
    super(properties);
  }

  protected override discount(player: Player): number {
    if (player.playedCards.find((card) => card.name === CardName.MOONCRATE_BLOCK_FACTORY)) {
      return 4;
    }
    return super.discount(player);
  }

  public override canAct(player: Player): boolean {
    const moonData = MoonExpansion.moonData(player.game);
    const spaces = moonData.moon.getAvailableSpacesOnLand(player);

    if (spaces.length === 0) {
      return false;
    }

    return super.canAct(player);
  }

  actionEssence(player: Player): void {
    const adjustedReserveUnits = MoonExpansion.adjustedReserveCosts(player, this);
    player.deductUnits(adjustedReserveUnits);
    player.game.defer(new PlaceMoonRoadTile(player));
  }
}
