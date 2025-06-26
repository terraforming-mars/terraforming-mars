import {CardName} from '../../../common/cards/CardName';
import {IPlayer} from '../../IPlayer';
import {PlayerInput} from '../../PlayerInput';
import {CardRenderer} from '../render/CardRenderer';
import {CeoCard} from './CeoCard';
import {Resource} from '../../../common/Resource';

export class Bjorn extends CeoCard {
  constructor() {
    super({
      name: CardName.BJORN,
      metadata: {
        cardNumber: 'L02',
        renderData: CardRenderer.builder((b) => {
          b.opgArrow().text('STEAL').megacredits(1, {text: 'x+2'}).asterix();
          b.br;
        }),
        description: 'Once per game, steal X+2 M€ from each player that has more M€ than you, where X is the current generation number.',
      },
    });
  }

  public action(player: IPlayer): PlayerInput | undefined {
    this.isDisabled = true;
    const game = player.game;
    const targets = player.getOpponents().filter((p) => p.megaCredits > player.megaCredits);

    const amount = game.generation + 2;
    for (const target of targets) {
      target.attack(player, Resource.MEGACREDITS, amount, {log: true, stealing: true});
    }

    return undefined;
  }
}
