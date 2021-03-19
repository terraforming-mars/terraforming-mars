import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardRenderer} from '../render/CardRenderer';
import {MoonSpaces} from '../../moon/MoonSpaces';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {Units} from '../../Units';
import {TileType} from '../../TileType';
import {IMoonCard} from './IMoonCard';
import {MoonCard} from './MoonCard';

export class MareNubiumMine extends MoonCard implements IProjectCard, IMoonCard {
  constructor() {
    super({
      name: CardName.MARE_NUBIUM_MINE,
      cardType: CardType.AUTOMATED,
      tags: [Tags.MOON, Tags.BUILDING],
      cost: 17,
      productionBox: Units.of({titanium: 1}),

      metadata: {
        description: 'Spend 1 titanium. Increase your titanium production 1 step. Place a mine ON THE RESERVED AREA and raise the Mining Rate 1 step.',
        cardNumber: 'M02',
        renderData: CardRenderer.builder((b) => {
          b.minus().titanium(1);
          b.production((pb) => pb.titanium(1)).moonMine().asterix();
        }),
      },
    }, {
      reserveUnits: Units.of({titanium: 1}),
      tilesBuilt: [TileType.MOON_MINE],
    });
  }


  public play(player: Player) {
    super.play(player);
    MoonExpansion.addMineTile(player, MoonSpaces.MARE_NUBIUM, this.name);
    MoonExpansion.raiseMiningRate(player);
    return undefined;
  }
}
