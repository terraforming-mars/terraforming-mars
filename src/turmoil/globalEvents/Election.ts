import { IGlobalEvent } from './IGlobalEvent';
import { GlobalEventName } from './GlobalEventName';
import { PartyName } from '../parties/PartyName';
import { Game } from '../../Game';
import { Tags } from '../../cards/Tags';
import { Turmoil } from '../Turmoil';
import { Player } from '../../Player';
import { Board } from '../../Board';

export class Election implements IGlobalEvent {
    public name = GlobalEventName.ELECTION;
    public description = "Count your influence plus Building tags and City tiles (no limits). The player with most (or 10 in solo) gains 2 TR, the 2nd (or 5 in solo) gains 1 TR (ties are friendly).";
    public revealedDelegate = PartyName.GREENS;
    public currentDelegate = PartyName.MARS;
    public resolve(game: Game, turmoil: Turmoil) {
        // Solo
        if(game.isSoloMode()) {
            if(this.getScore(game.getPlayers()[0], turmoil, game) >= 10) {
                game.getPlayers()[0].increaseTerraformRatingSteps(2, game);
            }
            else if (this.getScore(game.getPlayers()[0], turmoil, game) >= 1) {
                game.getPlayers()[0].increaseTerraformRatingSteps(1, game);
            }
        }
        else {
            const players = [...game.getPlayers()].sort(
                (p1, p2) => this.getScore(p2, turmoil, game) - this.getScore(p1, turmoil, game)
            );

            // We have one rank 1 player
            if (this.getScore(players[0], turmoil, game) > this.getScore(players[1], turmoil, game)) {
                players[0].increaseTerraformRatingSteps(2, game);
                players.shift();

                if (players.length === 1) {
                    players[0].increaseTerraformRatingSteps(1, game);   
                }
                else if (players.length > 1) {
                    // We have one rank 2 player
                    if (this.getScore(players[0], turmoil, game) > this.getScore(players[1], turmoil, game)) {
                        players[0].increaseTerraformRatingSteps(1, game);
                    // We have at least two rank 2 players
                    } 
                    else {
                        const score = this.getScore(players[0], turmoil, game);
                        while (players.length > 0 && this.getScore(players[0], turmoil, game) === score) {
                            players[0].increaseTerraformRatingSteps(1, game);
                            players.shift();
                        }
                    }
                }
            // We have at least two rank 1 players
            } else {
                const score = this.getScore(players[0], turmoil, game);
                while (players.length > 0 && this.getScore(players[0], turmoil, game) === score) {
                    players[0].increaseTerraformRatingSteps(2, game);
                    players.shift();
                }
            }
        }
    }

    public getScore(player: Player, turmoil: Turmoil, game: Game) {
        let score = player.getTagCount(Tags.STEEL, false, false) + turmoil.getPlayerInfluence(player);

        const cities = game.board.spaces.filter(
            (space) => Board.isCitySpace(space) && space.player === player
        ).length;

        return score + cities;
    }
}    