import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {SendDelegateToArea} from '../../deferredActions/SendDelegateToArea';
import {CardRenderer} from '../render/CardRenderer';

export class Recruitment extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.RECRUITMENT,
      cost: 2,
      cardType: CardType.EVENT,

      metadata: {
        cardNumber: 'T11',
        renderData: CardRenderer.builder((b) => {
          b.minus().delegates(1).any.asterix().nbsp.plus().delegates(1);
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
    player.game.defer(new SendDelegateToArea(player, 'Select which Neutral delegate to remove', {replace: 'NEUTRAL', source: 'reserve'}));
    return undefined;
  }
}
