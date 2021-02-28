import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {Tags} from '../Tags';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {TileType} from '../../TileType';
import {CardRenderer} from '../render/CardRenderer';
import {CardRequirements} from '../CardRequirements';
import {Units} from '../../Units';
import {MoonCard} from './MoonCard';

export class LunaResort extends MoonCard {
  constructor() {
    super({
      name: CardName.LUNA_RESORT,
      cardType: CardType.AUTOMATED,
      tags: [Tags.MOON],
      cost: 11,
      productionBox: Units.of({energy: -1, megacredits: 3}),

      requirements: CardRequirements.builder((b) => b.colonies(2)),
      metadata: {
        description:
          'Requires 2 colonies on the Moon. Spend 2 titanium. Decrease your energy production 1 step and increase your MC production 3 steps. Raise Colony Rate 1 step.',
        cardNumber: 'M21',
        renderData: CardRenderer.builder((b) => {
          b.minus().titanium(2).production((pb) => {
            pb.minus().energy(1).nbsp.megacredits(3);
          }).br;
          b.moonColonyRate();
        }),
      },
    }, {
      reserveUnits: Units.of({titanium: 2}),
    });
  };

  public canPlay(player: Player): boolean {
    return Units.canAdjustProduction(this.productionBox, player) &&
      MoonExpansion.tiles(player.game, TileType.MOON_COLONY, true).length >= 2;
  }

  public play(player: Player) {
    super.play(player);
    MoonExpansion.raiseColonyRate(player);
    return undefined;
  }
}
