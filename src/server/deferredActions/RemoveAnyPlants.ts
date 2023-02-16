import {Player} from '../Player';
import {Resources} from '../../common/Resources';
import {OrOptions} from '../inputs/OrOptions';
import {SelectOption} from '../inputs/SelectOption';
import {DeferredAction, Priority} from './DeferredAction';
import {CardName} from '../../common/cards/CardName';
import {MessageBuilder} from '../logs/MessageBuilder';
import {Message} from '../../common/logs/Message';

export class RemoveAnyPlants extends DeferredAction {
  constructor(
    player: Player,
    public count: number = 1,
    public title: string | Message = new MessageBuilder('Select player to remove up to ${0} plants').number(count).getMessage(),
  ) {
    super(player, Priority.ATTACK_OPPONENT);
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

    const removalOptions = candidates.map((candidate) => {
      let qtyToRemove = Math.min(candidate.plants, this.count);

      // Botanical Experience hook.
      if (candidate.cardIsInEffect(CardName.BOTANICAL_EXPERIENCE)) {
        qtyToRemove = Math.ceil(qtyToRemove / 2);
      }

      const message =
        new MessageBuilder('Remove ${0} plants from ${1}')
          .number(qtyToRemove)
          .rawString(candidate.name) // TODO(kberg): change to .player(candidate). But it won't work immediately.
          .getMessage();

      return new SelectOption(message, 'Remove plants', () => {
        candidate.deductResource(Resources.PLANTS, qtyToRemove, {log: true, from: this.player});
        return undefined;
      });
    });

    return new OrOptions(
      ...removalOptions,
      new SelectOption('Skip removing plants', 'Confirm', () => {
        return undefined;
      }),
    );
  }
}
