import {ICard} from '../ICard';
import {Tags} from '../../common/cards/Tags';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {ResourceType} from '../../common/ResourceType';
import {SelectCard} from '../../inputs/SelectCard';
import {CardName} from '../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {played} from '../Options';

export class HydrogenToVenus extends Card {
  constructor() {
    super({
      name: CardName.HYDROGEN_TO_VENUS,
      cardType: CardType.EVENT,
      tags: [Tags.SPACE],
      cost: 11,
      tr: {venus: 1},

      metadata: {
        cardNumber: '231',
        renderData: CardRenderer.builder((b) => {
          b.venus(1).br.br; // double br is intentional for visual appeal
          b.floaters(1, {secondaryTag: Tags.VENUS}).slash().jovian({played});
        }),
        description: 'Raise Venus 1 step. Add 1 Floater to A Venus CARD for each Jovian tag you have.',
      },
    });
  }

  public play(player: Player) {
    const jovianTags: number = player.getTagCount(Tags.JOVIAN);
    const floatersCards = player.getResourceCards(ResourceType.FLOATER).filter((card) => card.tags.includes(Tags.VENUS));
    if (jovianTags > 0) {
      if (floatersCards.length === 1) {
        player.addResourceTo(floatersCards[0], {qty: jovianTags, log: true});
      }
      if (floatersCards.length > 1) {
        return new SelectCard(
          'Select card to add ' + jovianTags + ' floater(s)',
          'Add floater(s)',
          floatersCards,
          (foundCards: Array<ICard>) => {
            player.addResourceTo(foundCards[0], {qty: jovianTags, log: true});
            player.game.increaseVenusScaleLevel(player, 1);
            return undefined;
          },
        );
      }
    }
    player.game.increaseVenusScaleLevel(player, 1);
    return undefined;
  }
}
