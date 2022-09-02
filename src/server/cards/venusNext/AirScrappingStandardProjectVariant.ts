import {Player} from '../../Player';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import {AirScrappingStandardProject} from './AirScrappingStandardProject';
import {Size} from '../../../common/cards/render/Size';
import {played} from '../Options';

export class AirScrappingStandardProjectVariant extends AirScrappingStandardProject {
  constructor() {
    super({
      name: CardName.AIR_SCRAPPING_STANDARD_PROJECT_VARIANT,
      cost: 15,
      tr: {venus: 1},
      metadata: {
        cardNumber: 'SP1a',
        renderData: CardRenderer.builder((b) => {
          b.standardProject('Spend 15M€, less 1M€ per Venus tag you have, to raise Venus 1 step.', (eb) => {
            eb.megacredits(15).text('(').megacredits(-1).slash().venus(1, {played}).text(')').startAction.venus(1);
          });
          b.br.text('(max -5M€)', Size.SMALL);
        }),
      },
    });
  }

  protected override discount(player: Player): number {
    const tagCount = player.tags.count(Tag.VENUS);
    const discount = Math.min(tagCount, 5);
    return discount + super.discount(player);
  }
}
