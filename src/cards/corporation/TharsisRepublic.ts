import {CorporationCard} from './CorporationCard';
import {Tags} from '../Tags';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {SelectSpace} from '../../inputs/SelectSpace';
import {SpaceType} from '../../SpaceType';
import {ISpace} from '../../ISpace';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {Board} from '../../Board';
import {CardType} from '../CardType';


export class TharsisRepublic implements CorporationCard {
    public name = CardName.THARSIS_REPUBLIC;
    public tags = [Tags.STEEL];
    public startingMegaCredits: number = 40;
    public cardType = CardType.CORPORATION;

    public initialActionText: string = 'Place a city tile';
    public initialAction(player: Player, game: Game) {
      return new SelectSpace('Select space on mars for city tile', game.board.getAvailableSpacesForCity(player), (space: ISpace) => {
        game.addCityTile(player, space.id);
        game.log('${0} placed a City tile', (b) => b.player(player));
        return undefined;
      });
    }
    public onTilePlaced(player: Player, space: ISpace) {
      if (Board.isCitySpace(space)) {
        if (space.player === player) {
          player.megaCredits += 3;
        }
        if (space.spaceType !== SpaceType.COLONY) {
          if (player.shouldTriggerCardEffect) player.addProduction(Resources.MEGACREDITS);
          player.shouldTriggerCardEffect = true; // reset value
        }
      }
    }
    public play(player: Player, game: Game) {
      if (game.getPlayers().length === 1) {
        // Get bonus for 2 neutral cities
        player.addProduction(Resources.MEGACREDITS, 2);
      }
      return undefined;
    }
}
