import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {SelectCard} from '../../inputs/SelectCard';
import {CardResource} from '../../../common/CardResource';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {digit} from '../Options';

export class ImportedNutrients extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.IMPORTED_NUTRIENTS,
      tags: [Tag.EARTH, Tag.SPACE],
      cost: 14,

      behavior: {
        stock: {plants: 4},
      },

      metadata: {
        cardNumber: 'X22',
        renderData: CardRenderer.builder((b) => {
          b.plants(4, {digit}).nbsp.microbes(4, {digit}).asterix();
        }),
        description: 'Gain 4 plants and add 4 microbes to ANOTHER CARD.',
      },
    });
  }

  public override bespokePlay(player: Player) {
    const microbeCards = player.getResourceCards(CardResource.MICROBE);

    if (microbeCards.length === 1) {
      player.addResourceTo(microbeCards[0], 4);
      return undefined;
    } else if (microbeCards.length > 1) {
      return new SelectCard('Select card to add 4 microbes', 'Add microbes', microbeCards, ([card]) => {
        player.addResourceTo(card, 4);
        return undefined;
      });
    }

    return undefined;
  }
}
