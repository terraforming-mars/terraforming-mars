import {ICorporationCard} from '../corporation/ICorporationCard';
import {Player} from '../../Player';
import {CardResource} from '../../common/CardResource';
import {CardName} from '../../common/cards/CardName';
import {IResourceCard} from '../ICard';
import {Card} from '../Card';
import {VictoryPoints} from '../ICard';
import {CardType} from '../../common/cards/CardType';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../common/cards/render/Size';

export class Pristar extends Card implements ICorporationCard, IResourceCard {
  constructor() {
    super({
      name: CardName.PRISTAR,
      startingMegaCredits: 53,
      resourceType: CardResource.PRESERVATION,
      cardType: CardType.CORPORATION,

      victoryPoints: VictoryPoints.resource(1, 1),

      metadata: {
        cardNumber: 'R07',
        description: 'You start with 53 M€. Decrease your TR 2 steps. 1 VP per preservation resource here.',

        renderData: CardRenderer.builder((b) => {
          b.br.br.br;
          b.megacredits(53).nbsp.nbsp.minus().tr(2, {size: Size.SMALL});
          b.corpBox('effect', (ce) => {
            ce.effect('During production phase, if you did not get TR so far this generation, add one preservation resource here and gain 6 M€.', (eb) => {
              eb.tr(1, {size: Size.SMALL, cancelled: true}).startEffect.preservation(1).megacredits(6);
            });
          });
        }),
      },
    });
  }

  public override resourceCount = 0;

  public play(player: Player) {
    player.decreaseTerraformRatingSteps(2);
    return undefined;
  }

  public onProductionPhase(player: Player) {
    if (!(player.hasIncreasedTerraformRatingThisGeneration)) {
      player.megaCredits += 6;
      player.addResourceTo(this, 1);
    }
    return undefined;
  }
}
