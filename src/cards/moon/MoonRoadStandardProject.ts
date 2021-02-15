import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {StandardProjectCard} from '../StandardProjectCard';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {PlaceMoonRoadTile} from '../../moon/PlaceMoonRoadTile';
import {Units} from '../../Units';

export class MoonRoadStandardProject extends StandardProjectCard {
  constructor() {
    super({
      name: CardName.MOON_ROAD_STANDARD_PROJECT,
      cost: 18,
      metadata: {
        cardNumber: '',
        renderData: CardRenderer.builder((b) =>
          b.standardProject('Spend 18 MC and 1 steel to place a road on the moon and raise the Logistics Rate 1 step.', (eb) => {
            eb.megacredits(18).steel(1).startAction.moonRoad();
          }),
        ),
      },
    });
  }

  public reserveUnits = Units.of({steel: 1});

  protected discount(player: Player): number {
    if (player.playedCards.find((card) => card.name === CardName.MOONCRATE_BLOCK_FACTORY)) {
      return 4;
    }
    return super.discount(player);
  }

  public canAct(player: Player): boolean {
    const moonData = MoonExpansion.moonData(player.game);
    const spaces = moonData.moon.getAvailableSpacesOnLand(player);

    if (spaces.length === 0) {
      return false;
    }

    return player.canAfford(this.cost) && Units.hasUnits(this.reserveUnits, player);
  }

  actionEssence(player: Player): void {
    const adjustedReserveUnits = MoonExpansion.adjustedReserveCosts(player, this);
    Units.deductUnits(adjustedReserveUnits, player);
    player.game.defer(new PlaceMoonRoadTile(player));
  }
}
