
import {IProjectCard} from './IProjectCard';
import {Player} from '../Player';
import {Game} from '../Game';
import {CardType} from './CardType';
import {Resources} from '../Resources';
import {CardName} from '../CardName';

export class MicroMills implements IProjectCard {
    public cost = 3;
    public tags = [];
    public cardType = CardType.AUTOMATED;
    public name = CardName.MICRO_MILLS;

    public play(player: Player, _game: Game) {
      player.addProduction(Resources.HEAT);
      return undefined;
    }
}

