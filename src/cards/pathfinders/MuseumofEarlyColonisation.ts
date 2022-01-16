import {IProjectCard} from '../IProjectCard';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tags} from '../Tags';
import {CardRequirements} from '../CardRequirements';
import {Units} from '../../Units';
import {all} from '../Options';

export class MuseumofEarlyColonisation extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.MUSEUM_OF_EARLY_COLONISATION,
      cost: 20,
      tags: [Tags.BUILDING, Tags.MARS],
      requirements: CardRequirements.builder((b) => b.oceans(1).cities(1, {all}).greeneries(1, {all})),
      productionBox: Units.of({energy: -1, steel: 1, titanium: 1, plants: 1}),
      tr: {tr: 1},

      metadata: {
        cardNumber: 'Pf11',
        renderData: CardRenderer.builder((b) => {
          b.production(((pb) => pb.minus().energy(1).nbsp.steel(1).titanium(1).plants(1)));
          b.br.tr(1);
        }),
        description: 'Requires 1 ocean, 1 city and one greenery on Mars. ' +
         'Decrease your energy production 1 step. Raise your steel, titanium, and plant production 1 step. ' +
         'Gain 1 TR.',
      },
    });
  }

  public override canPlay(player: Player) {
    return super.canPlay(player) && player.canAdjustProduction(this.productionBox);
  }
  public play(player: Player) {
    player.adjustProduction(this.productionBox);
    player.increaseTerraformRating();
    return undefined;
  }
}

