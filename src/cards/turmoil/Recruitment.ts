import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {SendDelegateToArea} from '../../deferredActions/SendDelegateToArea';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';

export class Recruitment extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 2,
      tags: [],
      name: CardName.RECRUITMENT,
      cardType: CardType.EVENT,

      metadata: {
        cardNumber: 'T11',
        renderData: CardRenderer.builder((b) => {
          b.minus().delegates(1).any.asterix().nbsp.delegates(1);
        }),
        description: 'Exchange one NEUTRAL NON-LEADER delegate with one of your own from the reserve.',
      },
    });
  }

  public canPlay(player: Player): boolean {
    if (player.game.turmoil === undefined || player.game.turmoil.hasAvailableDelegates(player.id) === false) {
      return false;
    }

    return player.game.turmoil.parties.some((party) => {
      const neutralDelegates = party.getDelegates('NEUTRAL');
      return neutralDelegates > 1 || (neutralDelegates === 1 && party.partyLeader !== 'NEUTRAL');
    });
  }

  public play(player: Player) {
    player.game.defer(new SendDelegateToArea(player, 'Select which Neutral delegate to remove', 1, 'NEUTRAL', undefined, false));
    return undefined;
  }
}
