import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from '../CardType';
import { Player } from "../../Player";
import { CardName } from '../../CardName';
import { Resources } from "../../Resources";
import { Game } from '../../Game';
import { ResourceType } from '../../ResourceType';

export class EcologyResearch implements IProjectCard {
    public cost: number = 21;
    public tags: Array<Tags> = [Tags.SCIENCE, Tags.PLANT, Tags.ANIMAL, Tags.MICROBES];
    public name: string = CardName.ECOLOGY_RESEARCH;
    public cardType: CardType = CardType.AUTOMATED;

    public play(player: Player, game: Game) {
        let coloniesCount: number = 0;
        game.colonies.forEach(colony => { 
          coloniesCount += colony.colonies.filter(owner => owner === player).length;
        });  
        player.setProduction(Resources.PLANTS, coloniesCount);
        game.addResourceInterrupt(player, ResourceType.ANIMAL, 1);
        game.addResourceInterrupt(player, ResourceType.MICROBE, 2);
        return undefined;
    }

    public getVictoryPoints() {
        return 1;
    }
}
