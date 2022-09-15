import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {CardName} from '../../../common/cards/CardName';
import {PlaceOceanTile} from '../../deferredActions/PlaceOceanTile';
import {Card} from '../Card';
import {CardRenderer} from '../render/CardRenderer';

export class IceMoonColony extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 23,
      tags: [Tag.SPACE],
      name: CardName.ICE_MOON_COLONY,
      cardType: CardType.AUTOMATED,
      tr: {oceans: 1},

      behavior: {
        colonies: {buildColony: {}},
      },

      metadata: {
        cardNumber: 'C15',
        renderData: CardRenderer.builder((b) => b.colonies(1).oceans(1)),
        description: 'Place 1 colony and 1 ocean tile.',
      },
    });
  }

  public override bespokeCanPlay(player: Player): boolean {
    return player.colonies.getPlayableColonies().length > 0;
  }

  public override bespokePlay(player: Player) {
    player.game.defer(new PlaceOceanTile(player, 'Select ocean for Ice Moon Colony'));
    return undefined;
  }
}
