import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {Card} from '../Card';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {CardName} from '../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class TechnologyDemonstration extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.TECHNOLOGY_DEMONSTRATION,
      tags: [Tags.SCIENCE, Tags.SPACE],
      cost: 5,
      metadata: {
        cardNumber: '204',
        renderData: CardRenderer.builder((b) => {
          b.cards(2);
        }),
        description: 'Draw two cards.',
      },
    });
  }
  public play(player: Player) {
    player.drawCard(2);
    return undefined;
  }
}

