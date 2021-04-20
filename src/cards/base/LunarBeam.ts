import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';

export class LunarBeam extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.LUNAR_BEAM,
      tags: [Tags.EARTH, Tags.ENERGY],
      cost: 13,

      metadata: {
        cardNumber: '030',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().megacredits(2).br;
            pb.plus().heat(2).br;
            pb.plus().energy(2);
          });
        }),
        description: 'Decrease your M€ production 2 steps and increase your heat production and Energy production 2 steps each.',
      },
    });
  }
  public canPlay(player: Player): boolean {
    return player.getProduction(Resources.MEGACREDITS) >= -3;
  }
  public play(player: Player) {
    player.addProduction(Resources.MEGACREDITS, -2);
    player.addProduction(Resources.HEAT, 2);
    player.addProduction(Resources.ENERGY, 2);
    return undefined;
  }
}
