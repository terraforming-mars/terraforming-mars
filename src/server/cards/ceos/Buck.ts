import {CardName} from '../../../common/cards/CardName';
import {Player} from '../../Player';
import {PlayerInput} from '../../PlayerInput';
import {CardRenderer} from '../render/CardRenderer';
import {CeoCard} from './CeoCard';

import {CardType} from '../../../common/cards/CardType';
import {SelectCard} from '../../inputs/SelectCard';
import {IProjectCard} from '../IProjectCard';
import {AltSecondaryTag} from '../../../common/cards/render/AltSecondaryTag';
import {Size} from '../../../common/cards/render/Size';

export class Buck extends CeoCard {
  constructor() {
    super({
      name: CardName.BUCK,
      metadata: {
        cardNumber: 'L36',
        renderData: CardRenderer.builder((b) => {
          b.opgArrow().text('TAKE BACK', Size.SMALL).cards(1, {secondaryTag: AltSecondaryTag.GREEN}).asterix();
          b.br;
        }),
        description: 'Once per game, take a played automated (green) card back into your hand. You may not take back a card that places a non-ocean tile on ocean spaces.',
      },
    });
  }

  public override canAct(player: Player): boolean {
    if (!super.canAct(player)) {
      return false;
    }
    const targetCards = this.getAvailableCards(player);
    return targetCards.length > 0;
  }

  public action(player: Player): PlayerInput | undefined {
    return new SelectCard(
      'Select card to take back into hand',
      'Select',
      this.getAvailableCards(player),
      (foundCards: Array<IProjectCard>) => {
        const selectedCard = player.playedCards.splice(player.playedCards.indexOf(foundCards[0]), 1)[0];
        player.cardsInHand.push(selectedCard);
        this.isDisabled = true;
        return undefined;
      },
    );
  }

  private getAvailableCards(player: Player): IProjectCard[] {
    const disallowedCards = [
      // Dissallow cards that place non-ocean tiles on ocean hexes
      CardName.PROTECTED_VALLEY,
      CardName.MOHOLE_AREA,
      CardName.MANGROVE,
    ];
    let targetCards = player.playedCards.filter((c) => c.cardType === CardType.AUTOMATED);
    targetCards = targetCards.filter((c) => !disallowedCards.includes(c.name));

    return targetCards;
  }
}
