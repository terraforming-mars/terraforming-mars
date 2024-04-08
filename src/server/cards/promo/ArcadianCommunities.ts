import {IPlayer} from '../../IPlayer';
import {CorporationCard} from '../corporation/CorporationCard';
import {SelectSpace} from '../../inputs/SelectSpace';
import {Space} from '../../boards/Space';
import {IActionCard} from '../ICard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';
import {digit} from '../Options';

export class ArcadianCommunities extends CorporationCard implements IActionCard {
  constructor() {
    super({
      name: CardName.ARCADIAN_COMMUNITIES,
      startingMegaCredits: 40,
      initialActionText: 'Place a community (player marker) on a non-reserved area',

      behavior: {
        stock: {steel: 10},
      },

      metadata: {
        cardNumber: 'R44',
        description: 'You start with 40 M€ and 10 steel. AS YOUR FIRST ACTION, PLACE A COMMUNITY [PLAYER MARKER] ON A NON-RESERVED AREA.',
        renderData: CardRenderer.builder((b) => {
          b.br;
          b.megacredits(40).nbsp.steel(10, {digit}).nbsp.community().asterix();
          b.corpBox('action', (ce) => {
            ce.text('ACTION: PLACE A COMMUNITY (PLAYER MARKER) ON A NON-RESERVED AREA ADJACENT TO ONE OF YOUR TILES OR MARKED AREAS.', Size.TINY, true);
            ce.vSpace(Size.MEDIUM);
            ce.text('EFFECT: MARKED AREAS ARE RESERVED FOR YOU. WHEN YOU PLACE A TILE THERE, GAIN 3 M€.', Size.TINY, true);
          });
        }),
      },
    });
  }

  public initialAction(player: IPlayer) {
    return new SelectSpace(
      'Select space for claim',
      player.game.board.getAvailableSpacesOnLand(player))
      .andThen((space: Space) => {
        space.player = player;
        player.game.log('${0} placed a Community (player marker)', (b) => b.player(player));
        return undefined;
      });
  }

  public getAvailableSpacesForMarker(player: IPlayer): Array<Space> {
    const board = player.game.board;
    const candidateSpaces = board.getAvailableSpacesOnLand(player);
    const spaces = candidateSpaces.filter((space) => {
      // Exclude spaces that already have a player marker.
      if (space.player !== undefined) return false;
      const adjacentSpaces = board.getAdjacentSpaces(space);
      return adjacentSpaces.find((adj) => adj.player === player) !== undefined;
    });
      // Remove duplicates
    return spaces.filter((space, index) => spaces.indexOf(space) === index);
  }

  public canAct(player: IPlayer): boolean {
    return this.getAvailableSpacesForMarker(player).length > 0;
  }

  public action(player: IPlayer) {
    return new SelectSpace('Select space for claim', this.getAvailableSpacesForMarker(player))
      .andThen((space) => {
        space.player = player;
        return undefined;
      });
  }
}
