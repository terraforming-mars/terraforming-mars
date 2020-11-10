import {Player} from '../../Player';
import {Game} from '../../Game';
import {CorporationCard} from '../corporation/CorporationCard';
import {SelectSpace} from '../../inputs/SelectSpace';
import {ISpace} from '../../ISpace';
import {IActionCard} from '../ICard';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';


export class ArcadianCommunities implements IActionCard, CorporationCard {
    public name = CardName.ARCADIAN_COMMUNITIES;
    public tags = [];
    public startingMegaCredits: number = 40;
    public cardType = CardType.CORPORATION;

    public initialActionText: string = 'Place a community (player marker) on a non-reserved area';
    public initialAction(player: Player, game: Game) {
      return new SelectSpace(
          'Select space for claim',
          game.board.getAvailableSpacesOnLand(player),
          (foundSpace: ISpace) => {
            foundSpace.player = player;

            game.log('${0} placed a Community (player marker)', (b) => b.player(player));

            return undefined;
          },
      );
    }

    public canAct(player: Player, game: Game): boolean {
      return game.board.getAvailableSpacesForMarker(player).length > 0;
    }

    public action(player: Player, game: Game) {
      return new SelectSpace(
          'Select space for claim',
          game.board.getAvailableSpacesForMarker(player),
          (foundSpace: ISpace) => {
            foundSpace.player = player;
            return undefined;
          },
      );
    }

    public play(player: Player) {
      player.steel = 10;
      return undefined;
    }
}
