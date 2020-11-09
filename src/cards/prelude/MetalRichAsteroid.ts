import {Player} from '../../Player';
import {Game} from '../../Game';
import {PreludeCard} from './PreludeCard';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../CardName';

export class MetalRichAsteroid extends PreludeCard implements IProjectCard {
    public tags = [];
    public name = CardName.METAL_RICH_ASTEROID;
    public play(player: Player, game: Game) {
      player.titanium += 4;
      player.steel += 4;
      return game.increaseTemperature(player, 1);
    }
}

