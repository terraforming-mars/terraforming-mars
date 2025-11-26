import {CardType} from '@/common/cards/CardType';
import {IProjectCard} from '@/server/cards/IProjectCard';
import {CardName} from '@/common/cards/CardName';
import {CardRenderer} from '@/server/cards/render/CardRenderer';
import {Card} from '@/server/cards/Card';
import {Tag} from '@/common/cards/Tag';
import {all} from '@/server/cards/Options';
import {IPlayer} from '@/server/IPlayer';
import {SelectPlayer} from '@/server/inputs/SelectPlayer';
import {UnderworldExpansion} from '@/server/underworld/UnderworldExpansion';

export class MediaFrenzy extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.EVENT,
      name: CardName.MEDIA_FRENZY,
      tags: [Tag.EARTH],
      cost: 6,

      behavior: {
        drawCard: {count: 2, type: CardType.EVENT},
      },

      metadata: {
        cardNumber: 'U086',
        renderData: CardRenderer.builder((b) => {
          b.minus().corruption(1, {all}).cards(2, {secondaryTag: Tag.EVENT});
        }),
        description: 'Remove up to 1 corruption from another player. Reveal 2 cards from the deck until you reveal 2 event cards. Take them into hand and discard the rest.',
      },
    });
  }

  public override bespokeCanPlay(player: IPlayer): boolean {
    if (player.game.isSoloMode()) {
      return true;
    }
    return this.opponentsWithCorruption(player).length > 0;
  }


  public override bespokePlay(player: IPlayer) {
    if (player.game.isSoloMode()) {
      return undefined;
    }

    player.defer(new SelectPlayer(this.opponentsWithCorruption(player), 'Select player to lose 1 corruption', 'Select player')
      .andThen((target) => {
        const privateMilitaryContractor = target.tableau.get(CardName.PRIVATE_MILITARY_CONTRACTOR);
        if (privateMilitaryContractor && privateMilitaryContractor.resourceCount > 0) {
          target.maybeBlockAttack(player, '', (proceed) => {
            if (proceed) {
              UnderworldExpansion.loseCorruption(target, 1, {log: true});
            }
            return undefined;
          });
        } else {
          UnderworldExpansion.loseCorruption(target, 1, {log: true});
        }
        return undefined;
      }));
    return undefined;
  }

  private opponentsWithCorruption(player: IPlayer) {
    return player.opponents.filter((opponent) => opponent.underworldData.corruption > 0);
  }
}
