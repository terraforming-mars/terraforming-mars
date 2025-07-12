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
        cardNumber: 'U25',
        renderData: CardRenderer.builder((b) => {
          b.text('Min.').tag(Tag.CRIME).colon().tr(1).br;
          b.text('0').tag(Tag.CRIME).colon().tr(1);
        }),
        description: 'Every player with the lowest number of crime tags INCLUDING EVENTS gains 1 TR, if possible. ' +
          'Players with 0 crime tags gain 1 additional TR.',
      },
    });
  } // x

  public override bespokePlay(player: IPlayer) {
    const countByPlayer: Array<[IPlayer, number]> = player.game.players
      .map((p) => [player, p.tags.count(Tag.CRIME, 'raw') + p.tags.count(Tag.CRIME, 'raw-events')]);

    const lowestCrimeTagCount = countByPlayer
      .map((e) => e[1])
      .reduce((a, b) => Math.min(a, b));
    for (const [p, count] of countByPlayer) {
      const tr = (count === 0) ? 2 : count === lowestCrimeTagCount ? 1 : 0;
      if (tr > 0 && p.canAfford({cost: 0, tr: {tr: tr}})) {
        // TODO(kberg): Make it so players who get two but can only afford 1 get one.
        p.increaseTerraformRating(tr, {log: true});
      }
    }
    return undefined;
  }
}
