import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {CardName} from '../../common/cards/CardName';
import {Resources} from '../../common/Resources';
import {Card} from '../Card';
import {CardRenderer} from '../render/CardRenderer';
import {played} from '../Options';

export class LunarMining extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 11,
      tags: [Tags.EARTH],
      name: CardName.LUNAR_MINING,
      cardType: CardType.AUTOMATED,

      metadata: {
        cardNumber: 'C22',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.titanium(1).slash().earth(2, {played});
          });
        }),
        description: 'Increase your titanium production 1 step for every 2 Earth tags you have in play, including this.',
      },
    });
  }

  public play(player: Player) {
    player.addProduction(Resources.TITANIUM, Math.floor((player.getTagCount(Tags.EARTH)+1) / 2), {log: true});
    return undefined;
  }
}
