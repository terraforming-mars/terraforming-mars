import {CardType} from '../CardType';
import {CardMetadata} from '../CardMetadata';
import {CardName} from '../../CardName';
import {IActionCard, ICard} from '../ICard';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {PlayerInput} from '../../PlayerInput';

export abstract class StandardAction implements IActionCard, ICard {
    public cardType = CardType.STANDARD_ACTION;
    public hasRequirements = false;
    public tags = [];
    public cost = 0;
    public abstract name: CardName;
    public abstract metadata: CardMetadata;

    abstract action(_player: Player, _game: Game): PlayerInput | undefined

    abstract canAct(_player: Player, _game: Game): boolean

    play(_player: Player, _game: Game): PlayerInput | undefined {
      return undefined;
    }

    protected actionPlayed(player: Player, game: Game) {
      game.log('${0} used ${1} standard action', (b) => b.player(player).card(this));
    }
}
