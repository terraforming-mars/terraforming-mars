import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';
import {Game} from '../../Game';
import {StandardProjectCard} from '../standardProjects/StandardProjectCard';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {PlaceMoonRoadTile} from '../../moon/PlaceMoonRoadTile';
import {Units} from '../../Units';

export class MoonRoadStandardProject extends StandardProjectCard {
  public name = CardName.STANDARD_PROJECT_MOON_ROAD;
  public cost = 18;

  public metadata: CardMetadata = {
    cardNumber: '',
    renderData: CardRenderer.builder((b) =>
      b.standardProject('Spend 18 MC and 1 steel to place a road on the moon and raise the Logistics Rate 1 step.', (eb) => {
        eb.megacredits(18).steel(1).startAction.moonRoad();
      }),
    ),
  };

  public reserveUnits = Units.of({steel: 1});

  protected discount(player: Player): number {
    if (player.playedCards.find((card) => card.name === CardName.MOONCRATE_BLOCK_FACTORY)) {
      return 4;
    }
    return super.discount(player);
  }

  public canAct(player: Player, game: Game): boolean {
    const moonData = MoonExpansion.moonData(game);
    const spaces = moonData.moon.getAvailableSpacesOnLand(player);

    if (spaces.length === 0) {
      return false;
    }

    return player.canAfford(this.cost, game) && Units.hasUnits(this.reserveUnits, player);
  }

  actionEssence(player: Player, game: Game): void {
    Units.deductUnits(this.reserveUnits, player);
    game.defer(new PlaceMoonRoadTile(player));
  }
}
