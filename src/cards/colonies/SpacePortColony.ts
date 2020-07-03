import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from '../CardType';
import { Player } from "../../Player";
import { CardName } from '../../CardName';
import { Game } from '../../Game';

export class SpacePortColony implements IProjectCard {
    public cost: number = 27;
    public tags: Array<Tags> = [Tags.SPACE];
    public name: CardName = CardName.SPACE_PORT_COLONY;
    public cardType: CardType = CardType.AUTOMATED;

    public canPlay(player: Player, game: Game): boolean {
        let coloniesCount: number = 0;
        game.colonies.forEach(colony => { 
          coloniesCount += colony.colonies.filter(owner => owner === player.id).length;
        }); 
        return coloniesCount > 0;
    }

    public play(player: Player, game: Game) {
      game.addColonyInterrupt(player, true, "Select colony for Space Port Colony");
      player.fleetSize++;
      return undefined;
    }

    public getVictoryPoints(_player: Player, game: Game) {
        let coloniesCount: number = 0;
        game.colonies.forEach(colony => { 
          coloniesCount += colony.colonies.length;
        }); 
        return Math.floor(coloniesCount / 2);
    }
}