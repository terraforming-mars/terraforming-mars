import {CardName} from '@/common/cards/CardName';
import {Tag} from '@/common/cards/Tag';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {MarsBotCorp} from '@/server/automa/MarsBotCorp';
import {addFloaterAtRoundStart} from '@/server/automa/corps/BaseGameCorps';

export class StormCraftIncorporatedMarsBot extends MarsBotCorp {
  constructor() {
    super({
      name: CardName.STORMCRAFT_INCORPORATED,
      description: 'Tag: Jovian. Setup: +1 floater. Each round start: +1 floater. Spending floaters for an extra card also raises temperature +1.',
      tags: [Tag.JOVIAN],
      requiredExpansions: ['venus', 'colonies'],
    });
  }

  public override setup(marsBot: IMarsBot): void {
    marsBot.addFloaters(1);
    marsBot.game.log('MarsBot (Stormcraft): +1 floater');
  }

  public override onFloatersSpentForExtraCard(marsBot: IMarsBot): void {
    marsBot.raiseTemperature(1);
    marsBot.game.log('MarsBot (Stormcraft): floaters spent for an extra card, temperature +1');
  }

  public override roundStart(marsBot: IMarsBot): void {
    addFloaterAtRoundStart(marsBot, 'Stormcraft');
  }
}
