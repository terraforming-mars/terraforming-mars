import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {CardResource} from '../../../common/CardResource';
import {SelectCard} from '../../inputs/SelectCard';
import {played} from '../Options';

export class BactoviralResearch extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.BACTOVIRAL_RESEARCH,
      tags: [Tag.MICROBE, Tag.SCIENCE],
      cost: 10,

      behavior: {
        drawCard: 1,
      },

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

  public override bespokePlay(player: Player) {
    const scienceTags = player.tags.count(Tag.SCIENCE) + 1;
    const microbeCards = player.getResourceCards(CardResource.MICROBE);

    if (microbeCards.length === 0) {
      return undefined;
    } else if (microbeCards.length === 1) {
      player.addResourceTo(microbeCards[0], {qty: scienceTags, log: true});
    } else if (microbeCards.length > 1) {
      return new SelectCard(
        'Select card to add ' + scienceTags + ' microbe(s)',
        'Add microbe(s)',
        microbeCards,
        ([card]) => {
          player.addResourceTo(card, {qty: scienceTags, log: true});
          return undefined;
        },
      );
    }
    return undefined;
  }
}
