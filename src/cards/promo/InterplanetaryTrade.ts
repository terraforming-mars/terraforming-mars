import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {Tags} from '../Tags';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardRenderer} from '../../cards/render/CardRenderer';
import {DEFAULT_TAG_COUNT} from '../../constants';

export class InterplanetaryTrade extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.INTERPLANETARY_TRADE,
      tags: [Tags.SPACE],
      cost: 27,

      metadata: {
        cardNumber: 'X05',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(1));
          b.slash().diverseTag();
        }),
        description: 'Increase your M€ production 1 step per different tag you have in play, including this.',
        victoryPoints: 1,
      },
    });
  }

  public play(player: Player) {
    // This card tag is counting as well
    const availableTags = player.getDistinctTagCount(true, Tags.SPACE);
    // There is only 10 tags in the base game. One more for Venus and one more for Moon.
    let existingTags = DEFAULT_TAG_COUNT;
    if (player.game.gameOptions.venusNextExtension) existingTags++;
    if (player.game.gameOptions.moonExpansion) existingTags++;
    player.addProduction(Resources.MEGACREDITS, Math.min(availableTags, existingTags), {log: true});
    return undefined;
  }

  public getVictoryPoints() {
    return 1;
  }
}
