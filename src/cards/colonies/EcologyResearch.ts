import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from '../CardType';
import { Player } from "../../Player";
import { CardName } from '../../CardName';
import { Resources } from "../../Resources";
import { Game } from '../../Game';
import { ResourceType } from '../../ResourceType';
import { LogHelper } from "../../components/LogHelper";

export class EcologyResearch implements IProjectCard {
    public cost: number = 21;
    public tags: Array<Tags> = [Tags.SCIENCE, Tags.PLANT, Tags.ANIMAL, Tags.MICROBES];
    public name: CardName = CardName.ECOLOGY_RESEARCH;
    public cardType: CardType = CardType.AUTOMATED;

    public play(player: Player, game: Game) {
        let coloniesCount: number = 0;
        game.colonies.forEach(colony => { 
          coloniesCount += colony.colonies.filter(owner => owner === player.id).length;
        });  
        player.setProduction(Resources.PLANTS, coloniesCount);

        const animalCards = player.getResourceCards(ResourceType.ANIMAL);

        if (animalCards.length === 1) {
            player.addResourceTo(animalCards[0], 1);
            LogHelper.logAddResource(game, player, animalCards[0]);
        } else if (animalCards.length > 1) {
            game.addResourceInterrupt(player, ResourceType.ANIMAL, 1, undefined);
        }

        const microbeCards = player.getResourceCards(ResourceType.MICROBE);

        if (microbeCards.length === 1) {
            player.addResourceTo(microbeCards[0], 2);
            LogHelper.logAddResource(game, player, microbeCards[0], 2);
        } else if (microbeCards.length > 1) {
            game.addResourceInterrupt(player, ResourceType.MICROBE, 2, undefined);
        }

        return undefined;
    }

    public getVictoryPoints() {
        return 1;
    }
}
