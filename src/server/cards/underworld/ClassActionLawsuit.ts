import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../IPlayer';
import {UnderworldExpansion} from '../../underworld/UnderworldExpansion';
import {Resource} from '../../../common/Resource';
import {Size} from '../../../common/cards/render/Size';

export class ClassActionLawsuit extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.CLASS_ACTION_LAWSUIT,
      type: CardType.EVENT,
      cost: 25,
      tags: [Tag.EARTH],

      victoryPoints: 3,

      metadata: {
        cardNumber: 'U82',
        renderData: CardRenderer.builder((b) => {
          b.text('-X').corruption(1).asterix().text('-X').megacredits(3).asterix().br;
          b.text('THIS CAN\'T BE BLOCKED BY CORRUPTION', Size.SMALL);
        }),
        description: 'The player with more corruption than anybody else ' +
        'discards corruption until they have the same amount as the 2nd highest player, ' +
        'along with 3 M€ per unit of corruption removed this way.',
      },
    });
  }

  private analyzeCorruption(player: IPlayer) {
    const players = player.game.getPlayers();
    const maxCorruption = Math.max(...players.map((p) => p.underworldData.corruption));
    const playersWithMaxCorruption = players.filter((p) => p.underworldData.corruption === maxCorruption);
    return {maxCorruption, playersWithMaxCorruption};
  }

  public override bespokeCanPlay(player: IPlayer): boolean {
    if (player.game.isSoloMode()) {
      this.warnings.add('noEffect');
    } else {
      const analysis = this.analyzeCorruption(player);
      if (analysis.playersWithMaxCorruption.length > 1) {
        return false;
      }
      if (player.game.getPlayers().length > 1) {
        if (analysis.playersWithMaxCorruption.length === 1 && player.underworldData.corruption === analysis.maxCorruption) {
          this.warnings.add('selfTarget');
        }
      }
    }
    return true;
  }

  public override bespokePlay(player: IPlayer) {
    if (player.game.isSoloMode()) {
      return undefined;
    }
    const analysis = this.analyzeCorruption(player);
    const players = player.game.getPlayers();
    if (analysis.playersWithMaxCorruption.length > 1) {
      return undefined;
    }
    const filtered = players
      .filter((p) => p.underworldData.corruption !== analysis.maxCorruption)
      .map((p) => p.underworldData.corruption);
    const secondMost = Math.max(...filtered);
    const diff = analysis.maxCorruption - secondMost;
    const target = analysis.playersWithMaxCorruption[0];
    UnderworldExpansion.loseCorruption(target, diff, {log: true});
    target.stock.deduct(Resource.MEGACREDITS, diff * 3, {log: true, from: player});
    return undefined;
  }
}
