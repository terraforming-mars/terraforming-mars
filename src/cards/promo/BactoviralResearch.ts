import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {ResourceType} from '../../ResourceType';
import {SelectCard} from '../../inputs/SelectCard';
import {ICard} from '../ICard';
import {played} from '../Options';

export class BactoviralResearch extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.BACTOVIRAL_RESEARCH,
      tags: [Tags.MICROBE, Tags.SCIENCE],
      cost: 10,
      metadata: {
        cardNumber: 'X35',
        renderData: CardRenderer.builder((b) => {
          b.cards(1).br.br; // double br is intentional for visual appeal
          b.microbes(1).asterix().slash().science(1, {played});
        }),
        description: 'Draw 1 card. Choose 1 of your played cards and add 1 microbe to it for each science tag you have, including this.',
      },
    });
  }

  public play(player: Player) {
    player.drawCard();

    const scienceTags: number = player.getTagCount(Tags.SCIENCE) + 1;
    const microbeCards = player.getResourceCards(ResourceType.MICROBE);

    if (microbeCards.length === 0) {
      return undefined;
    } else if (microbeCards.length === 1) {
      player.addResourceTo(microbeCards[0], {qty: scienceTags, log: true});
    } else if (microbeCards.length > 1) {
      return new SelectCard(
        'Select card to add ' + scienceTags + ' microbe(s)',
        'Add microbe(s)',
        microbeCards,
        (foundCards: Array<ICard>) => {
          player.addResourceTo(foundCards[0], {qty: scienceTags, log: true});
          return undefined;
        },
      );
    }
    return undefined;
  }
}
