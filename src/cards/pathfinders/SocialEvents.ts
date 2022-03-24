import {IProjectCard} from '../IProjectCard';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardType} from '../../common/cards/CardType';
import {CardName} from '../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tags} from '../../common/cards/Tags';
import {played} from '../Options';

export class SocialEvents extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.SOCIAL_EVENTS,
      cost: 18,
      tags: [Tags.EARTH, Tags.MARS],

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
    return Math.floor((player.getTagCount(Tags.MARS) + 1) / 2); // +1 is the "including this"
  }
  public override canPlay(player: Player): boolean {
    return player.canAfford(player.getCardCost(this), {tr: {tr: this.getExpectedTr(player)}});
  }

  public play(player: Player) {
    player.increaseTerraformRatingSteps(this.getExpectedTr(player));
    return undefined;
  }
}
