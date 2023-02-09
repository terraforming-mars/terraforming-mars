import {IProjectCard} from '../IProjectCard';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import {played} from '../Options';

export class SocialEvents extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.SOCIAL_EVENTS,
      cost: 18,
      tags: [Tag.EARTH, Tag.MARS],
      tr: ((player) => ({tr: this.getExpectedTr(player)})),

      metadata: {
        cardNumber: '...',
        renderData: CardRenderer.builder((b) => {
          b.tr(1).slash().mars(2, {played});
        }),
        description: 'Gain 1 TR for every 2 Mars tags you have (including this one.)',
      },
    });
  }

  private getExpectedTr(player: Player) {
    return Math.floor((player.tags.count(Tag.MARS) + 1) / 2); // +1 is the "including this"
  }

  public override bespokePlay(player: Player) {
    player.increaseTerraformRatingSteps(this.getExpectedTr(player), {log: true});
    return undefined;
  }
}
