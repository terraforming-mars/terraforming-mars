import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from '../CardType';
import { Player } from "../../Player";
import { CardName } from '../../CardName';
import { Game } from '../../Game';
import { Resources } from '../../Resources';

export class PioneerSettlement implements IProjectCard {
    public cost: number = 13;
    public tags: Array<Tags> = [Tags.SPACE];
    public name: CardName = CardName.PIONEER_SETTLEMENT;
    public cardType: CardType = CardType.AUTOMATED;

    public canPlay(player: Player, game: Game): boolean {
        let coloniesCount: number = 0;
        game.colonies.forEach(colony => { 
          coloniesCount += colony.colonies.filter(owner => owner === player.id).length;
        }); 
        return coloniesCount < 2;
    }

    public play(player: Player, game: Game) {
      game.addColonyInterrupt(player, false, "Select colony for Pioneer Settlement");
      player.setProduction(Resources.MEGACREDITS, -2); 
      return undefined;
    }

    public getVictoryPoints() {
        return 2;
    }
}