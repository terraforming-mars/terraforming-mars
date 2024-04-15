import {IActionCard} from '../ICard';
import {Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../IPlayer';
import {CorporationCard} from '../corporation/CorporationCard';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {Resource} from '../../../common/Resource';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {digit} from '../Options';

export class UtopiaInvest extends CorporationCard implements IActionCard {
  constructor() {
    super({
      name: CardName.UTOPIA_INVEST,
      tags: [Tag.BUILDING],
      startingMegaCredits: 40,

      behavior: {
        production: {steel: 1, titanium: 1},
      },

      metadata: {
        cardNumber: 'R33',
        description: 'You start with 40 M€. Increase your steel and titanium production 1 step each.',
        renderData: CardRenderer.builder((b) => {
          b.br;
          b.megacredits(40).nbsp.production((pb) => pb.steel(1).titanium(1));
          b.corpBox('action', (ce) => {
            ce.action('Decrease any production to gain 4 resources of that kind.', (eb) => {
              eb.production((eb) => eb.wild(1)).startAction.wild(4, {digit});
            });
          });
        }),
      },
    });
  }
  public canAct(player: IPlayer): boolean {
    return player.production.megacredits +
                player.production.steel +
                player.production.titanium +
                player.production.plants +
                player.production.energy +
                player.production.heat > -5;
  }
  private log(player: IPlayer, type: string) {
    player.game.log('${0} decreased ${1} production 1 step to gain 4 ${2}', (b) => b.player(player).string(type).string(type));
  }
  public action(player: IPlayer) {
    const result = new OrOptions();
    result.title = 'Select production to decrease one step and gain 4 resources';

    const options = [];

    const reduceMegacredits = new SelectOption('Decrease M€ production', 'Decrease production').andThen(() => {
      player.production.add(Resource.MEGACREDITS, -1);
      player.megaCredits += 4;
      this.log(player, 'megacredit');
      return undefined;
    });

    const reduceSteel = new SelectOption('Decrease steel production', 'Decrease production').andThen(() => {
      player.production.add(Resource.STEEL, -1);
      player.steel += 4;
      this.log(player, 'steel');
      return undefined;
    });

    const reduceTitanium = new SelectOption('Decrease titanium production', 'Decrease production').andThen(() => {
      player.production.add(Resource.TITANIUM, -1);
      player.titanium += 4;
      this.log(player, 'titanium');
      return undefined;
    });

    const reducePlants = new SelectOption('Decrease plants production', 'Decrease production').andThen(() => {
      player.production.add(Resource.PLANTS, -1);
      player.plants += 4;
      this.log(player, 'plant');
      return undefined;
    });

    const reduceEnergy = new SelectOption('Decrease energy production', 'Decrease production').andThen(() => {
      player.production.add(Resource.ENERGY, -1);
      player.energy += 4;
      this.log(player, 'energy');
      return undefined;
    });

    const reduceHeat = new SelectOption('Decrease heat production', 'Decrease production').andThen(() => {
      player.production.add(Resource.HEAT, -1);
      player.heat += 4;
      this.log(player, 'heat');
      return undefined;
    });

    if (player.production.megacredits > -5) {
      options.push(reduceMegacredits);
    }
    if (player.production.steel > 0) {
      options.push(reduceSteel);
    }
    if (player.production.titanium > 0) {
      options.push(reduceTitanium);
    }
    if (player.production.plants > 0) {
      options.push(reducePlants);
    }
    if (player.production.energy > 0) {
      options.push(reduceEnergy);
    }
    if (player.production.heat > 0) {
      options.push(reduceHeat);
    }

    result.options = options;
    return result;
  }
}
