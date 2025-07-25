import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../IPlayer';
import {Resource} from '../../../common/Resource';

export class Racketeering extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.RACKETEERING,
      type: CardType.AUTOMATED,
      cost: 5,
      tags: [Tag.CRIME],
      victoryPoints: -1,
      requirements: {corruption: 1},

      metadata: {
        cardNumber: 'U092',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(1).slash().tag(Tag.CRIME).asterix());
        }),
        description: 'Requires 1 corruption. Increase your M€ production one step for each crime tag you have INCLUDING EVENTS and this card.',
      },
    });
  }

  public override bespokePlay(player: IPlayer) {
    // +1 for includes this.
    const tags = player.tags.count(Tag.CRIME, 'raw-underworld') + player.tags.count(Tag.WILD) + 1;
    player.production.add(Resource.MEGACREDITS, tags, {log: true});
    return undefined;
  }
}
