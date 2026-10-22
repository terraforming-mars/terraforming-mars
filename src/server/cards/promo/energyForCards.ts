import {Resource} from '@/common/Resource';
import {SelectAmount} from '@/server/inputs/SelectAmount';
import {IPlayer} from '@/server/IPlayer';

export function canSpendEnergyForCards(player: IPlayer) {
  return player.energy > 0 && player.game.projectDeck.canDraw(1);
}

export function spendEnergyForCards(player: IPlayer) {
  const max = Math.min(player.energy, player.game.projectDeck.size());
  return new SelectAmount('Select amount of energy to spend', 'OK', 1, max)
    .andThen((amount) => {
      player.stock.deduct(Resource.ENERGY, amount);
      // TODO(kberg): Move to "${0}: -${1}:r:energy:"?
      player.game.log('${0} spent ${1}:r:energy:', (b) => b.player(player).number(amount));
      if (amount === 1) {
        player.drawCard();
        return undefined;
      }
      player.drawCardKeepSome(amount, {keepMax: 1});
      return undefined;
    });
}
