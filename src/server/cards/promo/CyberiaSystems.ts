import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {RoboticWorkforceBase} from '../base/RoboticWorkforceBase';
import {played} from '../Options';
import {Size} from '../../../common/cards/render/Size';
import {IPlayer} from '../../IPlayer';
import {ICard} from '../ICard';

export class CyberiaSystems extends RoboticWorkforceBase {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.CYBERIA_SYSTEMS,
      tags: [Tag.BUILDING],
      cost: 17,

      behavior: {production: {steel: 1}},

      metadata: {
        cardNumber: '',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.steel(1));
          b.text('Copy', Size.SMALL, true)
            .production((pb) => pb.building(1, {played}))
            .production((pb) => pb.building(1, {played}))
            .br;
        }),
        description: 'Raise your steel production 1 step. Copy the production boxes of 2 of your other cards with building tags.',
      },
    });
  }

  protected override getPlayableBuildingCards(player: IPlayer): ReadonlyArray<ICard> {
    return super.getPlayableBuildingCards(player).filter((c) => c.name !== CardName.CYBERIA_SYSTEMS);
  }

  public override bespokePlay(player: IPlayer) {
    const cards = this.getPlayableBuildingCards(player);
    return this.selectBuildingCard(player, cards, 'Select first builder card to copy', (card) => {
      const secondSet = this.getPlayableBuildingCards(player).filter((c) => c !== card);
      return this.selectBuildingCard(player, secondSet, 'Select second card to copy');
    });
  }
}
