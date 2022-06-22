import {Tags} from '../../common/cards/Tags';
import {Player} from '../../Player';
import {PreludeCard} from './PreludeCard';
import {CardName} from '../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class AcquiredSpaceAgency extends PreludeCard {
  constructor() {
    super({
      name: CardName.ACQUIRED_SPACE_AGENCY,

      metadata: {
        cardNumber: 'P35',
        renderData: CardRenderer.builder((b) => {
          b.titanium(6, {digit: true}).br.br; // double break intentional
          b.cards(2, {secondaryTag: Tags.SPACE});
        }),
        description: 'Gain 6 titanium. Reveal cards until you reveal two cards with Space Tags. Take them into your hand, discard the rest.',
      },
    });
  }
  public play(player: Player) {
    player.titanium += 6;
    player.drawCard(2, {tag: Tags.SPACE});
    return undefined;
  }
}

