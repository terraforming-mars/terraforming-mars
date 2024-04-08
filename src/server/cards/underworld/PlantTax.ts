import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {IPlayer} from '../../IPlayer';
import {RemoveResources} from '../../deferredActions/RemoveResources';
import {Resource} from '../../../common/Resource';
import {all} from '../Options';
import {UnderworldExpansion} from '../../underworld/UnderworldExpansion';
import {Tag} from '../../../common/cards/Tag';

export class PlantTax extends Card implements IProjectCard {
  public generationUsed: number = -1;

  constructor() {
    super({
      name: CardName.PLANT_TAX,
      type: CardType.EVENT,
      cost: 7,
      tags: [Tag.MARS],

      behavior: {
        underworld: {markThisGeneration: {}},
      },

      metadata: {
        cardNumber: 'U67',
        renderData: CardRenderer.builder((b) => {
          b.minus().plants(2, {all}).asterix().corruption().asterix();
        }),
        description: 'ALL players lose 2 plants. Players can block this with corruption. Gain 1 corruption DURING THE PRODUCTION PHASE OF THIS GENERATION.',
      },
    });
  }

  public override bespokePlay(player: IPlayer) {
    const game = player.game;
    for (const target of game.getPlayers()) {
      game.defer(new RemoveResources(target, player, Resource.PLANTS, 2));
    }
    return undefined;
  }

  public onProductionPhase(player: IPlayer) {
    if (this.generationUsed === player.game.generation) {
      UnderworldExpansion.gainCorruption(player, 1, {log: true});
    }
    return undefined;
  }
}
