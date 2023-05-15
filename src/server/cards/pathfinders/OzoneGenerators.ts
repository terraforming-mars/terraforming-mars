import {IProjectCard} from '../IProjectCard';
import {ActionCard} from '../ActionCard';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {CardRequirements} from '../requirements/CardRequirements';
import {Tag} from '../../../common/cards/Tag';

export class OzoneGenerators extends ActionCard implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.OZONE_GENERATORS,
      cost: 14,
      tags: [Tag.MARS, Tag.SPACE],
      requirements: CardRequirements.builder((b) => b.oxygen(6)),

      action: {
        spend: {energy: 3},
        tr: 1,
        // player.game.log('${0} spent 3 energy to gain 1 TR', (b) => b.player(player));
      },

      metadata: {
        cardNumber: 'Pf36',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 3 energy to gain 1 TR.', (eb) => eb.energy(3).startAction.tr(1));
        }),
        description: 'Requires 6% Oxygen.',
      },
    });
  }
}

