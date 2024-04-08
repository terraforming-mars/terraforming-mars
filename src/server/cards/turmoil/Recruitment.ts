import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {IPlayer} from '../../IPlayer';
import {SendDelegateToArea} from '../../deferredActions/SendDelegateToArea';
import {CardRenderer} from '../render/CardRenderer';
import {Turmoil} from '../../turmoil/Turmoil';
import {all} from '../Options';

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
