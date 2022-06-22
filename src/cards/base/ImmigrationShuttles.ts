import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {Card} from '../Card';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {Resources} from '../../common/Resources';
import {CardName} from '../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';

export class ImmigrationShuttles extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.IMMIGRATION_SHUTTLES,
      tags: [Tags.EARTH, Tags.SPACE],
      cost: 31,
      victoryPoints: 'special',

      metadata: {
        cardNumber: '198',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(5)).br;
          b.vpText('1 VP for every 3rd City in play.');
        }),
        description: 'Increase your M€ production 5 steps.',
        victoryPoints: CardRenderDynamicVictoryPoints.cities(1, 3, true),
      },
    });
  }
  public override getVictoryPoints(player: Player) {
    return Math.floor(player.game.getCitiesCount() / 3);
  }
  public play(player: Player) {
    player.addProduction(Resources.MEGACREDITS, 5);
    return undefined;
  }
}
