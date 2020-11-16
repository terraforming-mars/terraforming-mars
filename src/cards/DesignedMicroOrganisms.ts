
import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import {Game} from '../Game';
import {Resources} from '../Resources';
import {CardName} from '../CardName';

export class DesignedMicroOrganisms implements IProjectCard {
    public cost = 16;
    public tags = [Tags.SCIENCE, Tags.MICROBES];
    public name = CardName.DESIGNED_MICRO_ORGANISMS;
    public cardType = CardType.AUTOMATED;
    public canPlay(player: Player, game: Game): boolean {
      return game.getTemperature() <= -14 + (
        2 * player.getRequirementsBonus(game)
      );
    }
    public play(player: Player) {
      player.addProduction(Resources.PLANTS, 2);
      return undefined;
    }
}
