import {IPlayer} from '../IPlayer';
import {Resource} from '../../common/Resource';
import {OrOptions} from '../inputs/OrOptions';
import {SelectOption} from '../inputs/SelectOption';
import {DeferredAction, Priority} from './DeferredAction';
import {CardName} from '../../common/cards/CardName';
import {MessageBuilder, message} from '../logs/MessageBuilder';
import {Message} from '../../common/logs/Message';
export class RemoveAnyPlants extends DeferredAction {
  private title: string | Message;
  private count: number;

  constructor(player: IPlayer, count: number = 1, title?: string | Message) {
    super(player, Priority.ATTACK_OPPONENT);
    this.count = count;
    this.title = title ?? message('Select player to remove up to ${0} plants', (b) => b.number(count));
  }

  public execute() {
    if (this.player.game.isSoloMode()) {
      // Crash site cleanup hook
      this.player.game.someoneHasRemovedOtherPlayersPlants = true;
      this.player.resolveInsuranceInSoloGame();
      return undefined;
    }

    const candidates = this.player.game.getPlayers().filter((p) => p.id !== this.player.id && !p.plantsAreProtected() && p.plants > 0);

    if (candidates.length === 0) {
      return undefined;
    }

    const removalOptions = candidates.map((target) => {
      let qtyToRemove = Math.min(target.plants, this.count);

      // Botanical Experience hook.
      if (target.cardIsInEffect(CardName.BOTANICAL_EXPERIENCE)) {
        qtyToRemove = Math.ceil(qtyToRemove / 2);
      }

      const message =
        new MessageBuilder('Remove ${0} plants from ${1}')
          .number(qtyToRemove)
          .player(target)
          .getMessage();

      return new SelectOption(message, 'Remove plants').andThen(() => {
        target.maybeBlockAttack(this.player, (proceed) => {
          if (proceed === true) {
            target.stock.deduct(Resource.PLANTS, qtyToRemove, {log: true, from: this.player});
          }
          return undefined;
        });
        return undefined;
      });
    });

    const orOptions = new OrOptions(
      ...removalOptions,
      new SelectOption('Skip removing plants').andThen(() => {
        return undefined;
      }),
    );
    orOptions.title = this.title;
    return orOptions;
  }
}
