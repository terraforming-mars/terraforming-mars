import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {Resources} from '../../Resources';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../render/Size';
import {Card} from '../Card';
import {all} from '../Options';


export class AerosportTournament extends Card {
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
  };

  public play(player: Player) {
    player.addResource(Resources.MEGACREDITS, player.game.getCitiesInPlay(), {log: true});
    return undefined;
  }
}
