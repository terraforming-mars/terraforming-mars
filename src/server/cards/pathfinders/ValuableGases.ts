import {Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../IPlayer';
import {PreludeCard} from '../prelude/PreludeCard';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardResource} from '../../../common/CardResource';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';
import {AltSecondaryTag} from '../../../common/cards/render/AltSecondaryTag';
import {Resource} from '../../../common/Resource';
import {digit} from '../Options';
import {CardType} from '../../../common/cards/CardType';
import {SelectProjectCardToPlay} from '../../inputs/SelectProjectCardToPlay';

// TODO(kberg) like #3644, this card may have similar behavior.
export class ValuableGases extends PreludeCard implements IProjectCard {
  constructor() {
    super({
      name: CardName.VALUABLE_GASES_PATHFINDERS,
      tags: [Tag.JOVIAN, Tag.VENUS],
      // 50 steps ensures "ignore requirements"
      globalParameterRequirementBonus: {steps: 50, nextCardOnly: true},

      metadata: {
        cardNumber: 'PfP02',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(10);
          b.text('play', Size.MEDIUM, true).cards(1, {secondaryTag: AltSecondaryTag.FLOATER}).asterix().br.projectRequirements().br;
          b.resource(CardResource.FLOATER, {amount: 5, digit});
        }),
        description: 'Gain 10 M€. PLAY AN ACTIVE FLOATER CARD FROM HAND, IGNORING GLOBAL REQUIREMENTS, and add 5 floaters to it.',
      },
    });
  }

  public override bespokeCanPlay(player: IPlayer): boolean {
    // What a hack.
    player.megaCredits += 10;
    try {
      return this.getPlayableCards(player).length > 0;
    } finally {
      player.megaCredits -= 10;
    }
  }

  public override bespokePlay(player: IPlayer) {
    player.stock.add(Resource.MEGACREDITS, 10);

    const playableCards = this.getPlayableCards(player);
    if (playableCards.length !== 0) {
      player.defer(new SelectProjectCardToPlay(player, playableCards)
        .andThen((card) => {
          player.addResourceTo(card, 5);
          return undefined;
        }));
    }

    return undefined;
  }

  private getPlayableCards(player: IPlayer) {
    return player.cardsInHand.filter((card) => {
      return card.resourceType === CardResource.FLOATER &&
        card.type === CardType.ACTIVE &&
        player.canAfford(player.affordOptionsForCard(card));
    });
  }
}
