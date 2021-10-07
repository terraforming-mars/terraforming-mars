import {IProjectCard} from '../IProjectCard';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Resources} from '../../Resources';
import {Tags} from '../Tags';
import {CardRequirements} from '../CardRequirements';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';
import {ResourceType} from '../../ResourceType';
import {Units} from '../../Units';

export class DesignedOrganisms extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.DESIGNED_ORGANISMS,
      cost: 12,
      tags: [Tags.MARS, Tags.ENERGY, Tags.BUILDING],
      requirements: CardRequirements.builder((b) => b.tag(Tags.SCIENCE, 5)),
      productionBox: Units.of({plants: 2}),

      metadata: {
        cardNumber: 'Pf21',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.plants(2)).plants(3).br;
          b.microbes(3).asterix().animals(1).asterix();
        }),
        description: 'Requires 5 science tags. Increase your plant production 2 steps. Gain 3 plants. ' +
          'Add 3 microbes to ANY card. Add 1 animal to ANY card.',
      },
    });
  }

  public play(player: Player) {
    player.addResource(Resources.PLANTS, 3);
    player.addProduction(Resources.PLANTS, 2);
    player.game.defer(new AddResourcesToCard(player, ResourceType.MICROBE, {count: 3}));
    player.game.defer(new AddResourcesToCard(player, ResourceType.ANIMAL, {count: 1}));
    return undefined;
  }
}

