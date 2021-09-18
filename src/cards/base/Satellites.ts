import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {played} from '../Options';

export class Satellites extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.SATELLITES,
      tags: [Tags.SPACE],
      cost: 10,

      metadata: {
        cardNumber: '175',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.megacredits(1).slash().space({played});
          });
        }),
        description: 'Increase your M€ production 1 step for each space tag your have, including this one.',
      },
    });
  }
  public play(player: Player) {
    player.addProduction(Resources.MEGACREDITS, 1 + player.getTagCount(Tags.SPACE), {log: true});
    return undefined;
  }
}
