import {CorporationCard} from '../corporation/CorporationCard';
import {Player} from '../../Player';
import {ResourceType} from '../../ResourceType';
import {CardName} from '../../CardName';
import {IResourceCard} from '../ICard';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../render/Size';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';

export class Pristar extends Card implements CorporationCard, IResourceCard {
  constructor() {
    super({
      name: CardName.PRISTAR,
      startingMegaCredits: 53,
      resourceType: ResourceType.PRESERVATION,
      cardType: CardType.CORPORATION,

      metadata: {
        cardNumber: 'R07',
        description: 'You start with 53 M€. Decrease your TR 2 steps. 1 VP per preservation resource here.',
        renderData: CardRenderer.builder((b) => {
          b.br.br.br;
          b.megacredits(53).nbsp.nbsp.minus().tr(2, Size.SMALL);
          b.corpBox('effect', (ce) => {
            ce.effect('During production phase, if you did not get TR so far this generation, add one preservation resource here and gain 6 M€.', (eb) => {
              eb.tr(1, Size.SMALL, true).startEffect.preservation(1).megacredits(6);
            });
          });
        }),
        victoryPoints: CardRenderDynamicVictoryPoints.preservation(1, 1),
      },
    });
  }

    public resourceCount = 0;

    public play(player: Player) {
      player.decreaseTerraformRatingSteps(2);
      return undefined;
    }

    public getVictoryPoints(): number {
      return Math.floor(this.resourceCount);
    }

    public onProductionPhase(player: Player) {
      if (!(player.hasIncreasedTerraformRatingThisGeneration)) {
        player.megaCredits += 6;
        player.addResourceTo(this, 1);
      }
      return undefined;
    }
}
