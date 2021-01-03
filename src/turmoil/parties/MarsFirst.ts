import {IParty} from './IParty';
import {Party} from './Party';
import {PartyName} from './PartyName';
import {Game} from '../../Game';
import {Tags} from '../../cards/Tags';
import {Resources} from '../../Resources';

export class MarsFirst extends Party implements IParty {
    public name = PartyName.MARS;
    public description: string = 'All players receive 1 MC for each Building tag they have.';

    public rulingBonus(game: Game): void {
      game.getPlayers().forEach((player) => {
        const tagCount = player.getTagCount(Tags.BUILDING, false, false);
        player.setResource(Resources.MEGACREDITS, tagCount);
      });
    }
}
