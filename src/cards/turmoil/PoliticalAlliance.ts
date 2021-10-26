import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class PoliticalAlliance extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.POLITICAL_ALLIANCE,
      cost: 4,
      tr: {tr: 1},

      requirements: CardRequirements.builder((b) => b.partyLeaders(2)),
      metadata: {
        cardNumber: 'X09',
        renderData: CardRenderer.builder((b) => {
          b.tr(1);
        }),
        description: 'Requires that you have 2 party leaders. Gain 1 TR.',
      },
    });
  }

  public play(player: Player) {
    player.increaseTerraformRating();
    return undefined;
  }
}
