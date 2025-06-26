import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {IPlayer} from '../../IPlayer';
import {SelectAmount} from '../../inputs/SelectAmount';
import {Card} from '../Card';

export class Supercapacitors extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.SUPERCAPACITORS,
      tags: [Tag.POWER, Tag.BUILDING],
      cost: 4,

      behavior: {
        production: {megacredits: 1},
      },

      metadata: {
        cardNumber: 'X46',
        renderData: CardRenderer.builder((b) => {
          b.text('EFFECT: CONVERTING ENERGY TO HEAT DURING PRODUCTION IS OPTIONAL FOR EACH ENERGY RESOURCE.');
          b.br;
          b.production((pb) => pb.megacredits(1));
        }),
        description: 'Increase M€ production 1 step.',
      },
    });
  }

  public static onProduction(player: IPlayer) {
    if (player.energy === 0) {
      player.finishProductionPhase();
      return;
    }
    player.defer(
      new SelectAmount('Select amount of energy to convert to heat', 'OK', 0, player.energy, true)
        .andThen((amount) => {
          player.energy -= amount;
          player.heat += amount;
          player.game.log('${0} converted ${1} units of energy to heat', (b) => b.player(player).number(amount));
          player.finishProductionPhase();
          return undefined;
        },
        ));
  }
}
