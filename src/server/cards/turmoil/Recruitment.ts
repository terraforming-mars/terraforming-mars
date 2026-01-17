import {IProjectCard} from '@/server/cards/IProjectCard';
import {Card} from '@/server/cards/Card';
import {CardName} from '@/common/cards/CardName';
import {CardType} from '@/common/cards/CardType';
import {IPlayer} from '@/server/IPlayer';
import {SendDelegateToArea} from '@/server/deferredActions/SendDelegateToArea';
import {CardRenderer} from '@/server/cards/render/CardRenderer';
import {Turmoil} from '@/server/turmoil/Turmoil';
import {all} from '@/server/cards/Options';

export class Recruitment extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.RECRUITMENT,
      cost: 2,
      type: CardType.EVENT,

      metadata: {
        cardNumber: 'T11',
        renderData: CardRenderer.builder((b) => {
          b.minus().delegates(1, {all}).asterix().nbsp.plus().delegates(1);
        }),
        description: 'Exchange one NEUTRAL NON-LEADER delegate with one of your own from the reserve.',
      },
    });
  }

  public override bespokeCanPlay(player: IPlayer): boolean {
    const turmoil = Turmoil.getTurmoil(player.game);
    if (turmoil.hasDelegatesInReserve(player) === false) {
      return false;
    }

    return turmoil.parties.some((party) => {
      const neutralDelegates = party.delegates.count('NEUTRAL');
      return neutralDelegates > 1 || (neutralDelegates === 1 && party.partyLeader !== 'NEUTRAL');
    });
  }

  public override bespokePlay(player: IPlayer) {
    player.game.defer(new SendDelegateToArea(player, 'Select which Neutral delegate to remove', {replace: 'NEUTRAL'}));
    return undefined;
  }
}
