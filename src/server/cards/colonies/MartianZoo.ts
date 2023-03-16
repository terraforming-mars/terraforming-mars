import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {CardName} from '../../../common/cards/CardName';
import {CardResource} from '../../../common/CardResource';
import {CardRequirements} from '../CardRequirements';
import {ActionCard} from '../ActionCard';
import {CardRenderer} from '../render/CardRenderer';
import {all, played} from '../Options';

export class MartianZoo extends ActionCard implements IProjectCard {
  constructor() {
    super({
      cost: 12,
      tags: [Tag.ANIMAL, Tag.BUILDING],
      name: CardName.MARTIAN_ZOO,
      type: CardType.ACTIVE,
      resourceType: CardResource.ANIMAL,
      requirements: CardRequirements.builder((b) => b.cities(2, {all})),
      victoryPoints: 1,

      action: {
        stock: {megacredits: {resourcesHere: {}}},
        // Shouldn't be playable when no resources are on the card?
      },

      metadata: {
        cardNumber: 'C24',
        renderData: CardRenderer.builder((b) => {
          b.effect('When you play an Earth tag, place an animal here.', (eb) => {
            eb.earth(1, {played}).startEffect.animals(1);
          }).br;
          b.action('Gain 1M€ per animal here.', (eb) => {
            eb.empty().startAction.megacredits(1).slash().animals(1);
          });
        }),
        description: {
          text: 'Requires 2 city tiles in play.',
          align: 'left',
        },
      },
    });
  }


  public onCardPlayed(player: Player, card: IProjectCard) {
    const count = player.tags.cardTagCount(card, Tag.EARTH);
    if (count > 0) {
      player.addResourceTo(this, count);
    }
  }
}
