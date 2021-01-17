import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {Card} from '../Card';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../Units';

export class HousePrinting extends Card {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.HOUSE_PRINTING,
      tags: [Tags.BUILDING],
      cost: 10,
      productionDelta: Units.of({steel: 1}),

      metadata: {
        cardNumber: 'P36',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.steel(1));
        }),
        description: 'Increase your steel production 1 step.',
        victoryPoints: 1,
      },
    });
  }
  public play(player: Player) {
    player.addProduction(Resources.STEEL);
    return undefined;
  }
  public getVictoryPoints() {
    return 1;
  }
}
