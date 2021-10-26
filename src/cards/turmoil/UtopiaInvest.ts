import {IActionCard} from '../ICard';
import {Tags} from '../Tags';
import {Player} from '../../Player';
import {CorporationCard} from './../corporation/CorporationCard';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {Resources} from '../../Resources';
import {Card} from '../Card';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../Units';
import {digit} from '../Options';

export class UtopiaInvest extends Card implements IActionCard, CorporationCard {
  constructor() {
    super({
      name: CardName.UTOPIA_INVEST,
      tags: [Tags.BUILDING],
      startingMegaCredits: 40,
      cardType: CardType.CORPORATION,
      productionBox: Units.of({steel: 1, titanium: 1}),

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

  public play(player: Player) {
    player.addProduction(Resources.STEEL, 1);
    player.addProduction(Resources.TITANIUM, 1);
    return undefined;
  }
  public canAct(player: Player): boolean {
    return player.getProduction(Resources.MEGACREDITS) +
                player.getProduction(Resources.STEEL) +
                player.getProduction(Resources.TITANIUM) +
                player.getProduction(Resources.PLANTS) +
                player.getProduction(Resources.ENERGY) +
                player.getProduction(Resources.HEAT) > -5;
  }
  private log(player: Player, type: string) {
    player.game.log('${0} decreased ${1} production 1 step to gain 4 ${2}', (b) => b.player(player).string(type).string(type));
  }
  public action(player: Player) {
    const result = new OrOptions();
    result.title = 'Select production to decrease one step and gain 4 resources';

    const options: Array<SelectOption> = [];

    const reduceMegacredits = new SelectOption('Decrease M€ production', 'Decrease production', () => {
      player.addProduction(Resources.MEGACREDITS, -1);
      player.megaCredits += 4;
      this.log(player, 'megacredit');
      return undefined;
    });

    const reduceSteel = new SelectOption('Decrease steel production', 'Decrease production', () => {
      player.addProduction(Resources.STEEL, -1);
      player.steel += 4;
      this.log(player, 'steel');
      return undefined;
    });

    const reduceTitanium = new SelectOption('Decrease titanium production', 'Decrease production', () => {
      player.addProduction(Resources.TITANIUM, -1);
      player.titanium += 4;
      this.log(player, 'titanium');
      return undefined;
    });

    const reducePlants = new SelectOption('Decrease plants production', 'Decrease production', () => {
      player.addProduction(Resources.PLANTS, -1);
      player.plants += 4;
      this.log(player, 'plant');
      return undefined;
    });

    const reduceEnergy = new SelectOption('Decrease energy production', 'Decrease production', () => {
      player.addProduction(Resources.ENERGY, -1);
      player.energy += 4;
      this.log(player, 'energy');
      return undefined;
    });

    const reduceHeat = new SelectOption('Decrease heat production', 'Decrease production', () => {
      player.addProduction(Resources.HEAT, -1);
      player.heat += 4;
      this.log(player, 'heat');
      return undefined;
    });

    if (player.getProduction(Resources.MEGACREDITS) > -5) {
      options.push(reduceMegacredits);
    }
    if (player.getProduction(Resources.STEEL) > 0) {
      options.push(reduceSteel);
    }
    if (player.getProduction(Resources.TITANIUM) > 0) {
      options.push(reduceTitanium);
    }
    if (player.getProduction(Resources.PLANTS) > 0) {
      options.push(reducePlants);
    }
    if (player.getProduction(Resources.ENERGY) > 0) {
      options.push(reduceEnergy);
    }
    if (player.getProduction(Resources.HEAT) > 0) {
      options.push(reduceHeat);
    }

    result.options = options;
    return result;
  }
}
