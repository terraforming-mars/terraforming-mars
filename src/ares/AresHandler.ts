// Game.ts-specific behavior for Ares
import { ICard } from "../cards/ICard";
import { LogHelper } from "../components/LogHelper";
import { Game } from '../Game';
import { SelectCard } from "../inputs/SelectCard";
import { ISpace } from '../ISpace';
import { LogMessageData } from "../LogMessageData";
import { LogMessageDataType } from "../LogMessageDataType";
import { LogMessageType } from "../LogMessageType";
import { Player } from '../Player';
import { ResourceType } from "../ResourceType";
import { AresSpaceBonus } from "./AresSpaceBonus";

export class AresHandler {

  private game: Game;

  public constructor(game: Game) {
    this.game = game;
  }

  // |player| placed a tile next to |adjacentSpace|.
  public handleAdjacentPlacement (adjacentSpace: ISpace, player: Player) {
    if (adjacentSpace.adjacency?.bonus) {
      var bonus = adjacentSpace.adjacency.bonus;
      var grantedUnits = bonus?.units;
      if (!adjacentSpace.player) {
        throw new Error("A tile with an adjacency bonus must have an owner " + adjacentSpace);
      }
      adjacentSpace.player.megaCredits += 1;

      var typeToLog: string = "";
      if (bonus.spaceBonus) {
        typeToLog = bonus.spaceBonus.toString();
        for (var idx = 0; idx < bonus.units ; idx++) {
          this.game.grantSpaceBonus(player, bonus.spaceBonus);
        }
      } else if (bonus.aresSpaceBonus) {
        var type: AresSpaceBonus = bonus.aresSpaceBonus;
        typeToLog = type.toString();
        if (type === AresSpaceBonus.ANIMAL) {
          const availableAnimalCards = player.getResourceCards(ResourceType.ANIMAL);
          if (availableAnimalCards.length === 0) {
            grantedUnits = 0;
          } else if (availableAnimalCards.length === 1) {
            player.addResourceTo(availableAnimalCards[0], bonus!.units);
          } else if (availableAnimalCards.length > 1) {
            this.game.addInterrupt({
              player: player,
              playerInput:
                new SelectCard(
                  "Select a card to add " + grantedUnits + " animals",
                  "Add animals",
                  availableAnimalCards,
                  (selected: ICard[]) => {
                    player.addResourceTo(selected[0], bonus!.units);
                    LogHelper.logAddResource(this.game, player, selected[0], bonus!.units);
                    return undefined;
                  })
            });
          }
        } else {
          player.megaCredits += bonus.units;
        }
      }
      this.game.log(
        LogMessageType.DEFAULT,
        "{1} gains {2} {3} and {4} gains 1 M€ for placing next to {5}",
        new LogMessageData(LogMessageDataType.PLAYER, player.id),
        new LogMessageData(LogMessageDataType.STRING, grantedUnits.toString()),
        new LogMessageData(LogMessageDataType.STRING, typeToLog),
        new LogMessageData(LogMessageDataType.PLAYER, player.id),
        new LogMessageData(LogMessageDataType.STRING, adjacentSpace.tile?.tileType.toString() || ""),);
    }
  }

  // TODO(kberg): find the right space for this, vincentneko@ made a good suggestion.
  public adjacentCost(space: ISpace) {
    let extraCost: number = 0;
    this.game.board.getAdjacentSpaces(space).forEach((adjacentSpace) => {
      if (adjacentSpace.adjacency) {
        extraCost += adjacentSpace.adjacency.cost || 0;
      }
    });
    if (extraCost > 0) {
      // TODO(kberg): implement.
      throw new Error("Implement making opponent pay " + extraCost + " MC");
    }
  }
}