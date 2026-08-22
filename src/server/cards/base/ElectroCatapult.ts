import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {ActionCard} from '../ActionCard';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {max} from '../Options';
import {IPlayer} from '../../IPlayer';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {Resource} from '../../../common/Resource';
import {Payment} from '../../../common/inputs/Payment';

export class ElectroCatapult extends ActionCard implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.ELECTRO_CATAPULT,
      tags: [Tag.BUILDING],
      cost: 17,

      behavior: {
        production: {energy: -1},
      },

      action: {
        or: {
          autoSelect: true,
          behaviors: [{
            title: 'Spend 1 plant to gain 7 M€.',
            spend: {plants: 1},
            stock: {megacredits: 7},
          },
          {
            title: 'Spend 1 steel to gain 7 M€.',
            spend: {steel: 1},
            stock: {megacredits: 7},
          }],
        },
      },

      victoryPoints: 1,

      requirements: {oxygen: 8, max},
      metadata: {
        cardNumber: '069',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 1 plant or 1 steel to gain 7 M€.', (eb) => {
            eb.plants(1).slash().steel(1).startAction.megacredits(7);
          }).br;
          b.production((pb) => pb.minus().energy(1)).plainText('Oxygen must be 8% or less. Decrease your energy production 1 step.', true);
        }),
      },
    });
  }

  public override action(player: IPlayer) {
    const options: Array<SelectOption> = [];

    if (player.plants > 0) {
      options.push(new SelectOption('Spend 1 plant to gain 7 M€.').andThen(() => {
        this.spendAndGain(player, Resource.PLANTS);
        return undefined;
      }));
    }

    if (player.steel > 0) {
      options.push(new SelectOption('Spend 1 steel to gain 7 M€.').andThen(() => {
        this.spendAndGain(player, Resource.STEEL);
        return undefined;
      }));
    }

    if (options.length === 1) {
      options[0].cb(undefined);
      return undefined;
    }

    player.defer(new OrOptions(...options));
    return undefined;
  }

  private spendAndGain(player: IPlayer, resource: Resource.PLANTS | Resource.STEEL) {
    if (resource === Resource.PLANTS) {
      player.stock.deduct(Resource.PLANTS, 1);
    } else {
      player.pay(Payment.of({steel: 1}));
    }

    player.stock.add(Resource.MEGACREDITS, 7);
    player.game.log('${0} spent 1 ${1} to gain 7 M€', (b) =>
      b.player(player).string(resource === Resource.PLANTS ? 'plant' : 'steel'));
  }
}
