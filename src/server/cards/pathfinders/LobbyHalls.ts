import {IProjectCard} from '../IProjectCard';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import {SendDelegateToArea} from '../../deferredActions/SendDelegateToArea';
import {DeclareCloneTag} from '../../pathfinders/DeclareCloneTag';
import {ICloneTagCard} from './ICloneTagCard';
import {Turmoil} from '../../turmoil/Turmoil';

export class LobbyHalls extends Card implements IProjectCard, ICloneTagCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.LOBBY_HALLS,
      cost: 11,

      behavior: {
        production: {megacredits: 2},
      },

      metadata: {
        cardNumber: 'PfTBD',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(2)).delegates(1);
        }),
        // TODO(kberg): remove "from reserve" like Cultural Metropolis.
        description: 'Increase your M€ production 2 steps. Place 1 delegate from reserve in any party.',
      },
    });
  }

  public cloneTag: Tag = Tag.CLONE;

  public override get tags(): Array<Tag> {
    return [this.cloneTag, Tag.BUILDING];
  }

  public override bespokePlay(player: Player) {
    player.game.defer(new DeclareCloneTag(player, this));
    const turmoil = Turmoil.getTurmoil(player.game);
    if (turmoil.getAvailableDelegateCount(player.id, 'reserve') > 0) {
      player.game.defer(new SendDelegateToArea(player, undefined, {source: 'reserve'}));
    }
    return undefined;
  }
}
