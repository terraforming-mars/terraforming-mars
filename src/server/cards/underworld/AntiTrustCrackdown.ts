import {CardType} from '@/common/cards/CardType';
import {IProjectCard} from '@/server/cards/IProjectCard';
import {CardName} from '@/common/cards/CardName';
import {CardRenderer} from '@/server/cards/render/CardRenderer';
import {Card} from '@/server/cards/Card';
import {Tag} from '@/common/cards/Tag';
import {all, max} from '@/server/cards/Options';
import {IPlayer} from '@/server/IPlayer';
import {UnderworldExpansion} from '@/server/underworld/UnderworldExpansion';

export class AntiTrustCrackdown extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.ANTI_TRUST_CRACKDOWN,
      type: CardType.EVENT,
      cost: 18,
      tags: [Tag.EARTH],
      victoryPoints: 2,

      requirements: {corruption: 0, max},

      metadata: {
        cardNumber: 'U064',
        renderData: CardRenderer.builder((b) => {
          b.text('-2').corruption(1, {all}).asterix().br;
          b.plainText('Requires that you have no more than 0 corruption. ALL players lose 2 corruption each.');
        }),
      },
    });
  }

  public override bespokePlay(player: IPlayer) {
    player.game.playersInGenerationOrder.forEach((p) => {
      if (p !== player) {
        const loss = Math.min(p.underworldData.corruption, 2);
        if (loss > 0) {
          UnderworldExpansion.loseCorruption(p, loss, {log: true});
        }
      }
    });
    return undefined;
  }
}
