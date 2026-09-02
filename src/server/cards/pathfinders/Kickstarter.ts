import {IProjectCard} from '../IProjectCard';
import {IPlayer} from '../../IPlayer';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import {DeclareCloneTag} from '../../pathfinders/DeclareCloneTag';
import {ICloneTagCard} from './ICloneTagCard';
import {PathfindersExpansion} from '../../pathfinders/PathfindersExpansion';

export class Kickstarter extends Card implements IProjectCard, ICloneTagCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.KICKSTARTER,
      cost: 12,

      metadata: {
        cardNumber: 'Pf41',
        renderData: CardRenderer.builder((b) => {
          b.planetaryTrack().text('3');
        }),
        description: 'Choose a planet tag. This card counts as having 1 of that tag. Raise the corresponding planetary track 3 steps in total.',
      },
    });
  }

  public cloneTag: Tag = Tag.CLONE;

  public override get tags(): Array<Tag> {
    return [this.cloneTag];
  }

  public override bespokePlay(player: IPlayer) {
    // player.production.adjust(this.productionBox); Why was this here? Remove it, I suppose.
    player.game.defer(new DeclareCloneTag(player, this))
      // +2 instead of +3 because onCardPlayed covers applying one of the 3.
      .andThen((tag) => PathfindersExpansion.raiseTrack(tag, player, 2));
    return undefined;
  }
}
