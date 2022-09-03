import {Tag} from '../../../common/cards/Tag';
import {Player} from '../../Player';
import {PreludeCard} from '../prelude/PreludeCard';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class ResearchGrant extends PreludeCard implements IProjectCard {
  constructor() {
    super({
      name: CardName.RESEARCH_GRANT,
      tags: [Tag.SCIENCE, Tag.SCIENCE],
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

  public override bespokePlay(player: Player) {
    player.megaCredits += 8;
    return undefined;
  }
}

