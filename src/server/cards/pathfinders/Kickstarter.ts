import {IProjectCard} from '../IProjectCard';
import {Player} from '../../Player';
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
      cardType: CardType.AUTOMATED,
      name: CardName.KICKSTARTER,
      cost: 12,

      metadata: {
        cardNumber: 'PfTBD',
        renderData: CardRenderer.builder((b) => {
          b.planetaryTrack().text('3');
        }),
        description: 'Choose a planetary track and raise it 3 steps. This card counts as a card with a tag of the chosen planet.',
      },
    });
  }

  public cloneTag: Tag = Tag.CLONE;

  public override get tags(): Array<Tag> {
    return [this.cloneTag];
  }

  public override bespokePlay(player: Player) {
    // player.production.adjust(this.productionBox); Why was this here? Remove it, I suppose.
    player.game.defer(
      new DeclareCloneTag(
        player,
        this,
        // +2 instead of +3 because onCardPlayed covers applying one of the 3.
        (tag) => PathfindersExpansion.raiseTrack(tag, player, 2),
      ));
    return undefined;
  }
}
