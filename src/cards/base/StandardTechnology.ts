import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';
import {StandardProject} from '../standardProjects/StandardProject';

export class StandardTechnology implements IProjectCard {
    public cost = 6;
    public tags = [Tags.SCIENCE];
    public name = CardName.STANDARD_TECHNOLOGY;
    public cardType = CardType.ACTIVE;

    public onStandardProject(player: Player, projectType: StandardProject) {
      if (projectType.name !== CardName.STANDARD_SELL_PATENTS) {
        player.megaCredits += 3;
      }
    }
    public play() {
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: '156',
      renderData: CardRenderer.builder((b) => {
        b.effect('After you pay for a standard project, except selling patents, you gain 3 MC.', (eb) => {
          eb.plate('Standard projects').startEffect.megacredits(3);
        });
      }),
    };
}
