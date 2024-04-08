import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../IPlayer';
import {ICard} from '../ICard';
import {IStandardProjectCard} from '../IStandardProjectCard';

export class LaborTrafficking extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.LABOR_TRAFFICKING,
      type: CardType.ACTIVE,
      cost: 3,
      tags: [Tag.SPACE],
      victoryPoints: -2,

      metadata: {
        cardNumber: 'U14',
        renderData: CardRenderer.builder((b) => {
          b.effect('The first standard project action you take each generation, ' +
              'except selling patents, costs 6 M€ less.', (eb) =>
            eb.text('FIRST').plate('Standard projects').asterix().startEffect.megacredits(-6));
        }),
      },
    });
  }

  public data: {generation: number} = {generation: -1};

  onStandardProject(player: IPlayer, project: ICard): void {
    if (project.name !== CardName.SELL_PATENTS_STANDARD_PROJECT) {
      this.data.generation = player.game.generation;
    }
  }

  public getStandardProjectDiscount(player: IPlayer, card: IStandardProjectCard): number {
    if (card.name !== CardName.SELL_PATENTS_STANDARD_PROJECT) {
      if (this.data.generation !== player.game.generation) {
        return 6;
      }
    }
    return 0;
  }
}
