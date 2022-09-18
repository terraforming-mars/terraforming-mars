import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {Player} from '../../Player';
import {Resources} from '../../../common/Resources';
import {CardRenderer} from '../render/CardRenderer';
import {played} from '../Options';

export class OrbitalCleanup extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.ORBITAL_CLEANUP,
      tags: [Tag.EARTH, Tag.SPACE],
      cost: 14,
      victoryPoints: 2,

      behavior: {
        production: {megacredits: -2},
      },

      metadata: {
        cardNumber: 'X08',

        renderData: CardRenderer.builder((b) => {
          b.action('Gain 1 M€ per Science tag you have.', (eb) => {
            eb.empty().startAction.megacredits(1).slash().science(1, {played});
          }).br;
          b.production((pb) => {
            pb.megacredits(-2);
          });
        }),
        description: 'Decrease your M€ production 2 steps.',
      },
    });
  }

  public canAct(): boolean {
    return true;
  }

  public action(player: Player) {
    player.addResource(Resources.MEGACREDITS, player.tags.count(Tag.SCIENCE), {log: true});
    return undefined;
  }
}
