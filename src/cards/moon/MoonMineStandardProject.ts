import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {StandardProjectCard} from '../StandardProjectCard';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {PlaceMoonMineTile} from '../../moon/PlaceMoonMineTile';
import {Units} from '../../Units';
import {Resources} from '../../Resources';

export class MoonMineStandardProject extends StandardProjectCard {
  constructor() {
    super({
      name: CardName.MOON_MINE_STANDARD_PROJECT,
      cost: 20,
      metadata: {
        cardNumber: '',
        renderData: CardRenderer.builder((b) =>
          b.standardProject('Spend 20 MC and 1 titanium to place a mine on the moon and raise steel production 1 step.', (eb) => {
            eb.megacredits(20).titanium(1).startAction.moonMine().production((pb) => pb.steel(1));
          }),
        ),
      },
    });
  }

  public reserveUnits = Units.of({titanium: 1});

  protected discount(player: Player): number {
    if (player.playedCards.find((card) => card.name === CardName.MOONCRATE_BLOCK_FACTORY)) {
      return 4;
    }
    return super.discount(player);
  }

  public canAct(player: Player): boolean {
    const moonData = MoonExpansion.moonData(player.game);
    const spaces = moonData.moon.getAvailableSpacesForMine(player);

    if (spaces.length === 0) {
      return false;
    }

    return player.canAfford(this.cost) && Units.hasUnits(this.reserveUnits, player);
  }

  actionEssence(player: Player): void {
    const adjustedReserveUnits = MoonExpansion.adjustedReserveCosts(player, this);
    Units.deductUnits(adjustedReserveUnits, player);
    player.game.defer(new PlaceMoonMineTile(player));
    player.addProduction(Resources.STEEL, 1, player.game);
  }
}
