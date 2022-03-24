import {Player} from '../../Player';
import {CardName} from '../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {StandardProjectCard} from '../StandardProjectCard';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {PlaceMoonMineTile} from '../../moon/PlaceMoonMineTile';
import {Units} from '../../common/Units';
import {Resources} from '../../common/Resources';
import {IMoonCard} from './IMoonCard';
import {TileType} from '../../common/TileType';
import {AltSecondaryTag} from '../../common/cards/render/AltSecondaryTag';

export class MoonMineStandardProject extends StandardProjectCard implements IMoonCard {
  constructor(properties = {
    name: CardName.MOON_MINE_STANDARD_PROJECT,
    cost: 20,
    reserveUnits: Units.of({titanium: 1}),
    tr: {moonMining: 1},

    metadata: {
      cardNumber: '',
      renderData: CardRenderer.builder((b) =>
        b.standardProject('Spend 20 M€ and 1 titanium to place a mine on the moon, raise the Mining Rate 1 step, and raise steel production 1 step.', (eb) => {
          eb.megacredits(20).titanium(1).startAction.moonMine({secondaryTag: AltSecondaryTag.MOON_MINING_RATE}).production((pb) => pb.steel(1));
        }),
      ),
    },
  }) {
    super(properties);
  }

  public tilesBuilt = [TileType.MOON_MINE];

  protected override discount(player: Player): number {
    if (player.playedCards.find((card) => card.name === CardName.MOONCRATE_BLOCK_FACTORY)) {
      return 4;
    }
    return super.discount(player);
  }

  public override canAct(player: Player): boolean {
    const moonData = MoonExpansion.moonData(player.game);
    const spaces = moonData.moon.getAvailableSpacesForMine(player);

    if (spaces.length === 0) {
      return false;
    }

    return super.canAct(player);
  }

  actionEssence(player: Player): void {
    const adjustedReserveUnits = MoonExpansion.adjustedReserveCosts(player, this);
    player.deductUnits(adjustedReserveUnits);
    player.game.defer(new PlaceMoonMineTile(player));
    player.addProduction(Resources.STEEL, 1, {log: true});
  }
}
