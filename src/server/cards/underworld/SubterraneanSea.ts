import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {IPlayer} from '../../IPlayer';
import {Tag} from '../../../common/cards/Tag';
import {PlaceOceanTile} from '../../deferredActions/PlaceOceanTile';

export class SubterraneanSea extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.SUBTERRANEAN_SEA,
      type: CardType.AUTOMATED,
      cost: 10,
      tags: [Tag.BUILDING],

      tr: {oceans: 1},

      metadata: {
        cardNumber: 'U15',
        renderData: CardRenderer.builder((b) => {
          b.oceans(1).excavate().asterix();
        }),
        description: 'Place an ocean tile ON AN AREA NOT RESERVED FOR OCEAN where you have an excavation marker.',
      },
    });
  }

  private availableSpaces(player: IPlayer) {
    const availableSpcesOnLand = player.game.board.getAvailableSpacesOnLand(
      player, {
        cost: player.getCardCost(this),
        tr: {oceans: 1},
      });
    return availableSpcesOnLand.filter((space) => space.excavator === player);
  }

  public override bespokeCanPlay(player: IPlayer) {
    if (!player.game.canAddOcean()) {
      this.warnings.add('maxoceans');
    }
    return this.availableSpaces(player).length > 0;
  }

  public override bespokePlay(player: IPlayer) {
    player.game.defer(new PlaceOceanTile(player, {
      spaces: this.availableSpaces(player),
    }));
    return undefined;
  }
}
