import {IProjectCard} from '../IProjectCard';
import {CardType} from '../../../common/cards/CardType';
import {IPlayer} from '../../IPlayer';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {Size} from '../../../common/cards/render/Size';
import {ColonyName} from '../../../common/colonies/ColonyName';
import {uppercase} from '../Options';
import {comparing} from '../../../common/utils/Ordering';

export class ProductiveOutpost extends Card implements IProjectCard {
  private rank: Readonly<Partial<Record<ColonyName, number>>> = {
    [ColonyName.TITANIA]: -1,
    [ColonyName.LEAVITT]: 1,
  };

  constructor() {
    super({
      cost: 0,
      name: CardName.PRODUCTIVE_OUTPOST,
      type: CardType.AUTOMATED,

      metadata: {
        cardNumber: 'C30',
        renderData: CardRenderer.builder((b) => {
          b.text('Gain all your colony bonuses.', {size: Size.SMALL, uppercase});
        }),
      },
    });
  }

  public override bespokePlay(player: IPlayer) {
    // TODO(kberg): Make it possible for Leavitt to resolve before Titania.
    const sorted = player.game.colonies.toSorted(comparing((c) => this.rank[c.name] ?? 0));

    sorted.forEach((colony) => {
      colony.colonies.filter((owner) => owner === player.id).forEach((owner) => {
        // Not using GiveColonyBonus deferred action because it's only for the active player
        player.defer(() => colony.giveColonyBonus(player.game.getPlayerById(owner)));
      });
    });
    return undefined;
  }
}
