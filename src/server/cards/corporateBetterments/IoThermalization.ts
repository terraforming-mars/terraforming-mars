import {Card} from '../Card';
import {IActionCard} from '../ICard';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {IProjectCard} from '../IProjectCard';
import {IPlayer} from '../../IPlayer';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {Resource} from '../../../common/Resource';

export class IoThermalization extends Card implements IActionCard, IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.IO_THERMALIZATION,
      tags: [Tag.JOVIAN, Tag.SPACE],
      cost: 25,
      victoryPoints: 2,

      metadata: {
        cardNumber: 'B31',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 1 Titanium to increase your Heat production 1 step,\nOR decrease your Heat production 2 steps to raise your TR 1 step.', (ab) => {
            ab.titanium(1).startAction.production((pb) => pb.heat(1)).br;
            ab.or().br;
            ab.production((pb) => pb.minus().heat(2)).startAction.tr(1);
          });
        }),
      },
    });
  }

  public canAct(player: IPlayer): boolean {
    return player.titanium >= 1 || player.production.heat >= 2;
  }

  public action(player: IPlayer) {
    const options: Array<SelectOption> = [];

    if (player.titanium >= 1) {
      options.push(new SelectOption('Spend 1 Titanium to increase Heat production 1 step', 'Spend Titanium').andThen(() => {
        player.stock.deduct(Resource.TITANIUM, 1);
        player.production.add(Resource.HEAT, 1, {log: true});
        return undefined;
      }));
    }

    if (player.production.heat >= 2) {
      options.push(new SelectOption('Decrease Heat production 2 steps to raise TR 1 step', 'Decrease Heat production').andThen(() => {
        player.production.add(Resource.HEAT, -2, {log: true});
        player.increaseTerraformRating();
        return undefined;
      }));
    }

    if (options.length === 1) {
      return options[0].andThen(() => undefined);
    }

    return new OrOptions(...options).setTitle('Select an action for Io Thermalization');
  }
}
