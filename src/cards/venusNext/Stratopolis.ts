import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { SpaceName } from "../../SpaceName";
import { SpaceType } from "../../SpaceType";
import { Resources } from '../../Resources';
import { IActionCard, ICard, IResourceCard } from '../ICard';
import { ResourceType } from '../../ResourceType';
import { SelectCard } from '../../inputs/SelectCard';
import { CardName } from '../../CardName';
import { LogHelper } from "../../components/LogHelper";

export class Stratopolis implements IActionCard, IProjectCard, IResourceCard {
    public cost: number = 22;
    public tags: Array<Tags> = [Tags.CITY, Tags.VENUS];
    public name: CardName = CardName.STRATOPOLIS;
    public cardType: CardType = CardType.ACTIVE;
    public resourceType: ResourceType = ResourceType.FLOATER;
    public resourceCount: number = 0;
    public canPlay(player: Player): boolean {
        return player.getTagCount(Tags.SCIENCE) >= 2 ;
    }
    public play(player: Player, game: Game) {
        player.setProduction(Resources.MEGACREDITS,2);
        game.addCityTile(player, SpaceName.STRATOPOLIS, SpaceType.COLONY);
        return undefined;
    }
    public getVictoryPoints(): number {
        return Math.floor(this.resourceCount / 3);
    }

    public getResCards(player: Player): ICard[] {
        let resourceCards = player.getResourceCards(ResourceType.FLOATER);
        return resourceCards.filter(card => card.tags.filter((cardTag) => cardTag === Tags.VENUS).length > 0);
    }

    public canAct(): boolean {
        return true;
    } 

    public action(player: Player, game: Game) {
        const cards = this.getResCards(player);

        if (cards.length === 1) {
            player.addResourceTo(cards[0], 2);
            LogHelper.logAddResource(game, player, cards[0], 2);
            return undefined;
        }

        return new SelectCard(
            'Select card to add 2 floaters',
            cards,
            (foundCards: Array<ICard>) => {
              player.addResourceTo(foundCards[0], 2);
              LogHelper.logAddResource(game, player, foundCards[0], 2);
              return undefined;
            }
        );
    }    
}
