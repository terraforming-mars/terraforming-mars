import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {Card} from '../Card';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {Resources} from '../../common/Resources';
import {CardName} from '../../common/cards/CardName';
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
  public override canPlay(player: Player): boolean {
    return player.getProduction(Resources.MEGACREDITS) >= -3;
  }
  public play(player: Player) {
    player.addProduction(Resources.MEGACREDITS, -2);
    player.addProduction(Resources.HEAT, 2);
    player.addProduction(Resources.ENERGY, 2);
    return undefined;
  }
}
