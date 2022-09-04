import {CardName} from '../../../common/cards/CardName';
import {Player} from '../../Player';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {CardResource} from '../../../common/CardResource';
import {StealResources} from '../../deferredActions/StealResources';
import {Resources} from '../../../common/Resources';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {all} from '../Options';
import {VictoryPoints} from '../ICard';

export class AncientShipyards extends Card {
  constructor() {
    super({
      name: CardName.ANCIENT_SHIPYARDS,
      cardType: CardType.ACTIVE,
      tags: [Tag.MOON, Tag.SPACE],
      cost: 6,

      resourceType: CardResource.RESOURCE_CUBE,
      victoryPoints: VictoryPoints.resource(-1, 1),
      reserveUnits: {titanium: 3},

      metadata: {
        description: 'Spend 3 titanium. -1 VP for every resource here.',
        cardNumber: 'M19',
        renderData: CardRenderer.builder((b) => {
          b.action('Steal 8 M€ from any player and add a resource cube here.', (eb) => {
            eb.empty().startAction.text('Steal').nbsp.megacredits(8, {all}).colon().resourceCube(1);
          }).br.br;
          b.minus().titanium(3);
        }),
      },
    });
  }

  public canAct(): boolean {
    return true;
  }

  public action(player: Player) {
    const deferredAction = new StealResources(player, Resources.MEGACREDITS, 8);
    deferredAction.stealComplete = () => {
      player.addResourceTo(this, 1);
    };
    player.game.defer(deferredAction);
    return undefined;
  }
}
