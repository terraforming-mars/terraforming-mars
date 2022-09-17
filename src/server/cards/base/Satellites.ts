import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {Resources} from '../../../common/Resources';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {played} from '../Options';

export class Satellites extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.SATELLITES,
      tags: [Tag.SPACE],
      cost: 10,

      metadata: {
        cardNumber: '175',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.megacredits(1).slash().space({played});
          });
        }),
        description: 'Increase your M€ production 1 step for each space tag you have, including this one.',
      },
    });
  }
  public override bespokePlay(player: Player) {
    player.production.add(Resources.MEGACREDITS, 1 + player.tags.count(Tag.SPACE), {log: true});
    return undefined;
  }
}
