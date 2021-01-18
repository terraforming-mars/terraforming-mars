import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';
import {Game} from '../../Game';
import {StandardProjectCard} from '../standardProjects/StandardProjectCard';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {PlaceMoonMineTile} from '../../moon/PlaceMoonMineTile';
import {Units} from '../../Units';
import {Resources} from '../../Resources';

export class MoonMineStandardProject extends StandardProjectCard {
  public name = CardName.STANDARD_PROJECT_MOON_MINE;
  public cost = 20;
  public metadata: CardMetadata = {
    cardNumber: '',
    renderData: CardRenderer.builder((b) =>
      b.standardProject('Spend 20 MC and 1 titanium to place a mine on the moon and raise steel production 1 step.', (eb) => {
        eb.megacredits(20).titanium(1).startAction.moonMine().production((pb) => pb.steel(1));
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
    const spaces = moonData.moon.getAvailableSpacesForMine(player);

    if (spaces.length === 0) {
      return false;
    }

    return player.canAfford(this.cost, game) && Units.hasUnits(this.reserveUnits, player);
  }

  actionEssence(player: Player, game: Game): void {
    Units.deductUnits(this.reserveUnits, player);
    game.defer(new PlaceMoonMineTile(player));
    player.addProduction(Resources.STEEL, 1, game);
  }
}
