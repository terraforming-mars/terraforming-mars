import {IPlayer} from '../../IPlayer';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {StandardProjectCard} from '../StandardProjectCard';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {PlaceMoonMineTile} from '../../moon/PlaceMoonMineTile';
import {Resource} from '../../../common/Resource';
import {TileType} from '../../../common/TileType';
import {AltSecondaryTag} from '../../../common/cards/render/AltSecondaryTag';

export class MoonMineStandardProject extends StandardProjectCard {
  constructor(properties = {
    name: CardName.MOON_MINE_STANDARD_PROJECT,
    cost: 20,
    reserveUnits: {titanium: 1},
    tr: {moonMining: 1},
    tilesBuilt: [TileType.MOON_MINE],

    metadata: {
      cardNumber: '',
      renderData: CardRenderer.builder((b) =>
        b.standardProject('Spend 20 M€ and 1 titanium to place a mine on The Moon, raise the mining rate 1 step, and raise steel production 1 step.', (eb) => {
          eb.megacredits(20).titanium(1).startAction.moonMine({secondaryTag: AltSecondaryTag.MOON_MINING_RATE}).production((pb) => pb.steel(1));
        }),
      ),
    },
  }) {
    super(properties);
  }

  protected override discount(player: IPlayer): number {
    if (player.playedCards.find((card) => card.name === CardName.MOONCRATE_BLOCK_FACTORY)) {
      return 4;
    }
    return super.discount(player);
  }

  public override canAct(player: IPlayer): boolean {
    const moonData = MoonExpansion.moonData(player.game);
    const spaces = moonData.moon.getAvailableSpacesForMine(player);

    if (spaces.length === 0) {
      return false;
    }

    return super.canAct(player);
  }

  actionEssence(player: IPlayer): void {
    const adjustedReserveUnits = MoonExpansion.adjustedReserveCosts(player, this);
    player.stock.deductUnits(adjustedReserveUnits);
    player.game.defer(new PlaceMoonMineTile(player));
    player.production.add(Resource.STEEL, 1, {log: true});
  }
}
