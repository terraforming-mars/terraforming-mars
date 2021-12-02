import {Player} from '../../Player';
import {PreludeCard} from '../prelude/PreludeCard';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Units} from '../../Units';

export class PersonalAgenda extends PreludeCard {
  constructor() {
    super({
      name: CardName.PERSONAL_AGENDA,
      productionBox: Units.of({megacredits: 3}),

      metadata: {
        cardNumber: 'P08',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(3)).br;
          // TODO(kberg): allow more than one secondary tag.
          b.cards(3, {secondaryTag: Tags.EVENT}).asterix();
        }),
        description: 'Increase your M€ production 3 steps. Draw 3 event cards that do not have a space tag.',
      },
    });
  }
  public play(player: Player) {
    player.adjustProduction(this.productionBox, {log: true});
    player.drawCard(3, {
      include: (card) => {
        return card.cardType === CardType.EVENT &&
          (card.tags.includes(Tags.SPACE) === false);
      }});
    return undefined;
  }
}

