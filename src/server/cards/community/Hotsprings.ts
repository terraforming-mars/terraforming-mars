import {CorporationCard} from '@/server/cards/corporation/CorporationCard';
import {ICorporationCard} from '@/server/cards/corporation/ICorporationCard';
import {CardName} from '@/common/cards/CardName';
import {Tag} from '@/common/cards/Tag';
import {CardRenderer} from '@/server/cards/render/CardRenderer';
import {IPlayer} from '@/server/IPlayer';
import {Player} from '@/server/Player';
import {Resource} from '@/common/Resource';

export class Hotsprings extends CorporationCard implements ICorporationCard {
  constructor() {
    super({
      name: CardName.HOTSPRINGS,
      tags: [Tag.BUILDING],
      startingMegaCredits: 48,

      behavior: {
        stock: {heat: 5},
      },

      metadata: {
        cardNumber: 'R48',
        description: 'You start with 48 M€ and 5 heat.',
        renderData: CardRenderer.builder((b) => {
          b.br.br.br;
          b.megacredits(48).heat(5);
          b.corpBox('action', (ce) => {
            ce.vSpace();
            ce.action('Increase your M€ production 1 step if your heat production was raised 1 step this generation, or 2 steps if it was raised more than 1 step this generation', (eb) => {
              eb.empty().startAction.production((pb) => pb.megacredits(1)).slash().production((pb) => pb.megacredits(2)).asterix();
            });
          });
        }),
      },
    });
  }

  public data: {heatProductionStepsIncreasedThisGeneration: number} = {heatProductionStepsIncreasedThisGeneration: 0};

  public onProductionGain(_player: IPlayer, resource: Resource, amount: number): void {
    if (resource === Resource.HEAT && amount > 0) {
      this.data.heatProductionStepsIncreasedThisGeneration += amount;
    }
  }

  public canAct(): boolean {
    return this.data.heatProductionStepsIncreasedThisGeneration > 0;
  }

  public action(player: Player) {
    if (this.data.heatProductionStepsIncreasedThisGeneration === 1) {
      player.production.add(Resource.MEGACREDITS, 1, {log: true});
    } else if (this.data.heatProductionStepsIncreasedThisGeneration > 1) {
      player.production.add(Resource.MEGACREDITS, 2, {log: true});
    }

    return undefined;
  }

  public onProductionPhase(): void {
    this.data.heatProductionStepsIncreasedThisGeneration = 0;
  }
}
