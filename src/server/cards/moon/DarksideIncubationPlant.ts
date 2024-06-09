import {CardName} from '../../../common/cards/CardName';
import {IPlayer} from '../../IPlayer';
import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardResource} from '../../../common/CardResource';
import {IActionCard} from '../ICard';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {LogHelper} from '../../LogHelper';

export class DarksideIncubationPlant extends Card implements IActionCard, IProjectCard {
  constructor() {
    super({
      name: CardName.DARKSIDE_INCUBATION_PLANT,
      type: CardType.ACTIVE,
      tags: [Tag.MICROBE, Tag.MOON],
      cost: 11,

      resourceType: CardResource.MICROBE,
      victoryPoints: {resourcesHere: {}, per: 2},
      reserveUnits: {titanium: 1},

      metadata: {
        description: {
          text: 'Spend 1 titanium. 1 VP for every 2 microbes here.',
          align: 'left',
        },
        cardNumber: 'M45',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 1 microbe here.', (eb) => {
            eb.empty().startAction.resource(CardResource.MICROBE);
          }).br;
          b.action('Spend 2 microbes to raise the habitat rate 1 step.', (eb) => {
            eb.resource(CardResource.MICROBE, 2).startAction.moonHabitatRate();
          });

          b.br;
          b.minus().titanium(1);
        }),
      },
    });
  }

  public canAct() {
    return true;
  }

  private canRaiseHabitatRate(player: IPlayer) {
    return this.resourceCount >= 2 && player.canAfford({cost: 0, tr: {moonHabitat: 1}});
  }

  public action(player: IPlayer) {
    const options = [];
    MoonExpansion.ifMoon(player.game, (moonData) => {
      if (this.canRaiseHabitatRate(player) && moonData.habitatRate < 8) {
        options.push(new SelectOption('Spend 2 microbes to raise the habitat rate 1 step.').andThen(() => {
          player.removeResourceFrom(this, 2);
          LogHelper.logRemoveResource(player, this, 2, 'raise the habitat rate');
          MoonExpansion.raiseHabitatRate(player);
          return undefined;
        }));
      }
    });
    options.push(new SelectOption('Add 1 microbe to this card').andThen(() => {
      player.addResourceTo(this, 1);
      return undefined;
    }));
    if (options.length === 1) {
      return options[0].cb(undefined);
    } else {
      return new OrOptions(...options);
    }
  }
}
