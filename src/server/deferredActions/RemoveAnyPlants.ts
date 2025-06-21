import {IPlayer} from '../IPlayer';
import {Resource} from '../../common/Resource';
import {OrOptions} from '../inputs/OrOptions';
import {SelectOption} from '../inputs/SelectOption';
import {DeferredAction} from './DeferredAction';
import {Priority} from './Priority';
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

  private createOption(target: IPlayer) {
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

    return new SelectOption(
      message, 'Remove plants').andThen(() => {
      target.attack(this.player, Resource.PLANTS, qtyToRemove, {log: true});
      return undefined;
    });
  }

  public execute() {
    const player = this.player;
    const game = player.game;
    const removalOptions: Array<SelectOption> = [];

    if (game.isSoloMode()) {
      const option = new SelectOption(
        'Remove plants from the neutral oppponent', {
          buttonLabel: 'Remove plants',
        })
        .andThen(() => {
          game.someoneHasRemovedOtherPlayersPlants = true;
          player.resolveInsuranceInSoloGame();
          return undefined;
        });
      removalOptions.push(option);

      // Shortcut. Only provide the opportunity  if the player is playing Mons Insurance.
      if (game.monsInsuranceOwner !== player.id) {
        option.cb(undefined);
        return undefined;
      }
    }

    const candidates = player.getOpponents().filter((p) => !p.plantsAreProtected() && p.plants > 0);
    removalOptions.push(...candidates.map((target) => {
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

      return new SelectOption(
        message, {
          buttonLabel: 'Remove plants',
          warnings: (target === player) ? ['removeOwnPlants'] : undefined,
        }).andThen(() => {
        target.attack(player, Resource.PLANTS, qtyToRemove, {log: true});
        return undefined;
      });
    }));

    removalOptions.push(new SelectOption('Skip removing plants').andThen(() => {
      return undefined;
    }));

    if (removalOptions.length === 1) {
      return undefined;
    }

    if (this.player.plants > 0) {
      const option = this.createOption(player);
      option.warnings = ['removeOwnPlants'];
      removalOptions.push(option);
    }

    return new OrOptions(...removalOptions).setTitle(this.title);
  }
}
