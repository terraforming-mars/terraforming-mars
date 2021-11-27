import {Tags} from '../Tags';
import {Player} from '../../Player';
import {PreludeCard} from '../prelude/PreludeCard';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';

export class ResearchGrant extends PreludeCard implements IProjectCard {
  constructor() {
    super({
      name: CardName.RESEARCH_GRANT,
      tags: [Tags.SCIENCE, Tags.SCIENCE],
      startingMegacredits: 8,

      metadata: {
        cardNumber: 'Y04',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(8);
        }),
        description: 'Gain 8 M€.',
      },
    });
  }

  public play(player: Player) {
    player.megaCredits += 8;
    return undefined;
  }
}

