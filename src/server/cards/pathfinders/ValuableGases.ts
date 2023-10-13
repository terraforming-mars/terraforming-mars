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
        cardNumber: '',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(10).br;
          b.text('play', Size.MEDIUM, true).cards(1, {secondaryTag: AltSecondaryTag.FLOATER}).asterix().br;
          b.floaters(5, {digit});
        }),
        description: 'Gain 10 M€. Play an active floater card from hand, ignoring requirements, and add 5 floaters to it.',
      },
    });
  }

  public override bespokePlay(player: IPlayer) {
    player.stock.add(Resource.MEGACREDITS, 10);

    const playableCards = player.cardsInHand.filter((card) => {
      return card.resourceType === CardResource.FLOATER &&
        card.type === CardType.ACTIVE &&
        player.canAfford(player.affordOptionsForCard(card));
    }).map((card) => {
      return {
        card: card,
        details: true,
      };
    });
    if (playableCards.length !== 0) {
      player.defer(new SelectProjectCardToPlay(player, playableCards)
        .andThen((card) => {
          player.addResourceTo(card, 5);
          return undefined;
        }));
    }

    return undefined;
  }
}
