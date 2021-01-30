import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {GlobalParameter} from '../../GlobalParameter';
import {Card} from '../Card';

export class IshtarMining extends Card {
  constructor() {
    super({
      name: CardName.ISHTAR_MINING,
      cardType: CardType.AUTOMATED,
      tags: [Tags.VENUS],
      cost: 5,

      metadata: {
        cardNumber: '233',
        requirements: CardRequirements.builder((b) => b.venus(8)),
        renderData: CardRenderer.builder((b) => b.production((pb) => pb.titanium(1))),
        description: 'Requires Venus 8%. Increase your titanium production 1 step.',
      },
    });
  }
  public canPlay(player: Player): boolean {
    return player.game.checkMinRequirements(player, GlobalParameter.VENUS, 8);
  }
  public play(player: Player) {
    player.addProduction(Resources.TITANIUM);
    return undefined;
  }
}
