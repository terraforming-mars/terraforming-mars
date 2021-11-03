import {IProjectCard} from '../IProjectCard';

import {Player} from '../../Player';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {ResourceType} from '../../ResourceType';
import {Tags} from '../Tags';
import {CardRequirements} from '../CardRequirements';
import {Resources} from '../../Resources';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';

export class ControlledBloom extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.CONTROLLED_BLOOM,
      cost: 13,
      tags: [Tags.MICROBE, Tags.PLANT],
      victoryPoints: 1,

      requirements: CardRequirements.builder((b) => b.oceans(3)),

      metadata: {
        cardNumber: 'PFTmp',
        renderData: CardRenderer.builder((b) => {
          b.microbes(3).asterix().br;
          b.plants(3);
        }),
        description: 'Requires 3 oceans. Add 3 microbes to any card. Gain 3 plants.',
      },
    });
  }

  public play(player: Player) {
    player.addResource(Resources.PLANTS, 3);
    player.game.defer(new AddResourcesToCard(player, ResourceType.MICROBE, {count: 3}));
    return undefined;
  }
}
