import {Tags} from '../Tags';
import {Player} from '../../Player';
import {PreludeCard} from '../prelude/PreludeCard';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class ResearchGrant extends PreludeCard implements IProjectCard {
    public tags = [Tags.SCIENCE, Tags.SCIENCE];
    public name = CardName.RESEARCH_GRANT;

    public play(player: Player) {
      player.megaCredits += 8;
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: 'Y04',
      renderData: CardRenderer.builder((b) => {
        b.megacredits(8);
      }),
      description: 'Gain 8 MC.',
    }
}

