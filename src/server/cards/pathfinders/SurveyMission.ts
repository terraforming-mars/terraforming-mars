import {IPlayer} from '../../IPlayer';
import {PreludeCard} from '../prelude/PreludeCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import {MarsBoard} from '../../boards/MarsBoard';
import {BoardType} from '../../boards/BoardType';
import {Space} from '../../boards/Space';
import {SelectSpace} from '../../inputs/SelectSpace';
import {LogHelper} from '../../LogHelper';
import {digit} from '../Options';

type Triplet = [Space, Space, Space];
export class SurveyMission extends PreludeCard {
  constructor() {
    super({
      name: CardName.SURVEY_MISSION,
      tags: [Tag.MARS],

      behavior: {
        stock: {steel: 5},
      },

      metadata: {
        cardNumber: 'PfP07',
        renderData: CardRenderer.builder((b) => {
          b.steel(5, {digit});
          b.br;
          b.surveyMission();
        }),
        description: 'Gain 5 steel. Land-claim three non-reserved spaces in a triangle shape. Gain all placement bonuses. ' +
          'Only you may place tiles there, and will gain placement bonuses again.',
      },
    });
  }

  private validTriplets(board: MarsBoard): Array<Triplet> {
    const spaces = board.getNonReservedLandSpaces().filter((space) => {
      return space.player === undefined && (space.tile === undefined || space.tile.protectedHazard === true);
    });

    const result: Array<Triplet> = [];

    function validAdjacentSpace(s1: Space, s2: Space) {
      // Ignore spaces before or above, those were covered earlier.
      // This is not just an optimization but also prevents storing
      // multiple triplets with the same spaces, but in a different order.
      if (s2.id < s1.id) return false;
      return spaces.includes(s2);
    }

    spaces.forEach((space) => {
      const adjacentSpaces = board.getAdjacentSpaces(space).filter((adjacent) => validAdjacentSpace(space, adjacent));
      for (let idx1 = 0; idx1 <= adjacentSpaces.length - 2; idx1++) {
        const n1 = adjacentSpaces[idx1];
        if (n1 === undefined) throw new Error('');
        for (let idx2 = idx1 + 1; idx2 <= adjacentSpaces.length - 1; idx2++) {
          const n2 = adjacentSpaces[idx2];
          if (n2 === undefined) throw new Error('');
          if (board.getAdjacentSpaces(n1).includes(n2)) {
            result.push([space, n1, n2]);
          }
        }
      }
    });

    return result;
  }

  public override bespokeCanPlay(player: IPlayer) {
    return this.validTriplets(player.game.board).length > 0;
  }

  private selectSpace(player: IPlayer, iteration: number, triplets: Array<Triplet>): SelectSpace {
    const messages = [
      'Select first space',
      'Select second space',
      'Select third space',
    ];
    const spaceSet: Set<Space> = new Set(triplets.flat());
    const spaces = Array.from(spaceSet).filter((space) => space.player === undefined);
    spaces.sort((s1, s2) => parseInt(s2.id) - parseInt(s1.id));
    return new SelectSpace(messages[iteration], spaces)
      .andThen((space) => {
        space.player = player;
        player.game.grantSpaceBonuses(player, space);
        LogHelper.logBoardTileAction(player, space, 'claimed');
        player.getCorporation(CardName.MINING_GUILD)?.onTilePlaced?.(player, player, space, BoardType.MARS);

        if (iteration === 2) return undefined;

        const revisedTriplets = triplets.filter((triplet) => {
          return triplet[0].id === space.id ||
          triplet[1].id === space.id ||
          triplet[2].id === space.id;
        });
        if (revisedTriplets.length === 0) return undefined;

        return this.selectSpace(player, iteration + 1, revisedTriplets);
      });
  }

  public override bespokePlay(player: IPlayer) {
    const triplets = this.validTriplets(player.game.board);
    return this.selectSpace(player, 0, triplets);
  }
}

