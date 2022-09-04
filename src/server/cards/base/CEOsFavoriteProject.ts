import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {SelectCard} from '../../inputs/SelectCard';
import {CardName} from '../../../common/cards/CardName';
import {LogHelper} from '../../LogHelper';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';
import {RobotCard} from '../promo/SelfReplicatingRobots';

export class CEOsFavoriteProject extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.CEOS_FAVORITE_PROJECT,
      cost: 1,

      metadata: {
        cardNumber: '149',
        renderData: CardRenderer.builder((b) => b.text('Add 1 resource to a card with at least 1 resource on it', Size.SMALL, true)),
      },
    });
  }
  public override bespokeCanPlay(player: Player): boolean {
    return player.getCardsWithResources().length > 0 ||
           player.getSelfReplicatingRobotsTargetCards().length > 0;
  }

  public override bespokePlay(player: Player) {
    const cards = player.getCardsWithResources();
    const robotCards = player.getSelfReplicatingRobotsTargetCards();
    return new SelectCard(
      'Select card to add resource',
      'Add resource',
      cards.concat(robotCards.map((c) => c.card)),
      ([card]) => {
        // if the user selected a robot card, handle it here:
        const robotCard: RobotCard | undefined = robotCards.find((c) => c.card.name === card.name);
        if (robotCard) {
          robotCard.resourceCount++;
          LogHelper.logAddResource(player, robotCard.card);
        } else {
          if (!cards.includes(card)) {
            throw new Error('Invalid card selection');
          }
          player.addResourceTo(card, {log: true});
        }
        return undefined;
      },
    );
  }
}
