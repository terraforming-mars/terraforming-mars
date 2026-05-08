import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {IProjectCard} from '../IProjectCard';
import {IPlayer} from '../../IPlayer';

export class SmugglingOperations extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.EVENT,
      name: CardName.SMUGGLING_OPERATIONS,
      tags: [Tag.SPACE],
      cost: 12,
      metadata: {
        cardNumber: 'B52',
        description: 'Get Colony and Trade bonuses from a Colony. Only you get these resources. Do not change the colony level.',
        renderData: CardRenderer.builder((b) => {
          b.colonies(1);
        }),
      },
    });
  }

  public override play(player: IPlayer) {
    // TODO: Present colony selection. Collect trade bonus at current track position
    // without advancing the track or distributing colony bonuses to colony owners.
    // Requires a no-side-effect trade hook in the colony system.
    player.game.log('${0} played Smuggling Operations (colony trade hook pending)', (b) => b.player(player));
    return undefined;
  }
}
