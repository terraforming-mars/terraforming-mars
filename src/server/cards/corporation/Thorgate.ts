import {Tag} from '../../../common/cards/Tag';
import {CorporationCard} from './CorporationCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {IPlayer} from '../../IPlayer';
import {IStandardProjectCard} from '../IStandardProjectCard';
import {ICorporationCard} from './ICorporationCard';
import {Resource} from '../../../common/Resource';

export class Thorgate extends CorporationCard implements ICorporationCard {
  constructor() {
    super({
      name: CardName.THORGATE,
      tags: [Tag.SCIENCE, Tag.POWER],
      startingMegaCredits: 48,

      behavior: {
        production: {energy: 1},
      },

      cardDiscount: {tag: Tag.POWER, amount: 3},
      metadata: {
        cardNumber: 'R13',
        description: 'You start with 1 energy production and 48 M€.',
        renderData: CardRenderer.builder((b) => {
          b.br;
          b.production((pb) => pb.energy(1)).nbsp.megacredits(48);
          
          b.corpBox('effect', (ce) => {
            ce.effect('When playing a power card OR THE STANDARD PROJECT POWER PLANT, you pay 3 M€ less for it.', (eb) => {
              eb.tag(Tag.POWER).asterix().startEffect.megacredits(-3);
            });
          });

          b.corpBox('action', (cb) => {
            cb.action('Decrease your energy production 1 step to gain 6 M€.', (ab) => {
              ab.production((pb) => pb.energy(1)).startAction.megacredits(6);
            });
          });
        }),
      },
    });
  }

  public canAct(player: IPlayer): boolean {
    return player.production.energy > 0;
  }

  public action(player: IPlayer) {
    player.production.add(Resource.ENERGY, -1, {log: true});
    player.stock.add(Resource.MEGACREDITS, 6, {log: true});
    player.game.log('${0} decreased energy production 1 step to gain 6 M€', (b) => b.player(player));
    return undefined;
  }

  public getStandardProjectDiscount(_player: IPlayer, card: IStandardProjectCard): number {
    if (card.name === CardName.POWER_PLANT_STANDARD_PROJECT) {
      return 3;
    }
    return 0;
  }
}

