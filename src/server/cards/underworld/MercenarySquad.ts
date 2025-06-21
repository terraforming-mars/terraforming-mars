import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
// import {Tag} from '../../../common/cards/Tag';
import {all} from '../Options';
import {IPlayer} from '../../IPlayer';
import {PlayerInput} from '../../PlayerInput';
import {RemoveResourcesFromCard} from '../../deferredActions/RemoveResourcesFromCard';
import {Tag} from '../../../common/cards/Tag';

export class MercenarySquad extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.EVENT,
      name: CardName.MERCENARY_SQUAD,
      cost: 1,
      tags: [Tag.CRIME],

      requirements: {corruption: 1},

      metadata: {
        cardNumber: 'U83',
        renderData: CardRenderer.builder((b) => {
          b.minus().wild(2, {all});
        }),
        description: 'Requires 1 corruption. Remove up to 2 resources from ANY card',
      },
    });
  }

  public override bespokeCanPlay(player: IPlayer): boolean {
    const cards = RemoveResourcesFromCard.getAvailableTargetCards(player, undefined);
    if (cards.length === 0) {
      return false;
    }
    if (player.game.getPlayers().length > 1) {
      if (!cards.some((card) => player.game.getCardPlayerOrThrow(card.name) !== player)) {
        this.warnings.add('selfTarget');
      }
    }
    return true;
  }

  public override bespokePlay(player: IPlayer): PlayerInput | undefined {
    player.game.defer(new RemoveResourcesFromCard(player, undefined, 2, {blockable: true, autoselect: false}));
    return undefined;
  }
}
