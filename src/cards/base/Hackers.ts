import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {DecreaseAnyProduction} from '../../deferredActions/DecreaseAnyProduction';
import {CardRenderer} from '../render/CardRenderer';

export class Hackers extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.HACKERS,
      cost: 3,

      metadata: {
        cardNumber: '125',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().energy(1).megacredits(2).any.br;
            pb.plus().megacredits(2);
          });
        }),
        description: 'Decrease your energy production 1 step and any MC production 2 steps. increase your MC production 2 steps.',
        victoryPoints: -1,
      },
    });
  }

  public canPlay(player: Player): boolean {
    return player.getProduction(Resources.ENERGY) >= 1;
  }

  public play(player: Player) {
    player.game.defer(new DecreaseAnyProduction(player, Resources.MEGACREDITS, 2));
    player.addProduction(Resources.MEGACREDITS, 2);
    player.addProduction(Resources.ENERGY, -1);
    return undefined;
  }

  public getVictoryPoints() {
    return -1;
  }
}

