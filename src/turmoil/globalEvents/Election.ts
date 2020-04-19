import { IGlobalEvent } from './IGlobalEvent';
import { GlobalEventName } from './GlobalEventName';
import { PartyName } from '../parties/PartyName';
import { Game } from '../../Game';
import { Tags } from '../../cards/Tags';
import { Turmoil } from '../Turmoil';
import { Player } from '../../Player';
import { TileType } from '../../TileType';

export class Election implements IGlobalEvent {
    public name = GlobalEventName.ELECTION;
    public description = "Count your influence plus Building tags and City tiles (no limits). The player with most (or 10 in solo) gains 2 TR, the 2nd (or 5 in solo) gains 1 TR (ties are friendly).";
    public revealedDelegate = PartyName.GREENS;
    public currentDelegate = PartyName.MARS;
    public resolve(game: Game, turmoil: Turmoil) {
        interface result {player: Player, score: number};
        let results: Array<result> = [];
        game.getPlayers().forEach(player => {
            let score: number = player.getTagCount(Tags.STEEL, false, false) + turmoil.getPlayerInfluence(player) + game.board.spaces.filter(
                (space) => space.tile !== undefined &&
                         space.tile.tileType === TileType.CITY &&
                         space.player === player
            ).length;
            results.push({player : player, score: score});
        });
        // Solo
        if(results.length === 1 && results[0].score >= 10) {
            results[0].player.increaseTerraformRatingSteps(2, game);
            return;
        } else if (results.length === 1 && results[0].score >= 5) {
            results[0].player.increaseTerraformRating(game);
            return;            
        }

        results = results.sort(
            (p1, p2) => p2.score - p1.score
        );

        // First rank
        if (results[0].score > results[1].score) {
            results[0].player.increaseTerraformRatingSteps(2, game);
            results.shift();
        } else {
            let referenceScore = results[0].score;
            results.forEach(result => {
                if (results[0].score === referenceScore) {
                    result.player.increaseTerraformRatingSteps(2, game);
                }
            });
            return;
        }

        // Second rank
        if (results[0].score > results[1].score) {
            results[0].player.increaseTerraformRating(game);
            return;
        } else {
            let referenceScore = results[0].score;
            results.forEach(result => {
                if (results[0].score === referenceScore) {
                    result.player.increaseTerraformRating(game);
                }
            });
            return;
        }
    }
}    