import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';

export abstract class PreludeCard {
    public cost = 0;
    public cardType = CardType.PRELUDE;
    public hasRequirements = false;
    public canPlay(_player: Player, _game: Game): boolean {
      return true;
    }
}
