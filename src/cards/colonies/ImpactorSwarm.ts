import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {RemoveAnyPlants} from '../../deferredActions/RemoveAnyPlants';
import {CardRequirements} from '../CardRequirements';
import {Card} from '../Card';
import {CardRenderer} from '../render/CardRenderer';

export class ImpactorSwarm extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 11,
      tags: [Tags.SPACE],
      name: CardName.IMPACTOR_SWARM,
      cardType: CardType.EVENT,

      requirements: CardRequirements.builder((b) => b.tag(Tags.JOVIAN, 2)),
      metadata: {
        cardNumber: 'C16',
        renderData: CardRenderer.builder((b) => {
          b.heat(12).digit.br;
          b.minus().plants(2).any;
        }),
        description: 'Requires 2 Jovian tags. Gain 12 heat. Remove up to 2 plants from any player.',
      },
    });
  }

  public canPlay(player: Player): boolean {
    return player.getTagCount(Tags.JOVIAN) >= 2;
  }

  public play(player: Player) {
    player.game.defer(new RemoveAnyPlants(player, 2));
    player.heat += 12;
    return undefined;
  }
}
