import {IActionCard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {Card} from '../Card';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {CardName} from '../../common/cards/CardName';
import {Resources} from '../../common/Resources';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../render/Size';
import {all} from '../Options';

export class MartianRails extends Card implements IActionCard, IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.MARTIAN_RAILS,
      tags: [Tags.BUILDING],
      cost: 13,

      metadata: {
        cardNumber: '007',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 1 Energy to gain 1 M€ for each City tile ON MARS.', (eb) => {
            eb.energy(1).startAction.megacredits(1).slash();
            eb.city({all, size: Size.SMALL}).asterix();
          }).br;
        }),
      },
    });
  }

  public play(_player: Player) {
    return undefined;
  }
  public canAct(player: Player): boolean {
    return player.energy >= 1;
  }
  public action(player: Player) {
    player.deductResource(Resources.ENERGY, 1);
    player.addResource(Resources.MEGACREDITS, player.game.getCitiesOnMarsCount(), {log: true});
    return undefined;
  }
}
