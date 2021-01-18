import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardRenderer} from '../render/CardRenderer';
import {Resources} from '../../Resources';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {MoonSpaces} from '../../moon/MoonSpaces';
import {Card} from '../Card';
import {Units} from '../../Units';
import {TileType} from '../../TileType';
import {IMoonCard} from './IMoonCard';

export class MareNectarisMine extends Card implements IProjectCard, IMoonCard {
  constructor() {
    super({
      name: CardName.MARE_NECTARIS_MINE,
      cardType: CardType.AUTOMATED,
      tags: [Tags.MOON, Tags.BUILDING],
      cost: 14,
      productionDelta: Units.of({steel: 1}),

      metadata: {
        description: 'Spend 1 titanium. Increase your steel production 1 step. Place a mine ON THE RESERVED AREA and raise the Mining Rate 1 step.',
        cardNumber: 'M01',
        renderData: CardRenderer.builder((b) => {
          b.minus().titanium(1).nbsp;
          b.production((pb) => pb.steel(1));
          b.moonMine().asterix();
        }),
      },
    });
  }

  public reserveUnits = Units.of({titanium: 1});
  public tilesBuilt = [TileType.MOON_MINE];

  public play(player: Player) {
    Units.deductUnits(this.reserveUnits, player);
    player.addProduction(Resources.STEEL, 1);
    MoonExpansion.addMineTile(player, MoonSpaces.MARE_NECTARIS, this.name);
    MoonExpansion.raiseMiningRate(player);
    return undefined;
  }
}
