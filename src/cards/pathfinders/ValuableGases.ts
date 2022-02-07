import {Tags} from '../../common/cards/Tags';
import {Player} from '../../Player';
import {PreludeCard} from '../prelude/PreludeCard';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../common/cards/CardName';
import {ResourceType} from '../../common/ResourceType';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../render/Size';
import {AltSecondaryTag} from '../render/CardRenderItem';
import {Resources} from '../../common/Resources';
import {digit} from '../Options';
import {CardType} from '../../common/cards/CardType';
import {DeferredAction} from '../../deferredActions/DeferredAction';
import {SelectHowToPayForProjectCard} from '../../inputs/SelectHowToPayForProjectCard';

// TODO(kberg) like #3644, this card may have similar behavior.
export class ValuableGases extends PreludeCard implements IProjectCard {
  constructor() {
    super({
      name: CardName.VALUABLE_GASES_PATHFINDERS,
      tags: [Tags.JOVIAN, Tags.VENUS],

      metadata: {
        cardNumber: '',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(10).br;
          b.text('play', Size.MEDIUM, true).cards(1, {secondaryTag: AltSecondaryTag.FLOATER}).asterix().br;
          b.projectRequirements().br;
          b.floaters(5, {digit});
        }),
        description: 'Gain 10 M€. Play an active floater card from hand, ignoring global requirements, and add 5 floaters to it.',
      },
    });
  }
  public getRequirementBonus(player: Player): number {
    if (player.lastCardPlayed === this.name) {
      // Magic number high enough to always ignore requirements.
      return 50;
    }
    return 0;
  }
  public play(player: Player) {
    player.addResource(Resources.MEGACREDITS, 10);

    const playableCards = player.cardsInHand.filter((card) => {
      return card.resourceType === ResourceType.FLOATER && card.cardType === CardType.ACTIVE;
    });
    if (playableCards.length !== 0) {
      player.game.defer(new DeferredAction(player, () => {
        return new SelectHowToPayForProjectCard(
          player,
          playableCards,
          (selectedCard, howToPay) => player.checkHowToPayAndPlayCard(selectedCard, howToPay));
      }));
    }

    return undefined;
  }
  public onCardPlayed(player: Player, card: IProjectCard) {
    const playedCards = player.playedCards;
    if (playedCards.length > 1 && playedCards[playedCards.length - 2].name === this.name) {
      player.addResourceTo(card, 5);
    }
    return undefined;
  }
}
