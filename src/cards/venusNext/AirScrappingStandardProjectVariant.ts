import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tags} from '../Tags';
import {AirScrappingStandardProject} from './AirScrappingStandardProject';

export class AirScrappingStandardProjectVariant extends AirScrappingStandardProject {
  constructor() {
    super({
      name: CardName.AIR_SCRAPPING_STANDARD_PROJECT_VARIANT,
      cost: 15,
      metadata: {
        cardNumber: 'SP1a',
        renderData: CardRenderer.builder((b) => {
          b.standardProject('Spend 15M€, less 1M€ per Venus tag you have, to raise Venus 1 step.', (eb) => {
            eb.megacredits(15).text('(').megacredits(-1).slash().venus(1).played.text(')').startAction.venus(1);
          });
          b.br.text('(max -5M€');
        }),
      },
    });
  }

  protected discount(player: Player): number {
    const tagCount = player.getTagCount(Tags.VENUS);
    const discount = Math.min(tagCount, 5);
    return discount + super.discount(player);
  }
}
