
import { IActionCard } from "./ICard";
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { ResourceType } from "../ResourceType";
import { SelectCard } from "../inputs/SelectCard";
import { SelectSpace } from "../inputs/SelectSpace";
import { SelectHowToPay } from "../inputs/SelectHowToPay";
import { ISpace } from "../ISpace";
import { TileType } from "../TileType";
import { AndOptions } from "../inputs/AndOptions";
import { HowToPay } from "../inputs/HowToPay";

export class AICentral implements IActionCard, IProjectCard {
    public cost: number = 21;
    public tags: Array<Tags> = [Tags.SCIENCE, Tags.STEEL];
    public cardType: CardType = CardType.ACTIVE;
    public name: string = "AI Central";
    public actionText: string = "Draw 2 cards";
    public text: string = "Requires 3 science tags to play. Decrease your energy production 1 step. Gain 1 victory point.";
    public description: string = "\"42\"";
    public canPlay(player: Player): boolean {
        return player.getTagCount(Tags.SCIENCE) >= 3 && player.energyProduction >= 1;
    }
    public play(player: Player, _game: Game) {
        player.energyProduction--;
        player.victoryPoints++;
        return undefined;
    }
    public canAct(): boolean {
        return true;
    }
    public action(player: Player, game: Game) {
        player.cardsInHand.push(
            game.dealer.dealCard(),
            game.dealer.dealCard()
        );
        return undefined;
    }
}

export class AcquiredCompany implements IProjectCard {
    public cost: number = 10;
    public tags: Array<Tags> = [Tags.EARTH];
    public name: string = "Acquired Company";
    public cardType: CardType = CardType.AUTOMATED;
    public text: string = "Increase your mega credit production 3 steps";
    public description: string = "This interplanetary company will surely pay off";
    public canPlay(): boolean {
        return true;
    }
    public play(player: Player, _game: Game) {
        player.megaCreditProduction += 3;
        return undefined;
    }
}

export class AdaptationTechnology implements IProjectCard {
    public cost: number = 12;
    public tags: Array<Tags> = [Tags.SCIENCE];
    public name: string = "Adaptation Technology";
    public cardType: CardType = CardType.ACTIVE;
    public text: string = "Your global requirements are +2 or -2 steps, your choice in each case";
    public description: string = "Pushing the limits of the possible";
    public canPlay(): boolean {
        return true;
    }
    public getRequirementBonus(): boolean {
        return true;
    }
    public play(player: Player, _game: Game) {
        player.victoryPoints++;
        return undefined;
    }
}

export class AdaptedLichen implements IProjectCard {
    public cost: number = 9;
    public tags: Array<Tags> = [Tags.PLANT];
    public cardType: CardType = CardType.AUTOMATED;
    public name: string = "Adapted Lichen";
    public text: string = "Increase your plant production 1 step";
    public description: string = "Suitable even for early terraforming";
    public canPlay(): boolean {
        return true;
    }
    public play(player: Player, _game: Game) {
        player.plantProduction++;
        return undefined;
    }
}

export class AdvancedAlloys implements IProjectCard {
    public cost: number = 9;
    public tags: Array<Tags> = [Tags.SCIENCE];
    public name: string = "Advanced Alloys";
    public cardType: CardType = CardType.ACTIVE;
    public text: string = "Each titanium you have is worth 1 mega credit extra. Each steel you have is worth 1 mega credit extra.";
    public description: string = "The latest advances in metallargy give you an edge in the competition.";
    public canPlay(): boolean {
        return true;
    }
    public play(player: Player, _game: Game) {
        player.titaniumValue++;
        player.steelValue++;
        return undefined;
    }
}

