import { IProjectCard } from "../IProjectCard";
import { IActionCard, ICard, IResourceCard } from '../ICard';
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { ResourceType } from "../../ResourceType";
import { OrOptions } from "../../inputs/OrOptions";
import { SelectOption } from '../../inputs/SelectOption';
import { Game } from '../../Game';
import { MAX_VENUS_SCALE, REDS_RULING_POLICY_COST } from '../../constants';
import { SelectCard } from '../../inputs/SelectCard';
import { CardName } from '../../CardName';
import { LogHelper } from "../../components/LogHelper";
import { PartyHooks } from "../../turmoil/parties/PartyHooks";
import { PartyName } from "../../turmoil/parties/PartyName";

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
        const venusMicrobeCards = player.getResourceCards(ResourceType.MICROBE).filter(card => card.tags.indexOf(Tags.VENUS) !== -1);
        const canRaiseVenus = this.resourceCount > 1 && game.getVenusScaleLevel() < MAX_VENUS_SCALE;

        // only 1 valid target and cannot remove 2 microbes - add to itself
        if (venusMicrobeCards.length === 1 && !canRaiseVenus) {
            player.addResourceTo(this);
            LogHelper.logAddResource(game, player, this);
            return undefined;
        }

        var opts: Array<SelectOption | SelectCard<ICard>> = [];

        const spendResource = new SelectOption("Remove 2 microbes to raise Venus 1 step", () => {
            player.removeResourceFrom(this, 2);
            game.increaseVenusScaleLevel(player, 1);
            return undefined;
        });

        const addResource = new SelectCard(
            'Select a Venus card to add 1 microbe',
            venusMicrobeCards,
            (foundCards: Array<ICard>) => {
              player.addResourceTo(foundCards[0], 1);
              LogHelper.logAddResource(game, player, foundCards[0]);
              return undefined;
            }
        );

        const addResourceToSelf = new SelectOption("Add a microbe to this card", () => {
            player.addResourceTo(venusMicrobeCards[0], 1);
            LogHelper.logAddResource(game, player, this);
            return undefined;
        });

        const redsAreRuling = PartyHooks.shouldApplyPolicy(game, PartyName.REDS);

        if (canRaiseVenus) {
            if (!redsAreRuling || (redsAreRuling && player.canAfford(REDS_RULING_POLICY_COST))) {
                opts.push(spendResource);
            }
        } else {
            if (venusMicrobeCards.length === 1) return addResourceToSelf;
            return addResource;
        }

        venusMicrobeCards.length === 1 ? opts.push(addResourceToSelf) : opts.push(addResource);

        return new OrOptions(...opts);
    }
}