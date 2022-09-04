import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {CardName} from '../../../common/cards/CardName';
import {Resources} from '../../../common/Resources';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';
import {Card} from '../Card';
import {all} from '../Options';
import {IProjectCard} from '../IProjectCard';


export class AerosportTournament extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.AEROSPORT_TOURNAMENT,
      cardType: CardType.EVENT,
      cost: 7,

      requirements: CardRequirements.builder((b) => b.floaters(5)),
      victoryPoints: 1,

      metadata: {
        cardNumber: '214',
        description: 'Requires that you have 5 Floaters. Gain 1 M€ per each City tile in play.',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(1).slash().city({size: Size.SMALL, all});
        }),
      },
    });
  }

  public override bespokePlay(player: Player) {
    player.addResource(Resources.MEGACREDITS, player.game.getCitiesCount(), {log: true});
    return undefined;
  }
}
