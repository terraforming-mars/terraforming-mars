import {Player} from '../../Player';
import {PreludeCard} from '../prelude/PreludeCard';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Resources} from '../../Resources';
import {Tags} from '../Tags';
import {CardType} from '../CardType';

export class DeepSpaceOperations extends PreludeCard {
  constructor() {
    super({
      name: CardName.DEEP_SPACE_OPERATIONS,

      metadata: {
        cardNumber: 'P08',
        renderData: CardRenderer.builder((b) => {
          b.titanium(4).br;
          // TODO(kberg): allow more than one secondary tag.
          b.cards(2, {secondaryTag: Tags.EVENT}).asterix();
        }),
        description: 'Gain 4 titanium. Draw 2 event cards with a space tag.',
      },
    });
  }
  public play(player: Player) {
    player.addResource(Resources.TITANIUM, 4);
    player.drawCard(2, {
      tag: Tags.SPACE,
      cardType: CardType.EVENT,
    });
    return undefined;
  }
}

