import {CardName} from '../../common/cards/CardName';
import {Player} from '../../Player';
import {CardType} from '../../common/cards/CardType';
import {Tags} from '../../common/cards/Tags';
import {IActionCard} from '../ICard';
import {CardResource} from '../../common/CardResource';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../common/Units';
import {MoonCard} from './MoonCard';
import {CardRequirements} from '../CardRequirements';
import {played} from '../Options';
import {VictoryPoints} from '../ICard';

export class PrideoftheEarthArkship extends MoonCard implements IActionCard {
  constructor() {
    super({
      name: CardName.PRIDE_OF_THE_EARTH_ARKSHIP,
      cardType: CardType.ACTIVE,
      tags: [Tags.SCIENCE, Tags.SCIENCE, Tags.SPACE],
      cost: 22,

      resourceType: CardResource.SCIENCE,
      victoryPoints: VictoryPoints.resource(1, 1),
      requirements: CardRequirements.builder((b) => b.tag(Tags.SCIENCE).tag(Tags.SPACE, 2)),
      reserveUnits: Units.of({titanium: 2}),

      metadata: {
        description: 'Requires 1 science and 2 space tags. Spend 2 titanium. 1 VP per science resource here.',
        cardNumber: 'M24',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 1 science resource here per every 5 science tags you have.', (eb) => {
            eb.empty().startAction.science(1).slash().text('5').science(1, {played});
          }).br;
          b.minus().titanium(2);
        }),
      },
    });
  }
  public override resourceCount = 0;

  public override play(player: Player) {
    super.play(player);
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
}
