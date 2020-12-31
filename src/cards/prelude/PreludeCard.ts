import {CardType} from '../CardType';
import {Player} from '../../Player';
import {PlayerInput} from '../../PlayerInput';
import {Game} from '../../Game';
import {CardName} from '../../CardName';
import {Tags} from '../Tags';
import {IProjectCard} from '../IProjectCard';

export abstract class PreludeCard implements IProjectCard {
    public cost = 0;
    public cardType = CardType.PRELUDE;
    public abstract name: CardName;
    public abstract tags: Array<Tags>;
    public abstract play(player: Player, game: Game): PlayerInput | undefined;
    public hasRequirements = false;
    public canPlay(_player: Player, _game: Game): boolean {
      return true;
    }
}
