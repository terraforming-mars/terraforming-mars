import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { SelectPlayer } from '../../inputs/SelectPlayer';
import { Game } from '../../Game';
import { Resources } from '../../Resources';
import { CardName } from '../../CardName';

export class CometForVenus implements IProjectCard {
    public cost: number = 11;
    public tags: Array<Tags> = [Tags.SPACE];
    public name: CardName = CardName.COMET_FOR_VENUS;
    public cardType: CardType = CardType.EVENT;

    public play(player: Player, game: Game) {
        const venusTagPlayers = game.getPlayers().filter((otherPlayer) => otherPlayer.id !== player.id && otherPlayer.getTagCount(Tags.VENUS) > 0);

        if (game.soloMode|| venusTagPlayers.length === 0) {
            game.increaseVenusScaleLevel(player,1);
            return undefined;
        }

        if (venusTagPlayers.length === 1) {
            venusTagPlayers[0].setResource(Resources.MEGACREDITS, -4, game, player);
            game.increaseVenusScaleLevel(player,1);
            return undefined;
        }
        
        return new SelectPlayer(
            venusTagPlayers,
            'Select player to remove up to 4 mega credits from',
            (selectedPlayer: Player) => {
              selectedPlayer.setResource(Resources.MEGACREDITS, -4, game, player);
              game.increaseVenusScaleLevel(player,1);
              return undefined;
            }
        );
    }
}