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
      cost: 16,

      behavior: {production: {steel: 1}},

      metadata: {
        cardNumber: 'X53',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.steel(1));
          b.text('Copy', Size.SMALL, true)
            .production((pb) => pb.tag(Tag.BUILDING))
            .production((pb) => pb.tag(Tag.BUILDING))
            .br;
        }),
        description: 'Increase your steel production 1 step. Copy the PRODUCTION BOXES of 2 of your cards with building tags.',
      },
    });
  }

  public override bespokeCanPlay(player: IPlayer): boolean {
    // Right now, this just verifies that the player actually has two cards with building tags and
    // production boxes. It does not ensure that there is a play order that allows 2 cards to be
    // played in a row. That would take some work.
    //
    // This will at least ensure that there's at least one card you can play right now.
    //
    // TODO(kberg): Do that. It will require a special case for Small Open Pit Mine, or
    // it will need the same behavior that Mining Area and Mining Rights works.
    return this.getPlayableBuildingCards(player, false).length >= 2 &&
      this.getPlayableBuildingCards(player, true).length >= 1;
  }

  protected override getPlayableBuildingCards(player: IPlayer, canAfford: boolean = true): ReadonlyArray<ICard> {
    return super.getPlayableBuildingCards(player, canAfford).filter((c) => c.name !== CardName.CYBERIA_SYSTEMS);
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
