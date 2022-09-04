import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {Turmoil} from '../../turmoil/Turmoil';
import {all} from '../Options';

export class VoteOfNoConfidence extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.VOTE_OF_NO_CONFIDENCE,
      cardType: CardType.EVENT,
      cost: 5,
      tr: {tr: 1},

      // TODO(kberg): this renders a delegate with a tie and a black background. On the physical card, there is
      // no black background.
      requirements: CardRequirements.builder((b) => b.partyLeaders()),
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

  public override bespokeCanPlay(player: Player): boolean {
    const turmoil = Turmoil.getTurmoil(player.game);
    if (!turmoil.hasDelegatesInReserve(player.id)) return false;

    return turmoil.chairman === 'NEUTRAL';
  }

  public override bespokePlay(player: Player) {
    const turmoil = Turmoil.getTurmoil(player.game);
    const index = turmoil.delegateReserve.indexOf(player.id);
    if (index > -1) {
      turmoil.delegateReserve.splice(index, 1);
    }
    turmoil.setNewChairman(player.id, player.game, /* setAgenda */ false);
    return undefined;
  }
}
