import {Tags} from '../../Tags';
import {Player} from '../../../Player';
import {PreludeCard} from '../../prelude/PreludeCard';
import {IProjectCard} from '../../IProjectCard';
import {CardName} from '../../../CardName';

export class ResearchGrant extends PreludeCard implements IProjectCard {
    public tags = [Tags.SCIENCE, Tags.SCIENCE];
    public name = CardName.RESEARCH_GRANT;

    public play(player: Player) {
      player.megaCredits += 8;
      return undefined;
    }
}

