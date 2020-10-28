import { ICard, IActionCard } from "./ICard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { OrOptions } from "../inputs/OrOptions";
import { SelectOption } from "../inputs/SelectOption";
import { SelectCard } from "../inputs/SelectCard";
import { IProjectCard } from "./IProjectCard";
import { ResourceType } from "../ResourceType";
import { CardName } from "../CardName";
import { LogHelper } from "../components/LogHelper";
import { Resources } from "../Resources";
import { CardSpecial } from "./CardSpecial";
import { CardMetadata } from "./CardMetadata";
import { CardRow } from "./CardRow";
import { CardBonus } from "./CardBonus";
import { CardAction } from "./CauseAndEffect";
import { CardRequirements } from "./CardRequirements";
import { CardRequirement } from "./CardRequirement";

export class ExtremeColdFungus implements IActionCard, IProjectCard {
    public cost = 13;
    public tags = [Tags.MICROBES];
    public cardType = CardType.ACTIVE;
    public name = CardName.EXTREME_COLD_FUNGUS;
    public canPlay(player: Player, game: Game): boolean {
        return game.getTemperature() <= -10 + 2 * player.getRequirementsBonus(game);
    }
    public play() {
        return undefined;
    }
    public canAct(): boolean {
        return true;
    }
    public action(player: Player, game: Game) {
        const otherMicrobeCards = player.getResourceCards(ResourceType.MICROBE);

        if (otherMicrobeCards.length === 0) {
            player.plants++;
            LogHelper.logGainStandardResource(game, player, Resources.PLANTS);
            return undefined;
        }

        const gainPlantOption = new SelectOption("Gain 1 plant", "Gain plant", () => {
            player.plants++;
            LogHelper.logGainStandardResource(game, player, Resources.PLANTS);
            return undefined;
        });

        if (otherMicrobeCards.length === 1) {
            const targetCard = otherMicrobeCards[0];

            return new OrOptions(
                new SelectOption("Add 2 microbes to " + targetCard.name, "Add microbes", () => {
                    player.addResourceTo(targetCard, 2);
                    LogHelper.logAddResource(game, player, targetCard, 2);
                    return undefined;
                }),
                gainPlantOption
            );
        }

        return new OrOptions(
            new SelectCard(
                "Select card to add 2 microbes",
                "Add microbes",
                otherMicrobeCards,
                (foundCards: Array<ICard>) => {
                    player.addResourceTo(foundCards[0], 2);
                    LogHelper.logAddResource(game, player, foundCards[0], 2);
                    return undefined;
                }
            ),
            gainPlantOption
        );
    }
    public metadata: CardMetadata = {
      cardNumber: "134",
      description: "It must be -10 C or colder.",
      requirements: new CardRequirements([
          CardRequirement.temperature(-10).max()
      ]),
      onPlay: [
          CardRow.add([
              CardAction.add(
                  undefined,
                  [CardBonus.plants(1)]
              ),
          ]),
          CardRow.add([
              CardAction.add(
                  [CardSpecial.or().small()],
                  [CardBonus.microbes(2), CardSpecial.asterix()],
                  "Gain 1 plant or add 2 microbes to ANOTHER card."
              ),
          ])
      ],
  };
}
