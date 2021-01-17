import {CardType} from '../CardType';
import {CardMetadata} from '../CardMetadata';
import {CardName} from '../../CardName';
import {IActionCard, ICard} from '../ICard';
import {Player} from '../../Player';
import {PlayerInput} from '../../PlayerInput';

// Standard Actions are actions that player can perform in his turn,
// like Standard Projects (subclass), converting heat / plants.
// TODO(sienmich) Implement other actions (e.g. trading with colony, turmoil actions) as Standard Actions
// TODO(sienmich) Show those actions as cards (currently they show as cards in log only)
// TODO(sienmich) Make StandardActionCard `extends Card` and use its constructors
export abstract class StandardActionCard implements IActionCard, ICard {
    public cardType = CardType.STANDARD_ACTION;
    public hasRequirements = false;
    public tags = [];
    public cost = 0;
    public abstract name: CardName;
    public abstract metadata: CardMetadata;

    abstract action(_player: Player): PlayerInput | undefined

    abstract canAct(_player: Player): boolean

    play(_player: Player): PlayerInput | undefined {
      return undefined;
    }

    protected actionPlayed(player: Player) {
      player.game.log('${0} used ${1} standard action', (b) => b.player(player).card(this));
    }
}
