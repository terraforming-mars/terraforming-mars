import {PreludeCard} from '../prelude/PreludeCard';
import {IPlayer} from '../../IPlayer';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';
import {PreludesExpansion} from '../../preludes/PreludesExpansion';
import {IPreludeCard, isPreludeCard} from '../prelude/IPreludeCard';

export class DoubleDown extends PreludeCard {
  constructor() {
    super({
      name: CardName.DOUBLE_DOWN,

      metadata: {
        cardNumber: 'X40',
        description: '',
        renderData: CardRenderer.builder((b) => {
          b.text('Copy your other prelude\'s direct effect.', Size.SMALL, true);
        }),
      },
    });
  }

  private cloneablePreludes(player: IPlayer) {
    const cards = player.playedCards.filter(isPreludeCard)
      .filter((card) => card.name !== this.name)
      .filter((card) => card.canPlay(player));
    if (player.lastCardPlayed === CardName.NEW_PARTNER) {
      // This is a super unfortunate hack. See player.playCard for details.
      const newPartner = player.preludeCardsInHand.filter((card) => card.name === CardName.NEW_PARTNER)[0];
      if (newPartner !== undefined) {
        cards.push(newPartner as IPreludeCard);
      }
    }
    return cards;
  }

  public override bespokeCanPlay(player: IPlayer): boolean {
    return this.cloneablePreludes(player).length> 0;
  }

  public override bespokePlay(player: IPlayer) {
    const preludes = this.cloneablePreludes(player);
    if (preludes.length === 0) {
      PreludesExpansion.fizzle(player, this);
      return undefined;
    }
    return PreludesExpansion.playPrelude(player, preludes, 'action-only');
  }
}
