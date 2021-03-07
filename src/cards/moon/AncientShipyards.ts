import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {Tags} from '../Tags';
import {ResourceType} from '../../ResourceType';
import {StealResources} from '../../deferredActions/StealResources';
import {Resources} from '../../Resources';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';
import {Units} from '../../Units';
import {MoonCard} from './MoonCard';

export class AncientShipyards extends MoonCard {
  constructor() {
    super({
      name: CardName.ANCIENT_SHIPYARDS,
      cardType: CardType.ACTIVE,
      tags: [Tags.MOON, Tags.SPACE],
      cost: 6,
      resourceType: ResourceType.RESOURCE_CUBE,

      metadata: {
        description: 'Spend 3 titanium. -1 VP for every 2 resources here.',
        cardNumber: 'M19',
        renderData: CardRenderer.builder((b) => {
          b.action('Steal 8 MC from any player and add a resource cube to this card.', (eb) => {
            eb.empty().startAction.text('Steal').megacredits(8).any.colon().resourceCube(1);
          }).br.br;
          b.minus().titanium(3);
        }),
        victoryPoints: CardRenderDynamicVictoryPoints.resourceCube(-1, 2),
      },
    }, {
      reserveUnits: Units.of({titanium: 3}),
    });
  };
  public resourceCount: number = 0;

  public canPlay(): boolean {
    return true;
  }

  public play(player: Player) {
    super.play(player);
    return undefined;
  }

  public canAct(): boolean {
    return true;
  }

  public action(player: Player) {
    const deferredAction = new StealResources(player, Resources.MEGACREDITS, 8);
    deferredAction.stealComplete = () => {
      this.resourceCount++;
    };
    player.game.defer(deferredAction);
    return undefined;
  }

  public getVictoryPoints() {
    return -Math.floor(this.resourceCount / 2);
  }
}
