import {CanAffordOptions, IPlayer} from '../../IPlayer';
import {PreludeCard} from '../prelude/PreludeCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import {CardResource} from '../../../common/CardResource';
import {TRSource} from '../../../common/cards/TRSource';
import {digit} from '../Options';
import {floaterCards} from '../venusNext/floaterCards';
import {AltSecondaryTag} from '../../../common/cards/render/AltSecondaryTag';
import {Size} from '../../../common/cards/render/Size';

export class AtmosphericEnhancers extends PreludeCard {
  constructor() {
    super({
      name: CardName.ATMOSPHERIC_ENHANCERS,
      tags: [Tag.VENUS],

      behavior: {
        or: {
          behaviors: [
            {global: {temperature: 2}, title: 'Raise the temperature 2 steps'},
            {global: {oxygen: 2}, title: 'Raise the oxygen level 2 steps'},
            {global: {venus: 2}, title: 'Raise the Venus scale level 2 steps'},
          ],
        },
      },

      metadata: {
        cardNumber: '',
        renderData: CardRenderer.builder((b) => {
          b.temperature(2, {digit}).or(Size.SMALL).oxygen(2, {digit}).br.or(Size.SMALL).venus(2, {digit}).br;
          b.cards(2, {secondaryTag: AltSecondaryTag.FLOATER});
        }),
        description: 'Effect: Raise either the temperature or oxygen or Venus 2 steps. ' +
        'Reveal cards from the deck until you have revealed 2 cards with a floater icon on it. ' +
        'Take those 2 cards into hand and discard the rest.',
      },
    });
  }

  public override bespokeCanPlay(player: IPlayer, canAffordOptions: CanAffordOptions) {
    function adjusted(trSource: TRSource) {
      return {...canAffordOptions, tr: trSource};
    }
    return (
      player.canAfford(adjusted({oxygen: 2})) ||
      player.canAfford(adjusted({temperature: 2})) ||
      player.canAfford(adjusted({venus: 2}))
    );
  }

  public override bespokePlay(player: IPlayer) {
    player.drawCard(2, {
      include: (card) => floaterCards.has(card.name) || card.resourceType === CardResource.FLOATER,
    });
    return undefined;
  }
}
