import {IPlayer} from '../IPlayer';
import {SelectSpace} from '../inputs/SelectSpace';
import {DeferredAction} from './DeferredAction';
import {Priority} from './Priority';
import {PlacementType} from '../boards/PlacementType';
import {Space} from '../boards/Space';
import {CardName} from '../../common/cards/CardName';
import {Message} from '../../common/logs/Message';

type Options = {
  title?: string | Message,
  on?: PlacementType,
  spaces?: Array<Space>,
  /** For Icy Impactors */
  creditedPlayer?: IPlayer,
};

export class PlaceOceanTile extends DeferredAction<Space> {
  constructor(
    player: IPlayer,
    private options: Options = {}) {
    super(player, Priority.PLACE_OCEAN_TILE);
  }

  public execute() {
    if (!this.player.game.canAddOcean()) {
      const whales = this.player.getPlayedCard(CardName.WHALES);
      if (whales !== undefined) {
        this.player.addResourceTo(whales, {qty: 1, log: true});
      }
      return undefined;
    }

    let title = this.options.title ?? this.getTitle('ocean');
    let availableSpaces: ReadonlyArray<Space> = [];
    if (this.options.spaces !== undefined) {
      availableSpaces = this.options.spaces;
    } else {
      const on = this.options?.on || 'ocean';
      availableSpaces = this.player.game.board.getAvailableSpacesForType(this.player, on);
      title = this.options?.title ?? this.getTitle(on);
    }

    return new SelectSpace(title, availableSpaces)
      .andThen((space) => {
        const creditedPlayer = this.options.creditedPlayer ?? this.player;
        creditedPlayer.game.addOcean(creditedPlayer, space);
        creditedPlayer.defer(this.cb(space));
        return undefined;
      });
  }

  private getTitle(type: PlacementType) {
    switch (type) {
    case 'ocean': return 'Select space for ocean tile';
    case 'land': return 'Select a land space to place an ocean tile';
    // case '': return 'Select space reserved for ocean to place greenery tile';
    default: throw new Error('unhandled type; ' + type);
    }
  }
}
