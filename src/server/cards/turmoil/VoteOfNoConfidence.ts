import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {IPlayer} from '../../IPlayer';
import {Card} from '../Card';
import {CardRenderer} from '../render/CardRenderer';
import {Turmoil} from '../../turmoil/Turmoil';
import {all} from '../Options';

export class VoteOfNoConfidence extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.VOTE_OF_NO_CONFIDENCE,
      type: CardType.EVENT,
      cost: 5,
      tr: {tr: 1},

      // TODO(kberg): this renders a delegate with a tie and a black background. On the physical card, there is
      // no black background.
      requirements: {partyLeader: 1},
      metadata: {
        cardNumber: 'T16',
        renderData: CardRenderer.builder((b) => {
          b.minus().chairman({all}).asterix();
          b.nbsp.plus().partyLeaders().br;
          b.tr(1);
        }),
        description: 'Requires that you have a Party Leader in any party and that the sitting Chairman is neutral. ' +
          'Remove the NEUTRAL Chairman and move your own delegate (from the reserve) there instead. Gain 1 TR.',
      },
    });
  }

  public override bespokeCanPlay(player: IPlayer): boolean {
    const turmoil = Turmoil.getTurmoil(player.game);
    if (!turmoil.hasDelegatesInReserve(player)) return false;

    return turmoil.chairman === 'NEUTRAL';
  }

  public override bespokePlay(player: IPlayer) {
    const turmoil = Turmoil.getTurmoil(player.game);
    turmoil.delegateReserve.remove(player);
    turmoil.setNewChairman(player, player.game, /* setAgenda */ false);
    return undefined;
  }
}
