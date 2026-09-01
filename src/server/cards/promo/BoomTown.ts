import {PreludeCard} from '../prelude/PreludeCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../IPlayer';
import {Space} from '../../boards/Space';
import {SpaceBonus} from '../../../common/boards/SpaceBonus';
import {Size} from '../../../common/cards/render/Size';
import {PlaceCityTile} from '../../deferredActions/PlaceCityTile';

export class BoomTown extends PreludeCard {
  constructor() {
    super({
      name: CardName.BOOM_TOWN,
      tags: [Tag.BUILDING, Tag.CITY],

      behavior: {
        production: {titanium: 2},
        titanumValue: -1,
      },

      metadata: {
        cardNumber: 'X80',
        renderData: CardRenderer.builder((b) => {
          b.titanium(1).equals().minus(Size.SMALL).megacredits(1).br;
          b.plainText('Effect: Your titanium is worth 1 M€ less.').br;
          b.city().asterix().production((pb) => pb.titanium(2));
        }),
        description: 'Place a city tile on an area with a STEEL OR TITANIUM PLACEMENT BONUS. Increase your titanium production 2 steps.',
      },
    });
  }

  private availableSpaces(player: IPlayer): ReadonlyArray<Space> {
    return player.game.board.getAvailableSpacesForType(player, 'city')
      .filter((space) => space.bonus.includes(SpaceBonus.STEEL) || space.bonus.includes(SpaceBonus.TITANIUM));
  }

  public override bespokeCanPlay(player: IPlayer): boolean {
    return this.availableSpaces(player).length > 0;
  }

  public override bespokePlay(player: IPlayer) {
    player.game.defer(new PlaceCityTile(player, {
      spaces: this.availableSpaces(player),
      title: 'Select a space with a steel or titanium bonus for city tile',
    }));
    return undefined;
  }
}
