import {CardName} from '@/common/cards/CardName';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {MarsBotCorp} from '@/server/automa/MarsBotCorp';

export class PristarMarsBot extends MarsBotCorp {
  constructor() {
    super({
      name: CardName.PRISTAR,
      description: 'When a global parameter would be raised and a cube is on card: skip the raise, remove cube, +1 TR, +6 M€. Cube is restored each generation.',
    });
  }

  public override interceptGlobalParameterRaise(marsBot: IMarsBot): boolean {
    const cube = marsBot.getCorpState('whiteCubeOnCard');
    if (cube > 0) {
      marsBot.setCorpState('whiteCubeOnCard', 0);
      marsBot.raiseTR(1);
      marsBot.gainMc(6);
      marsBot.game.log('MarsBot (${0}): parameter raise intercepted: removed cube, +1 TR, +6:r:mc:, SKIP raise', (b) => b.cardName(this.name));
      return true; // SKIP the parameter raise
    }
    return false;
  }

  public override beforeActionPhase(marsBot: IMarsBot): void {
    if (marsBot.getCorpState('whiteCubeOnCard') === 0) {
      marsBot.setCorpState('whiteCubeOnCard', 1);
      marsBot.game.log('MarsBot (${0}): added white cube on card', (b) => b.cardName(this.name));
    }
  }
}
