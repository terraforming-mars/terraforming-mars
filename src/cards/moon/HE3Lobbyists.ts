import {CardName} from '../../common/cards/CardName';
import {Player} from '../../Player';
import {CardType} from '../../common/cards/CardType';
import {Tags} from '../../common/cards/Tags';
import {Resources} from '../../common/Resources';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';

export class HE3Lobbyists extends Card {
  constructor() {
    super({
      name: CardName.HE3_LOBBYISTS,
      cardType: CardType.AUTOMATED,
      tags: [Tags.MOON],
      cost: 7,

      metadata: {
        description: 'Increase your M€ production 1 step for each moon tag you have (including this).',
        cardNumber: 'M50',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(1)).slash().moon();
        }),
      },
    });
  }

  public play(player: Player) {
    // + 1 because the tag above isn't yet included in the played cards pile.
    player.addProduction(Resources.MEGACREDITS, player.getTagCount(Tags.MOON) + 1, {log: true});
    return undefined;
  }
}
