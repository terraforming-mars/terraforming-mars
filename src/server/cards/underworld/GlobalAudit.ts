import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {IPlayer} from '../../IPlayer';
import {Tag} from '../../../common/cards/Tag';

export class GlobalAudit extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.GLOBAL_AUDIT,
      type: CardType.EVENT,
      cost: 2,
      tags: [Tag.EARTH],

      metadata: {
        cardNumber: 'U025',
        renderData: CardRenderer.builder((b) => {
          b.text('Min.').tag(Tag.CRIME).colon().tr(1).br;
          b.text('0').tag(Tag.CRIME).colon().tr(1);
        }),
        description: 'Every player with the lowest number of crime tags INCLUDING EVENTS gains 1 TR, if possible. ' +
          'Players with 0 crime tags gain 1 additional TR.',
      },
    });
  }

  public override bespokePlay(player: IPlayer) {
    const lowestCrimeTagCount = player.game.players
      .map((p) => p.tags.count(Tag.CRIME, 'raw-underworld'))
      .reduce((a, b) => Math.min(a, b));
    for (const p of player.game.players) {
      const count = p.tags.count(Tag.CRIME, 'raw-underworld');
      const expectedTr = (count === 0) ? 2 : count === lowestCrimeTagCount ? 1 : 0;
      let tr = expectedTr;
      while (tr > 0) {
        if (p.canAfford({cost: 0, tr: {tr: tr}})) {
          p.increaseTerraformRating(tr, {log: true});
          break;
        }
        tr--;
      }
      if (tr < expectedTr) {
        p.game.log('${0} gains ${1} TR instead of ${2} due to the Reds ruling policy',
          (b) => b.player(p).number(tr).number(expectedTr));
      }
    }
    return undefined;
  }
}
