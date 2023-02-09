import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {SelectAmount} from '../../inputs/SelectAmount';
import {Resources} from '../../../common/Resources';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {multiplier} from '../Options';

export class Insulation extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.INSULATION,
      cost: 2,

      metadata: {
        cardNumber: '152',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.text('-X').heat(1).nbsp.text('+').megacredits(0, {multiplier});
          });
        }),
        description: 'Decrease your heat production any number of steps and increase your M€ production the same number of steps.',
      },
    });
  }

  public override bespokeCanPlay(player: Player) {
    return player.production.heat >= 1;
  }

  public override bespokePlay(player: Player) {
    return new SelectAmount(
      'Select amount of heat production to decrease',
      'Decrease',
      (amount: number) => {
        player.production.add(Resources.HEAT, -amount, {log: true});
        player.production.add(Resources.MEGACREDITS, amount, {log: true});
        return undefined;
      },
      1,
      player.production.heat,
    );
  }
}
