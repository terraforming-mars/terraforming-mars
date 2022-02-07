import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {CardName} from '../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {digit, played} from '../Options';

export class SolarProbe extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 9,
      tags: [Tags.SPACE, Tags.SCIENCE],
      name: CardName.SOLAR_PROBE,
      cardType: CardType.EVENT,
      victoryPoints: 1,

      metadata: {
        cardNumber: 'C37',
        renderData: CardRenderer.builder((b) => {
          b.cards(1).slash().science(3, {digit, played});
        }),
        description: 'Draw 1 card for every 3 science tags you have, including this.',
      },
    });
  }

  public play(player: Player) {
    player.drawCard(Math.floor((player.getTagCount(Tags.SCIENCE) + 1) / 3));
    return undefined;
  }
}
