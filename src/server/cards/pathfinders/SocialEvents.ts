import {IProjectCard} from '../IProjectCard';
import {IPlayer} from '../../IPlayer';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';

export class SocialEvents extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.EVENT,
      name: CardName.SOCIAL_EVENTS,
      cost: 18,
      tags: [Tag.EARTH, Tag.MARS],

      metadata: {
        cardNumber: 'PfT10',
        renderData: CardRenderer.builder((b) => {
          b.tr(1).slash().tag(Tag.MARS, 2);
        }),
        description: 'Gain 1 TR for every 2 Mars tags you have (including this one.)',
      },
    });
  }

  public computeTr(player: IPlayer) {
    const expectedTr = Math.floor((player.tags.count(Tag.MARS) + 1) / 2); // +1 is the "including this";
    return {tr: expectedTr};
  }

  public override bespokePlay(player: IPlayer) {
    const steps = this.computeTr(player).tr;
    player.increaseTerraformRating(steps, {log: true});
    return undefined;
  }
}
