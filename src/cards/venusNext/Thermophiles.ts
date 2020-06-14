import { IProjectCard } from "../IProjectCard";
import { IActionCard, ICard, IResourceCard } from '../ICard';
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { ResourceType } from "../../ResourceType";
import { OrOptions } from "../../inputs/OrOptions";
import { SelectOption } from '../../inputs/SelectOption';
import { Game } from '../../Game';
import { MAX_VENUS_SCALE } from '../../constants';
import { SelectCard } from '../../inputs/SelectCard';
import { CardName } from '../../CardName';

export class Thermophiles implements IActionCard,IProjectCard, IResourceCard {
    public cost: number = 9;
    public tags: Array<Tags> = [Tags.VENUS, Tags.MICROBES];
    public name: CardName = CardName.THERMOPHILES;
    public cardType: CardType = CardType.ACTIVE;
    public resourceType: ResourceType = ResourceType.MICROBE;
    public resourceCount: number = 0;
    public canPlay(player: Player, game: Game): boolean {
        return game.getVenusScaleLevel() >= 6 - (2 * player.getRequirementsBonus(game, true));
    }
    public play() {
        return undefined;
    }
    public canAct(): boolean {
        return true;
    }   
    public action(player: Player, game: Game) {
        const microbeCards = player.getResourceCards(ResourceType.MICROBE).filter(card => card.tags.indexOf(Tags.VENUS) !== -1);
        var opts: Array<SelectOption | SelectCard<ICard>> = [];
        const addResource = new SelectCard(
            'Select a Venus card to add 1 microbe',
            microbeCards,
            (foundCards: Array<ICard>) => {
              player.addResourceTo(foundCards[0], 1);
              return undefined;
            }
        );

        const spendResource = new SelectOption("Remove 2 microbes to raise Venus 1 step", () => {
            player.removeResourceFrom(this, 2);
            game.increaseVenusScaleLevel(player, 1);
            return undefined;
        });

        if (this.resourceCount > 1 && game.getVenusScaleLevel() < MAX_VENUS_SCALE) {
            opts.push(spendResource);
        } else return addResource;

        opts.push(addResource);

        return new OrOptions(...opts);
    }
}