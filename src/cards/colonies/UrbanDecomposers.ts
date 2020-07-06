import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from '../CardType';
import { Player } from "../../Player";
import { CardName } from '../../CardName';
import { Resources } from "../../Resources";
import { Game } from '../../Game';
import { ResourceType } from '../../ResourceType';
import { LogHelper } from "../../components/LogHelper";

export class UrbanDecomposers implements IProjectCard {
    public cost: number = 6;
    public tags: Array<Tags> = [Tags.MICROBES];
    public name: CardName = CardName.URBAN_DECOMPOSERS;
    public cardType: CardType = CardType.AUTOMATED;

    public canPlay(player: Player, game: Game): boolean {
        let coloniesCount: number = 0;
        game.colonies.forEach(colony => { 
          coloniesCount += colony.colonies.filter(owner => owner === player.id).length;
        });
        return coloniesCount > 0 && player.getCitiesCount(game) > 0;
    }

    public play(player: Player, game: Game) {
        player.setProduction(Resources.PLANTS, 1);

        const microbeCards = player.getResourceCards(ResourceType.MICROBE);

        if (microbeCards.length === 1) {
            player.addResourceTo(microbeCards[0], 2);
            LogHelper.logAddResource(game, player, microbeCards[0], 2);
        } else if (microbeCards.length > 1) {
            game.addResourceInterrupt(player, ResourceType.MICROBE, 2, undefined);
        }

        return undefined;
    }
}
