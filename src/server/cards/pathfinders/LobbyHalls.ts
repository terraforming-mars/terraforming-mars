import {IProjectCard} from '../IProjectCard';
import {IPlayer} from '../../IPlayer';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import {DeclareCloneTag} from '../../pathfinders/DeclareCloneTag';
import {ICloneTagCard} from './ICloneTagCard';

export class LobbyHalls extends Card implements IProjectCard, ICloneTagCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.LOBBY_HALLS,
      cost: 11,

      behavior: {
        production: {megacredits: 2},
        turmoil: {sendDelegates: {count: 1}},
      },

      metadata: {
        cardNumber: 'PfT1',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(2)).delegates(1);
        }),
        description: 'Increase your M€ production 2 steps. Place 1 delegate in any party.' +
                     ' Choose a planet tag. This card counts as having 1 of that tag. Raise the corresponding planetary track 1 step.',
      },
    });
  }

  public cloneTag: Tag = Tag.CLONE;

  public override get tags(): Array<Tag> {
    return [this.cloneTag, Tag.BUILDING];
  }

  public override bespokePlay(player: IPlayer) {
    player.game.defer(new DeclareCloneTag(player, this));
    return undefined;
  }
}
