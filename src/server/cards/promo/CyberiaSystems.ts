import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {RoboticWorkforceBase} from '../base/RoboticWorkforceBase';
import {Size} from '../../../common/cards/render/Size';
import {IPlayer} from '../../IPlayer';
import {ICard} from '../ICard';
import {Priority} from '../../deferredActions/Priority';

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
            .production((pb) => pb.tag(Tag.BUILDING))
            .production((pb) => pb.tag(Tag.BUILDING))
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
    const firstSet = this.getPlayableBuildingCards(player);
    const selectFirstCard = this.selectBuildingCard(player, firstSet, 'Select first builder card to copy', (card) => {
      const secondSet = this.getPlayableBuildingCards(player).filter((c) => c !== card);
      player.defer(this.selectBuildingCard(player, secondSet, 'Select second card to copy'), Priority.ROBOTIC_WORKFORCE);
      return undefined;
    });

    player.defer(selectFirstCard, Priority.ROBOTIC_WORKFORCE);
    return undefined;
  }
}
