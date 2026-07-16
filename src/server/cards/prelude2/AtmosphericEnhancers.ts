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
        cardNumber: 'P44',
        renderData: CardRenderer.builder((b) => {
          b.temperature(2, {digit}).slash().oxygen(2, {digit}).br.slash().venus(2, {digit}).br;
          b.cards(2, {secondaryTag: AltSecondaryTag.FLOATER});
        }),
        description: 'Raise temperature 2 steps, or raise oxygen 2 steps, or raise Venus 2 steps. Draw 2 cards with floater icons.',
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
