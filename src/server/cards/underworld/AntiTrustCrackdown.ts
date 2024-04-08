import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {Tag} from '../../../common/cards/Tag';
import {all, max} from '../Options';
import {IPlayer} from '../../IPlayer';
import {UnderworldExpansion} from '../../underworld/UnderworldExpansion';

export class AntiTrustCrackdown extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.ANTI_TRUST_CRACKDOWN,
      type: CardType.EVENT,
      cost: 22,
      tags: [Tag.EARTH],
      victoryPoints: 2,

      requirements: {corruption: 0, max},

      metadata: {
        cardNumber: 'U64',
        renderData: CardRenderer.builder((b) => {
          b.text('-2').corruption(1, {all}).asterix().br;
          b.plainText('Requires that you have no more than 0 corruption. ALL players lose 2 corruption each.');
        }),
      },
    });
  }

  public override bespokePlay(player: IPlayer) {
    player.game.getPlayersInGenerationOrder().forEach((p) => {
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
