import {ICard} from './ICard';
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { OrOptions } from "../inputs/OrOptions";
import { SelectOption } from "../inputs/SelectOption";
import { SelectCard } from "../inputs/SelectCard";
import { PlayerInput } from "../PlayerInput";
import { ResourceType } from '../ResourceType';
import { CardName } from '../CardName';
import { LogHelper } from '../components/LogHelper';
import { Resources } from '../Resources';
import { MAX_OCEAN_TILES, REDS_RULING_POLICY_COST } from '../constants';
import { PartyHooks } from '../turmoil/parties/PartyHooks';
import { PartyName } from '../turmoil/parties/PartyName';

export class ImportedHydrogen implements IProjectCard {
    public cost: number = 16;
    public tags: Array<Tags> = [Tags.EARTH, Tags.SPACE];
    public name: CardName = CardName.IMPORTED_HYDROGEN;
    public cardType: CardType = CardType.EVENT;
    public hasRequirements = false;

    public canPlay(player: Player, game: Game): boolean {
        const oceansMaxed = game.board.getOceansOnBoard() === MAX_OCEAN_TILES;
    
        if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS) && !oceansMaxed) {
          return player.canAfford(this.cost + REDS_RULING_POLICY_COST, game, false, true);
        }
    
        return true;
    }

    public play(player: Player, game: Game): undefined | PlayerInput {
        const availableMicrobeCards = player.getResourceCards(ResourceType.MICROBE);
        const availableAnimalCards = player.getResourceCards(ResourceType.ANIMAL);

        const gainPlants = function () {
            const qty = 3;
            player.plants += qty;
            LogHelper.logGainStandardResource(game, player, Resources.PLANTS, qty);
            game.addOceanInterrupt(player);
            return undefined;
        };
        
        if (availableMicrobeCards.length === 0 && availableAnimalCards.length === 0) {
            return gainPlants();
        }

        let availableActions = new Array<SelectOption | SelectCard<ICard>>();

        const gainPlantsOption = new SelectOption("Gain 3 plants", gainPlants);
        availableActions.push(gainPlantsOption);

        if (availableMicrobeCards.length === 1) {
            const targetMicrobeCard = availableMicrobeCards[0];
            availableActions.push(new SelectOption("Add 3 microbes to " + targetMicrobeCard.name, () => {
                player.addResourceTo(targetMicrobeCard, 3);
                LogHelper.logAddResource(game, player, targetMicrobeCard, 3);
                game.addOceanInterrupt(player);
                return undefined;
            }))
        } else if (availableMicrobeCards.length > 1) {
            availableActions.push(new SelectCard("Add 3 microbes to a card", availableMicrobeCards, (foundCards: Array<ICard>) => {
                player.addResourceTo(foundCards[0], 3);
                LogHelper.logAddResource(game, player, foundCards[0], 3);
                game.addOceanInterrupt(player);
                return undefined;
            }))
        }

        if (availableAnimalCards.length === 1) {
            const targetAnimalCard = availableAnimalCards[0];
            availableActions.push(new SelectOption("Add 2 animals to " + targetAnimalCard.name, () => {
                player.addResourceTo(targetAnimalCard, 2);
                LogHelper.logAddResource(game, player, targetAnimalCard, 2);
                game.addOceanInterrupt(player);
                return undefined;
            }))
        } else if (availableAnimalCards.length > 1) {
            availableActions.push(new SelectCard("Add 2 animals to a card", availableAnimalCards, (foundCards: Array<ICard>) => {
                player.addResourceTo(foundCards[0], 2);
                LogHelper.logAddResource(game, player, foundCards[0], 2);
                game.addOceanInterrupt(player);
                return undefined;
            }))
        }

        return new OrOptions(...availableActions);   
    }
}
