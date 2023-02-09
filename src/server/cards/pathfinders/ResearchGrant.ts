import {Player} from '../../Player';
import {PreludeCard} from '../prelude/PreludeCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Resources} from '../../../common/Resources';
import {Tag} from '../../../common/cards/Tag';

export class ResearchGrant extends PreludeCard {
  constructor() {
    super({
      name: CardName.RESEARCH_GRANT_PATHFINDERS,
      tags: [Tag.SCIENCE, Tag.SCIENCE],

      behavior: {
        production: {energy: 1},
      },
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
  public override bespokePlay(player: Player) {
    player.addResource(Resources.MEGACREDITS, 14);
    return undefined;
  }
}

