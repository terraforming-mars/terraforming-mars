import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {Resources} from '../../../common/Resources';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {all, played} from '../Options';

export class TollStation extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.TOLL_STATION,
      tags: [Tag.SPACE],
      cost: 12,

      metadata: {
        cardNumber: '099',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.megacredits(1).slash().space({played, all}).asterix();
          });
        }),
        description: 'Increase your M€ production 1 step for each space tag your OPPONENTS have.',
      },
    });
  }
  public override bespokePlay(player: Player) {
    const amount = player.game.getPlayers()
      .filter((aPlayer) => aPlayer !== player)
      .map((opponent) => opponent.tags.count(Tag.SPACE, 'raw'))
      .reduce((a, c) => a + c, 0);
    player.production.add(Resources.MEGACREDITS, amount, {log: true});
    return undefined;
  }
}
