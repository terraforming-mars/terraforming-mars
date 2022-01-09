import {IProjectCard} from '../IProjectCard';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tags} from '../Tags';
import {Resources} from '../../Resources';
import {VictoryPoints} from '../ICard';

export class CultivationOfVenus extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.CULTIVATION_OF_VENUS,
      cost: 18,
      tags: [Tags.PLANT, Tags.VENUS],
      victoryPoints: VictoryPoints.tags(Tags.VENUS, 1, 2),

      metadata: {
        cardNumber: 'Pf45',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 3 plants to raise Venus 1 step.', (eb) => {
            eb.plants(3).startAction.venus(1);
          }).br;
        }),
        description: '1 VP for every 2 Venus tags you own.',
      },
    });
  }

  public canAct(player: Player) {
    return player.plants >= 3 && player.canAfford(0, {tr: {venus: 1}});
  }

  public action(player: Player) {
    player.deductResource(Resources.PLANTS, 3);
    player.game.increaseVenusScaleLevel(player, 1);
    player.game.log('${0} spent 3 plants to raise the Venus level 1 step', (b) => b.player(player));
    return undefined;
  }

  public play() {
    return undefined;
  }
}

