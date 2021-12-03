import {Player} from '../../Player';
import {PreludeCard} from '../prelude/PreludeCard';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Resources} from '../../Resources';
import {Tags} from '../Tags';
import {Units} from '../../Units';

export class ResearchGrant extends PreludeCard {
  constructor() {
    super({
      name: CardName.RESEARCH_GRANT_PATHFINDERS,
      tags: [Tags.SCIENCE, Tags.SCIENCE],
      productionBox: Units.of({energy: 1}),
      startingMegacredits: 14,

      metadata: {
        cardNumber: 'P08',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.energy(1)).br;
          b.megacredits(14);
        }),
        description: 'Increase your energy production 1 step. Gain 14 M€.',
      },
    });
  }
  public play(player: Player) {
    player.adjustProduction(this.productionBox, {log: true});
    player.addResource(Resources.MEGACREDITS, 14);
    return undefined;
  }
}

