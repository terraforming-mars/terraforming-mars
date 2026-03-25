import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {IPlayer} from '../../IPlayer';
import {PlaceCityTile} from '../../deferredActions/PlaceCityTile';
import {Tag} from '../../../common/cards/Tag';

export class CaveCity extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.CAVE_CITY,
      type: CardType.AUTOMATED,
      cost: 16,
      tags: [Tag.BUILDING, Tag.CITY],

      behavior: {production: {steel: 1}},

      metadata: {
        cardNumber: 'U027',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.steel(1)).br;
          b.city().super((b) => b.excavate(1)).asterix();
        }),
        description: 'Increase your steel production 1 step. ' +
        'Place a city in a NON-RESERVED SPACE WITH YOUR EXCAVATION MARKER, ' +
        'ignoring other placement restrictions',
      },
    });
  }

  private availableSpaces(player: IPlayer) {
    return player.game.board
      .getAvailableSpacesOnLand(player)
      .filter((space) => space.excavator === player);
  }

  public override bespokeCanPlay(player: IPlayer) {
    return this.availableSpaces(player).length > 0;
  }

  public override bespokePlay(player: IPlayer) {
    player.game.defer(new PlaceCityTile(player, {spaces: this.availableSpaces(player)}));
    return undefined;
  }
}
