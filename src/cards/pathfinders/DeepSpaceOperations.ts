import {Player} from '../../Player';
import {PreludeCard} from '../prelude/PreludeCard';
import {CardName} from '../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Resources} from '../../common/Resources';
import {Tags} from '../../common/cards/Tags';
import {CardType} from '../../common/cards/CardType';
import {played} from '../Options';

export class DeepSpaceOperations extends PreludeCard {
  constructor() {
    super({
      name: CardName.DEEP_SPACE_OPERATIONS,

      metadata: {
        cardNumber: 'P08',
        renderData: CardRenderer.builder((b) => {
          b.titanium(4).br;
          // TODO(kberg): allow more than one secondary tag.
          b.cards(2, {secondaryTag: Tags.EVENT}).text('(').space({played}).text(')');
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

