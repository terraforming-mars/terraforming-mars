import {PreludeCard} from '../prelude/PreludeCard';
import {Player} from '../../Player';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';
import {CardType} from '../../../common/cards/CardType';
import {SelectCard} from '../../inputs/SelectCard';

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

  private cloneablePreludes(player: Player) {
    return player.playedCards.filter((card) => card.type === CardType.PRELUDE)
      .filter((card) => card.name !== this.name)
      .filter((card) => card.canPlay(player));
  }

  public override bespokeCanPlay(player: Player): boolean {
    return this.cloneablePreludes(player).length> 0;
  }

  public override bespokePlay(player: Player) {
    const preludes = this.cloneablePreludes(player);
    if (preludes.length === 0) {
      return undefined;
    }
    return new SelectCard(
      'Choose prelude card to play',
      undefined,
      preludes,
      ([card]) => {
        player.playCard(card, undefined, 'action-only');
        return undefined;
      },
    );
  }
}
