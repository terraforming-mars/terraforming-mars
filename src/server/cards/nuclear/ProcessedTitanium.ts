import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {ActionCard} from '../ActionCard';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {CardRequirements} from '../requirements/CardRequirements';
import {Size} from '../../../common/cards/render/Size';

export class ProcessedTitanium extends ActionCard implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.PROCESSED_TITANIUM,
      tags: [Tag.SCIENCE, Tag.SPACE],
      cost: 8,

      action: {
        or: {
          behaviors: [
            {
              title: 'Decrease your M€ production 2 steeps to increase your steel production 1 step.',
              production: {megacredits: -2, steel: 1},
            },
            {
              title: 'Decrease your M€ production 2 steeps to increase your titanium production 1 step.',
              production: {megacredits: -2, titanium: 1},
            },

          ],
          autoSelect: true,
        },
      },

      behavior: {
        production: {megacredits: 2},
      },

      requirements: CardRequirements.builder((b) => b.tag(Tag.SCIENCE, 6)),

      metadata: {
        cardNumber: 'N74',
        renderData: CardRenderer.builder((b) => {
          b.action('Decrease your M€ production 2 steeps to increase your steel production 1 step or titanium production 1 step.', (eb) => {
            eb.startAction.production((pb) => pb.megacredits(2)).arrow().production((pb) => pb.steel(1).or(Size.SMALL).titanium(1))}),
          b.br,  
          b.production((pb) => pb.megacredits(2));
        }),
        description: 'Requires 6 science tags. Increase your M€ production 2 steps.',
      },
    });
  }
}
