import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {Tags} from '../Tags';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {TileType} from '../../TileType';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../Units';
import {MoonCard} from './MoonCard';
import {CardRequirements} from '../CardRequirements';

export class HypersensitiveSiliconChipFactory extends MoonCard {
  constructor() {
    super({
      name: CardName.HYPERSENSITIVE_SILICON_CHIP_FACTORY,
      cardType: CardType.AUTOMATED,
      tags: [Tags.BUILDING],
      cost: 11,
      productionBox: Units.of({megacredits: 4}),
      requirements: CardRequirements.builder((b) => b.miningTiles(2)),

      metadata: {
        description: 'Requires 2 mining tiles on the Moon. Spend 2 titanium. Increase your MC production 4 steps.',
        cardNumber: 'M43',
        renderData: CardRenderer.builder((b) => {
          b.minus().titanium(2).nbsp;
          b.production((pb) => pb.megacredits(4)).br;
        }),
      },
    }, {
      reserveUnits: Units.of({titanium: 2}),
    });
  };

  public canPlay(player: Player): boolean {
    return MoonExpansion.tiles(player.game, TileType.MOON_MINE, true).length >= 2;
  }

  public play(player: Player) {
    super.play(player);
    return undefined;
  }
}
