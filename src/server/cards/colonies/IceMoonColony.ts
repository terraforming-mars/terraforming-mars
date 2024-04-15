import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {IPlayer} from '../../IPlayer';
import {CardName} from '../../../common/cards/CardName';
import {Card} from '../Card';
import {CardRenderer} from '../render/CardRenderer';

export class IceMoonColony extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 23,
      tags: [Tag.SPACE],
      name: CardName.ICE_MOON_COLONY,
      type: CardType.AUTOMATED,

      behavior: {
        colonies: {buildColony: {}},
        ocean: {},
      },

      metadata: {
        cardNumber: 'C15',
        renderData: CardRenderer.builder((b) => b.colonies(1).oceans(1)),
        description: 'Place 1 colony and 1 ocean tile.',
      },
    });
  }

  public override bespokeCanPlay(player: IPlayer): boolean {
    return player.colonies.getPlayableColonies().length > 0;
  }
}
