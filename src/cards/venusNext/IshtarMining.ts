import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';

export class IshtarMining extends Card {
  constructor() {
    super({
      name: CardName.ISHTAR_MINING,
      cardType: CardType.AUTOMATED,
      tags: [Tags.VENUS],
      cost: 5,

      requirements: CardRequirements.builder((b) => b.venus(8)),
      metadata: {
        cardNumber: '233',
        renderData: CardRenderer.builder((b) => b.production((pb) => pb.titanium(1))),
        description: 'Requires Venus 8%. Increase your titanium production 1 step.',
      },
    });
  }
  public play(player: Player) {
    player.addProduction(Resources.TITANIUM, 1);
    return undefined;
  }
}
