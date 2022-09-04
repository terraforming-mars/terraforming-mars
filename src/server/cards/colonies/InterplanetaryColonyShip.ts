import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {CardName} from '../../../common/cards/CardName';
import {BuildColony} from '../../deferredActions/BuildColony';
import {Card} from '../Card';
import {CardRenderer} from '../render/CardRenderer';

export class InterplanetaryColonyShip extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 12,
      tags: [Tag.SPACE, Tag.EARTH],
      name: CardName.INTERPLANETARY_COLONY_SHIP,
      cardType: CardType.EVENT,

      metadata: {
        cardNumber: 'C17',
        renderData: CardRenderer.builder((b) => b.colonies(1)),
        description: 'Place a colony.',
      },
    });
  }

  public override bespokeCanPlay(player: Player): boolean {
    return player.colonies.getPlayableColonies().length > 0;
  }

  public override bespokePlay(player: Player) {
    player.game.defer(new BuildColony(player, {title: 'Select colony for Interplanetary Colony Ship'}));
    return undefined;
  }
}
