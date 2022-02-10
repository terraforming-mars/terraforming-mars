import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {CardName} from '../../common/cards/CardName';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {Resources} from '../../common/Resources';
import {PartyName} from '../../common/turmoil/PartyName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {Units} from '../../common/Units';

export class SponsoredMohole extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 5,
      tags: [Tags.BUILDING],
      name: CardName.SPONSORED_MOHOLE,
      cardType: CardType.AUTOMATED,
      productionBox: Units.of({heat: 2}),

      requirements: CardRequirements.builder((b) => b.party(PartyName.KELVINISTS)),
      metadata: {
        cardNumber: 'T13',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.heat(2));
        }),
        description: 'Requires that Kelvinists are ruling or that you have 2 delegates there. Increase your heat production 2 steps.',
      },
    });
  }

  public play(player: Player) {
    player.addProduction(Resources.HEAT, 2);
    return undefined;
  }
}
