import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {SelectAmount} from '../../inputs/SelectAmount';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';

export class Insulation extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.INSULATION,
      cost: 2,
      hasRequirements: false,

      metadata: {
        cardNumber: '152',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.text('-X').heat(1).nbsp.text('+').megacredits(0).multiplier;
          });
        }),
        description: 'Decrease your heat production any number of steps and increase your MC production the same number of steps.',
      },
    });
  }

  public canPlay(player: Player) {
    return player.getProduction(Resources.HEAT) >= 1;
  }

  public play(player: Player, _game: Game) {
    return new SelectAmount(
      'Select amount of heat production to decrease',
      'Decrease',
      (amount: number) => {
        player.addProduction(Resources.HEAT, -amount);
        player.addProduction(Resources.MEGACREDITS, amount);
        return undefined;
      },
      1,
      player.getProduction(Resources.HEAT),
    );
  }
}