export class AdvancedEcosystems implements IProjectCard {
    public cost: number = 11;
    public tags: Array<Tags> = [Tags.PLANT, Tags.MICROBES, Tags.ANIMAL];
    public cardType: CardType = CardType.AUTOMATED;
    public name: string = "Advanced Ecosystems";
    public text: string = "Requires a plant tag, a microbe tag, and an animal tag. Gain 3 victory points.";
    public description: string = "Constructing functional, dynamic ecosystems requires many ingredients";
    public canPlay(): boolean {
        return true;
    }
    public play(player: Player, _game: Game) {
        if (player.getTagCount(Tags.PLANT) === 0 ||
            player.getTagCount(Tags.MICROBES) === 0 ||
            player.getTagCount(Tags.ANIMAL) === 0) {
            throw "Requires a plant tag, a microbe tag, and an animal tag";
        }
        player.victoryPoints += 3;
        return undefined;
    }
}

export class AerobrakedAmmoniaAsteroid implements IProjectCard {
    public cost: number = 26;
    public tags: Array<Tags> = [Tags.SCIENCE];
    public name: string = "Aerobraked Ammonia Asteroid";
    public cardType: CardType = CardType.EVENT;
    public text: string = "Add 2 microbes to ANOTHER card. Increase your heat production 3 steps and your plant production 1 step.";
    public description: string = "Ammonia is a greenhouse gas, as well as being a convenient nitrogen source for organisms.";
    public canPlay(): boolean {
        return true;
    }
    public play(player: Player, game: Game) {
        const cardsToPick = game.getOtherMicrobeCards(this);
        player.heatProduction += 3;
        player.plantProduction++;
        return new SelectCard("Select card to add 2 microbes", cardsToPick, (foundCards: Array<IProjectCard>) => {
            player.addResourceTo(foundCards[0], 2);
            return undefined;
        });
    }
}

export class AntiGravityTechnology implements IProjectCard {
    public cost: number = 14;
    public tags: Array<Tags> = [Tags.SCIENCE];
    public name: string = "Anti-Gravity Technology";
    public cardType: CardType = CardType.ACTIVE;
    public text: string = "Requires 7 science tags, when you play a card, you pay 2 mega credit less for it.";
    public description: string = "Finally successful, anti-gravity will revolutionize everything, from households to industry and space travel.";
    public canPlay(player: Player): boolean {
        return player.getTagCount(Tags.SCIENCE) >= 7;
    }
    public getCardDiscount() {
        return 2;
    }
    public play(player: Player) {
        player.victoryPoints += 3;
        return undefined;
    }
}

export class Algae implements IProjectCard {
    public cost: number = 10;
    public tags: Array<Tags> = [Tags.PLANT];
    public name: string = "Algae";
    public cardType: CardType = CardType.AUTOMATED;
    public text: string = "Requires 5 ocean tiles. Gain 1 plant and increase your plant production 2 steps.";
    public description: string = "Basic photosynthesizers in aqueous environments";
    public canPlay(player: Player, game: Game): boolean {
        return game.getOceansOnBoard() >= 5 - player.getRequirementsBonus(game);
    }
    public play(player: Player) {
        player.plants++;
        player.plantProduction += 2;
        return undefined;
    }
}

export class Ants implements IActionCard, IProjectCard {
    public cost: number = 9;
    public tags: Array<Tags> = [Tags.MICROBES];
    public name: string = "Ants";
    public resourceType: ResourceType = ResourceType.MICROBE;
    public cardType: CardType = CardType.ACTIVE;
    public actionText: string = "Remove 1 microbe from any card to add 1 to this card.";
    public text: string = "Requires 4% oxygen. Gain 1 victory point per 2 microbes on this card.";
    public description: string = "Although an important part of many ecosystems, ants can also be detrimental to other organisms.";
    public canPlay(player: Player, game: Game): boolean {
        return game.getOxygenLevel() >= 4 - player.getRequirementsBonus(game);
    }
    public onGameEnd(player: Player) {
        player.victoryPoints += Math.floor(player.getResourcesOnCard(this) / 2);
    }
    public play() {
        return undefined;
    }
    public canAct(_player: Player, game: Game): boolean {
        return this.getAvailableCards(game).length > 0;
    }
    private getAvailableCards(game: Game): Array<IProjectCard> {
        const availableCards: Array<IProjectCard> = [];
        game.getPlayers().forEach((gamePlayer) => {
            gamePlayer.playedCards.forEach((playedCard) => {
                if (gamePlayer.getResourcesOnCard(playedCard) > 0) {
                    availableCards.push(playedCard);
                }
            });
        });
        return availableCards;
    }
    public action(player: Player, game: Game) {
        const availableCards: Array<IProjectCard> = this.getAvailableCards(game);
        return new SelectCard("Select card to remove microbe", availableCards, (foundCards: Array<IProjectCard>) => {
            game.getCardPlayer(foundCards[0].name).removeMicrobes(player, foundCards[0], 1);
            player.addResourceTo(this);
            return undefined;
        });
    }
}

