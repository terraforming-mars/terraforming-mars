import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {Tags} from '../Tags';
import {IActionCard} from '../ICard';
import {ResourceType} from '../../ResourceType';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';
import {Units} from '../../Units';
import {MoonCard} from './MoonCard';

export class PrideoftheEarthArkship extends MoonCard implements IActionCard {
  constructor() {
    super({
      name: CardName.PRIDE_OF_THE_EARTH_ARKSHIP,
      cardType: CardType.ACTIVE,
      tags: [Tags.SCIENCE, Tags.SCIENCE, Tags.SPACE],
      cost: 22,
      resourceType: ResourceType.SCIENCE,

      metadata: {
        description: 'Requires 1 science and 2 space tags. Spend 2 titanium. 1 VP per science resource here.',
        cardNumber: 'M24',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 1 science resource here per every 5 science tags you have.', (eb) => {
            eb.empty().startAction.science(1).slash().text('5').science(); // TODO(kberg): these should be tags, not resources.
          }),
          b.minus().titanium(2);
        }),
        victoryPoints: CardRenderDynamicVictoryPoints.science(1, 1),
      },
    }, {
      reserveUnits: Units.of({titanium: 2}),
    });
  };
  public resourceCount = 0;

  public canPlay(player: Player): boolean {
    return player.getTagCount(Tags.SPACE) >= 2 && player.getTagCount(Tags.SCIENCE) >= 1;
  }

  public play(player: Player) {
    Units.deductUnits(this.reserveUnits, player);
    return undefined;
  }

  public canAct(player: Player) {
    return player.getTagCount(Tags.SCIENCE) >= 5;
  }

  public action(player: Player) {
    const count = Math.floor(player.getTagCount(Tags.SCIENCE) / 5);
    player.addResourceTo(this, count);

    return undefined;
  }

  public getVictoryPoints() {
    return this.resourceCount;
  }
}
