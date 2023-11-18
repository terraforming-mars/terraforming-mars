import {CardName} from '../../../common/cards/CardName';
import {IPlayer} from '../../IPlayer';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {CardResource} from '../../../common/CardResource';
import {Resource} from '../../../common/Resource';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {all} from '../Options';
import {UnderworldExpansion} from '../../underworld/UnderworldExpansion';

export class AncientShipyards extends Card {
  constructor() {
    super({
      name: CardName.ANCIENT_SHIPYARDS,
      type: CardType.ACTIVE,
      tags: [Tag.MOON, Tag.SPACE],
      cost: 6,

      resourceType: CardResource.RESOURCE_CUBE,
      victoryPoints: {resourcesHere: {}, each: -1},
      reserveUnits: {titanium: 3},

      metadata: {
        description: 'Spend 3 titanium. -1 VP for every resource here.',
        cardNumber: 'M19',
        renderData: CardRenderer.builder((b) => {
          b.action('Steal 2 M€ from each player and add a resource cube here.', (eb) => {
            eb.empty().startAction.text('Steal').nbsp.megacredits(2, {all}).asterix().colon().resourceCube(1);
          }).br.br;
          b.minus().titanium(3);
        }),
      },
    });
  }

  public canAct(): boolean {
    return true;
  }

  public action(player: IPlayer) {
    const game = player.game;
    for (const target of game.getPlayers()) {
      if (target === player) continue;
      target.defer(UnderworldExpansion.maybeBlockAttack(target, player, (proceed) => {
        if (proceed) {
          target.stock.steal(Resource.MEGACREDITS, 2, player);
        }
        return undefined;
      }));
    }
    if (game.isSoloMode()) {
      player.stock.add(Resource.MEGACREDITS, 2);
    }
    player.addResourceTo(this, 1);
    return undefined;
  }
}
