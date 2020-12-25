import {CorporationCard} from '../corporation/CorporationCard';
import {Player} from '../../Player';
import {ResourceType} from '../../ResourceType';
import {CardName} from '../../CardName';
import {IResourceCard} from '../ICard';
import {CardType} from '../CardType';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderItemSize} from '../render/CardRenderItemSize';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';

export class Pristar implements CorporationCard, IResourceCard {
    public name = CardName.PRISTAR;
    public tags = [];
    public startingMegaCredits: number = 53;
    public resourceType = ResourceType.PRESERVATION;
    public resourceCount: number = 0;
    public cardType = CardType.CORPORATION;

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
        this.resourceCount++;
      }
      return undefined;
    }

    public metadata: CardMetadata = {
      cardNumber: 'R07',
      description: 'You start with 53 MC. Decrease your TR 2 steps. 1 VP per preservation resource here.',
      renderData: CardRenderer.builder((b) => {
        b.br.br.br;
        b.megacredits(53).nbsp.nbsp.minus().tr(2, CardRenderItemSize.SMALL);
        b.corpBox('effect', (ce) => {
          ce.effectBox((eb) => {
            eb.tr(1, CardRenderItemSize.SMALL).startEffect.preservation(1).megacredits(6);
            eb.description('Effect: During production phase, if you did not get TR so far this generation, add one preservation resource here and gain 6 MC.');
          });
        });
      }),
      victoryPoints: CardRenderDynamicVictoryPoints.preservation(1, 1),
    }
}
