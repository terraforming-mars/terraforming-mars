import {Card} from '../Card';
import {Player} from '../../Player';
import {IProjectCard} from '../IProjectCard';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {Resource} from '../../../common/Resource';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';
import {all} from '../Options';
import {RemoveResourcesFromCard} from '../../deferredActions/RemoveResourcesFromCard';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';
import {StealResources} from '../../deferredActions/StealResources';
import {CardResource} from '../../../common/CardResource';

export class CEOHeartAttack extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.EVENT,
      name: CardName.CEO_HEART_ATTACK,
      cost: 3,
      tags: [Tag.RADIATION],
      victoryPoints: -1,

      metadata: {
        cardNumber: 'N48',
        renderData: CardRenderer.builder((b) => {
          b.text('steal', Size.MEDIUM, true).megacredits(4, {all});
          b.text('AND', Size.MEDIUM, true).radiations(1, {all}).br;
          b.text('next card', Size.SMALL, true).colon().megacredits(-6);
        }),
        description: 'Steal up to 4 M€ and 1 radiation from any player Your next action cost 6€ less.',
      },
    });
  }

  public override bespokeCanPlay(): boolean {
    return true;
  }

  public override bespokePlay(player: Player) {
    player.game.defer(new RemoveResourcesFromCard(player, CardResource.RADIATION));
    player.game.defer(new AddResourcesToCard(player, CardResource.RADIATION));
    player.game.defer(new StealResources(player, Resource.MEGACREDITS, 4));
    return undefined;
  }

  public override getCardDiscount(player: Player) {
    if (player.lastCardPlayed === this.name) {
      return 6;
    }
    return 0;
  }
}

