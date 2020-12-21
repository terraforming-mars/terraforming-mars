import {ICard} from './../ICard';
import {IProjectCard} from './../IProjectCard';
import {Tags} from './../Tags';
import {CardType} from './../CardType';
import {Player} from '../../Player';
import {SelectCard} from '../../inputs/SelectCard';
import {ResourceType} from '../../ResourceType';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class ImportedNutrients implements IProjectCard {
    public cost = 14;
    public tags = [Tags.EARTH, Tags.SPACE];
    public name = CardName.IMPORTED_NUTRIENTS;
    public cardType = CardType.EVENT;

    public play(player: Player) {
      player.plants += 4;
      const microbeCards = player.getResourceCards(ResourceType.MICROBE);

      if (microbeCards.length === 1) {
        player.addResourceTo(microbeCards[0], 4);
        return undefined;
      } else if (microbeCards.length > 1) {
        return new SelectCard('Select card to add 4 microbes', 'Add microbes', microbeCards, (foundCards: Array<ICard>) => {
          player.addResourceTo(foundCards[0], 4);
          return undefined;
        });
      }

      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: 'X26',
      renderData: CardRenderer.builder((b) => {
        b.plants(4).digit.nbsp.microbes(4).digit.asterix();
      }),
      description: 'Gain 4 plants and add 4 microbes to ANOTHER CARD.',
    }
}
