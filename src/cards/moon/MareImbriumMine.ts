import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardRenderer} from '../render/CardRenderer';
import {Resources} from '../../Resources';
import {MoonSpaces} from '../../moon/MoonSpaces';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {Card} from '../Card';
import {Units} from '../../Units';
import {TileType} from '../../TileType';
import {IMoonCard} from './IMoonCard';

export class MareImbriumMine extends Card implements IProjectCard, IMoonCard {
  constructor() {
    super({
      name: CardName.MARE_IMBRIUM_MINE,
      cardType: CardType.AUTOMATED,
      tags: [Tags.MOON, Tags.BUILDING],
      cost: 19,
      productionDelta: Units.of({steel: 1, titanium: 1}),

      metadata: {
        description: 'Spend 1 titanium. Increase your steel production 1 step and your titanium production 1 step. Place a mine ON THE RESERVED AREA and raise Mining Rate 1 step.',
        cardNumber: 'M03',
        renderData: CardRenderer.builder((b) => {
          b.minus().titanium(1);
          b.production((pb) => pb.steel(1).titanium(1)).br;
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
    player.addProduction(Resources.TITANIUM, 1);
    MoonExpansion.addMineTile(player, MoonSpaces.MARE_IMBRIUM, this.name);
    MoonExpansion.raiseMiningRate(player);
    return undefined;
  }
}
