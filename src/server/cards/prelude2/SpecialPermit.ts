import {IProjectCard} from '../IProjectCard';
import {CardType} from '../../../common/cards/CardType';
import {IPlayer} from '../../IPlayer';
import {CardName} from '../../../common/cards/CardName';
import {Resource} from '../../../common/Resource';
import {StealResources} from '../../deferredActions/StealResources';
import {Card} from '../Card';
import {Size} from '../../../common/cards/render/Size';
import {CardRenderer} from '../render/CardRenderer';
import {all, digit} from '../Options';
import {PartyName} from '../../../common/turmoil/PartyName';
import {Tag} from '../../../common/cards/Tag';

export class SpecialPermit extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 5,
      name: CardName.SPECIAL_PERMIT,
      type: CardType.EVENT,
      tags: [Tag.PLANT],
      requirements: {party: PartyName.GREENS},

      metadata: {
        cardNumber: 'P82',
        description: 'Requires that Greens are ruling or that you have 2 delegates there. Steal 4 plants from any player.',
        renderData: CardRenderer.builder((b) => {
          b.text('steal', Size.MEDIUM, true).plants(4, {all, digit});
        }),
      },
    });
  }

  public override bespokePlay(player: IPlayer) {
    player.game.defer(new StealResources(player, Resource.PLANTS, 4));
    return undefined;
  }
}
