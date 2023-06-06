/*import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {CardRequirements} from '../requirements/CardRequirements';
import { Card } from '../Card';
import { IActionCard } from '../ICard';
import {Player} from '../../Player';

export const ACTION_COST = 3;
 export class TritumStation extends Card implements IProjectCard, IActionCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.TRITUM_STATION,
      tags: [Tag.RADIATION],
      cost: 20,
      requirements: CardRequirements.builder((b) => b.oxygen(8)),

      behavior: {
        ocean: {},
      },


      metadata: {
        cardNumber: 'N74',
        renderData: CardRenderer.builder((b) => {
          b.action('Decrease your M€ production 2 steeps to increase your steel production 1 step or titanium production 1 step.', (eb) => {
            eb.startAction.production((pb) => pb.megacredits(2)).arrow().production((pb) => pb.steel(1)).slash().production((pb) => pb.titanium(1))}),
          b.br,  
          b.production((pb) => pb.megacredits(2));
        }),
        description: 'Requires 6 science tags. Increase your M€ production 2 steps.',
      },
    });
  }
  
  public canAct(player: Player): boolean {
    return player.hasIncreasedTerraformRatingThisGeneration && player.canAfford(ACTION_COST, {tr: {tr: 1}});
  }
  public action(player: Player) {
    player.payMegacreditsDeferred(
      3,
      'Select how to pay for UNMI action.',
      () => player.increaseTerraformRating());
    return undefined;
  }

}
*/