import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {CardName} from '../../common/cards/CardName';
import {BuildColony} from '../../deferredActions/BuildColony';
import {CardRenderer} from '../render/CardRenderer';
import {CardRequirements} from '../CardRequirements';
import {Card} from '../Card';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';

export class SpacePortColony extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 27,
      tags: [Tags.SPACE],
      name: CardName.SPACE_PORT_COLONY,
      cardType: CardType.AUTOMATED,

      requirements: CardRequirements.builder((b) => b.colonies()),
      victoryPoints: 'special',

      metadata: {
        cardNumber: 'C39',
        renderData: CardRenderer.builder((b) => {
          b.colonies(1).asterix().nbsp.tradeFleet().br;
          b.vpText('1VP per 2 colonies in play.');
        }),
        description: 'Requires a colony. Place a colony. MAY BE PLACED ON A COLONY TILE WHERE YOU ALREADY HAVE A COLONY. Gain 1 Trade Fleet.',
        victoryPoints: CardRenderDynamicVictoryPoints.colonies(1, 2, true),
      },
    });
  }

  public play(player: Player) {
    player.game.defer(new BuildColony(player, true, 'Select colony for Space Port Colony'));
    player.increaseFleetSize();
    return undefined;
  }

  public override getVictoryPoints(player: Player) {
    let coloniesCount: number = 0;
    player.game.colonies.forEach((colony) => {
      coloniesCount += colony.colonies.length;
    });
    return Math.floor(coloniesCount / 2);
  }
}
