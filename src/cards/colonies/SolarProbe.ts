import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';

export class SolarProbe extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 9,
      tags: [Tags.SPACE, Tags.SCIENCE],
      name: CardName.SOLAR_PROBE,
      cardType: CardType.EVENT,

      metadata: {
        cardNumber: 'C37',
        renderData: CardRenderer.builder((b) => {
          b.cards(1).slash().science(3).digit.played;
        }),
        description: 'Draw 1 card for every 3 science tags you have, including this.',
        victoryPoints: 1,
      },
    });
  }

  public play(player: Player) {
    player.drawCard(Math.floor((player.getTagCount(Tags.SCIENCE) + 1) / 3));
    return undefined;
  }

  public getVictoryPoints() {
    return 1;
  }
}
