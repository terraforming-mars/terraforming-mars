import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {Player} from '../../Player';
import {Resources} from '../../../common/Resources';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {digit} from '../Options';

export class DuskLaserMining extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.DUSK_LASER_MINING,
      cost: 8,
      tags: [Tag.SPACE],

      behavior: {
        stock: {titanium: 4},
      },

      requirements: CardRequirements.builder((b) => b.tag(Tag.SCIENCE, 2)),
      metadata: {
        cardNumber: 'X01',
        description: 'Requires 2 Science tags. Decrease your energy production 1 step, and increase your titanium production 1 step. Gain 4 titanium.',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().energy(1).br;
            pb.plus().titanium(1);
          }).nbsp.titanium(4, {digit});
        }),
      },
    });
  }

  public override bespokeCanPlay(player: Player): boolean {
    return player.production.energy >= 1;
  }

  public override bespokePlay(player: Player) {
    player.production.add(Resources.ENERGY, -1);
    player.production.add(Resources.TITANIUM, 1);
    return undefined;
  }
}
