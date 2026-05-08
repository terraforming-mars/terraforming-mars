import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {IProjectCard} from '../IProjectCard';
import {IPlayer} from '../../IPlayer';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';

export class MonopolyBreakup extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.EVENT,
      name: CardName.MONOPOLY_BREAKUP,
      cost: 5,
      metadata: {
        cardNumber: 'B30',
        description: 'Requires a player has a TR 10 steps ahead of yours. Claim an available unclaimed Milestone, even if the milestone limit has been surpassed.',
        renderData: CardRenderer.builder((b) => {
          b.tr(1);
        }),
      },
    });
  }

  public override canPlay(player: IPlayer): boolean {
    const threshold = player.terraformRating + 10;
    const otherPlayersAhead = player.game.players.some(
      (p) => p !== player && p.terraformRating >= threshold,
    );
    if (!otherPlayersAhead) return false;
    return player.game.milestones.some((m) => !player.game.milestoneClaimed(m));
  }

  public override play(player: IPlayer) {
    const game = player.game;
    const unclaimed = game.milestones.filter((m) => !game.milestoneClaimed(m));
    if (unclaimed.length === 0) return undefined;

    return new OrOptions(
      ...unclaimed.map((milestone) =>
        new SelectOption(milestone.name, 'Claim ' + milestone.name).andThen(() => {
          game.log('${0} claimed ${1} milestone via Monopoly Breakup', (b) => b.player(player).milestone(milestone));
          game.claimedMilestones.push({player, milestone});
          return undefined;
        }),
      ),
    ).setTitle('Select a Milestone to claim');
  }
}
