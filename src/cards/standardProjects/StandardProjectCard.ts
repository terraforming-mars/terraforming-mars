import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {IActionCard, ICard} from '../ICard';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectAmount} from '../../inputs/SelectAmount';
import {SelectHowToPay} from '../../inputs/SelectHowToPay';
import {SelectOption} from '../../inputs/SelectOption';
import {IProjectCard} from '../IProjectCard';
import {SelectPlayer} from '../../inputs/SelectPlayer';
import {AndOptions} from '../../inputs/AndOptions';
import {SelectCard} from '../../inputs/SelectCard';
import {SelectSpace} from '../../inputs/SelectSpace';
import {CardName} from '../../CardName';
import {SelectHowToPayDeferred} from '../../deferredActions/SelectHowToPayDeferred';

export abstract class StandardProjectCard implements IActionCard, ICard {
    public cardType = CardType.STANDARD_PROJECT;
    public hasRequirements = false;
    public tags = [];
    public abstract name: CardName;
    abstract _cost: number;

    public play() {
      return undefined;
    }
    abstract actionEssence(player: Player, game: Game): void

    action(player: Player, game: Game): OrOptions | SelectOption | AndOptions | SelectAmount | SelectCard<ICard> | SelectCard<IProjectCard> | SelectHowToPay | SelectPlayer | SelectSpace | undefined {
      game.defer(new SelectHowToPayDeferred(
        player,
        this._cost,
        false,
        false,
        `Select how to pay for ${this.name} project`,
        () => {
          this.actionEssence(player, game);
        },
      ));

      game.log('${0} used ${1} standard project', (b) => b.player(player).standardProject(this.name));
      player.onStandardProject(this);

      return undefined;
    }
    abstract canAct(player: Player, game: Game): boolean
}