export class AquiferPumping implements IActionCard, IProjectCard {
    public cost: number = 18;
    public tags: Array<Tags> = [Tags.STEEL];
    public name: string = "Aquifer Pumping";
    public cardType: CardType = CardType.ACTIVE;
    public text: string = "";
    public description: string = "Underground water reservoirs may be tapped in a controlled manner, to safely build up oceans to the desired level";
    public canPlay(): boolean {
        return true;
    }
    public play(_player: Player, _game: Game) {
        return undefined;
    }
    public actionText: string = "Spend 8 mega credits to place 1 ocean tile. STEEL MAY BE USED as if you were playing a building card.";
    public canAct(player: Player): boolean {
        return (player.steelValue * player.steel) + player.megaCredits + (player.canUseHeatAsMegaCredits ? player.heat : 0) >= 8;
    }
    public action(player: Player, game: Game) {
            let howToPay: HowToPay;
            let foundSpace: ISpace;
            return new AndOptions(
                    () => {
                        if ((howToPay.steel * player.steelValue) + howToPay.megaCredits + howToPay.heat < 8) {
                            throw "Need to pay 8";
                        }
                        player.steel -= howToPay.steel;
                        player.heat -= howToPay.heat;
                        player.megaCredits -= howToPay.megaCredits;
                        game.addOceanTile(player, foundSpace.id);
                        return undefined;
                    },
                    new SelectSpace("Select space for ocean tile", game.getAvailableSpacesForOcean(player), (space: ISpace) => {
                        foundSpace = space;
                        return undefined;
                    }),
                    new SelectHowToPay("Select how to pay for action", true, false, player.canUseHeatAsMegaCredits, (htp: HowToPay) => {
                        howToPay = htp;
                        return undefined;
                    })
                );
    }
}

export class ArchaeBacteria implements IProjectCard {
    public cost: number = 6;
    public tags: Array<Tags> = [Tags.MICROBES];
    public name: string = "ArchaeBacteria";
    public cardType: CardType = CardType.AUTOMATED;
    public text: string = "It must be -18C or colder. Increase your plant production 1 step.";
    public description: string = "Photosynthesizing bacteria specializing in extreme environments.";
    public canPlay(player: Player, game: Game): boolean {
        return game.getTemperature() <= -18 + (player.getRequirementsBonus(game) * 2);
    }
    public play(player: Player) {
        player.plantProduction++;
        return undefined;
    }
}

export class ArcticAlgae implements IProjectCard {
    public cost: number = 12;
    public tags: Array<Tags> = [Tags.PLANT];
    public name: string = "Arctic Algae";
    public cardType: CardType = CardType.ACTIVE;
    public text: string = "It must be -12C or colder to play. Gain 1 plant. When anyone places an ocean tile, gain 2 plants.";
    public description: string = "Suitable for freezing temperatures.";
    public canPlay(player: Player, game: Game): boolean {
        return game.getTemperature() <= -12 + (player.getRequirementsBonus(game) * 2);
    }
    public onTilePlaced(player: Player, space: ISpace) {
        if (space.tile !== undefined && space.tile.tileType === TileType.OCEAN) {
            player.plants += 2;
        }
    }
    public play(player: Player) {
        player.plants++;
        return undefined;
    }
}
