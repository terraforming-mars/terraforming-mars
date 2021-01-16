import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';
import {Game} from '../../Game';
import {StandardProjectCard} from '../standardProjects/StandardProjectCard';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {PlaceMoonColonyTile} from '../../moon/PlaceMoonColonyTile';
import {Units} from '../../Units';
import {Resources} from '../../Resources';

export class MoonColonyStandardProject extends StandardProjectCard {
  public name = CardName.STANDARD_PROJECT_MOON_COLONY;
  public cost = 22;

  public metadata: CardMetadata = {
    cardNumber: '',
    renderData: CardRenderer.builder((b) =>
      b.standardProject('Spend 22 MC and 1 titanium to place a colony on the moon and raise your MC production 1 step.', (eb) => {
        eb.megacredits(22).titanium(1).startAction.moonColony().production((pb) => pb.megacredits(1));
      }),
    ),
  };

  public reserveUnits = Units.of({titanium: 1});
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
    game.defer(new PlaceMoonColonyTile(player));
    player.addProduction(Resources.MEGACREDITS, 1, game);
  }
}
