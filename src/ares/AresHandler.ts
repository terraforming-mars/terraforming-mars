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
import { SpaceBonus } from '../SpaceBonus';
import { assert } from "console";

export class AresHandler {

  private game: Game;

  public constructor(game: Game) {
    this.game = game;
  }

  isAresSpaceBonus = (a: SpaceBonus | AresSpaceBonus) : a is AresSpaceBonus => {
    assert(Object.values(AresSpaceBonus).length == 2);
    return a === AresSpaceBonus.ANIMAL || a === AresSpaceBonus.MC;
  }

  // |player| placed a tile next to |adjacentSpace|.
  public handleAdjacentPlacement (adjacentSpace: ISpace, player: Player) {
    if (adjacentSpace.adjacency?.bonus) {
      if (!adjacentSpace.player) {
        throw new Error("A tile with an adjacency bonus must have an owner " + adjacentSpace);
      }

      adjacentSpace.adjacency.bonus.forEach(bonus => {
        if (this.isAresSpaceBonus(bonus)) {
          // TODO(kberg): group and sum. Right now cards only have one animal to place, so this isn't
          // a problem.
          if (bonus === AresSpaceBonus.ANIMAL) {
            const availableAnimalCards = player.getResourceCards(ResourceType.ANIMAL);
            if (availableAnimalCards.length === 0) {
            } else if (availableAnimalCards.length === 1) {
              player.addResourceTo(availableAnimalCards[0]);
            } else if (availableAnimalCards.length > 1) {
              this.game.addInterrupt({
                player: player,
                playerInput:
                  new SelectCard(
                    "Select a card to add an animal",
                    "Add animals",
                    availableAnimalCards,
                    (selected: ICard[]) => {
                      player.addResourceTo(selected[0]);
                      LogHelper.logAddResource(this.game, player, selected[0], 1);
                      return undefined;
                    })
              });
            }
          } else {
            player.megaCredits += 1;
          }
        } else {
          this.game.grantSpaceBonus(player, bonus);
        }
        this.game.log(
          LogMessageType.DEFAULT,
          "{1} gains 1 {2} for placing next to {3}",
          new LogMessageData(LogMessageDataType.PLAYER, player.id),
          new LogMessageData(LogMessageDataType.STRING, bonus.toString()),
          new LogMessageData(LogMessageDataType.STRING, adjacentSpace.tile?.tileType.toString() || ""));
        });

        adjacentSpace.player.megaCredits += 1;
        this.game.log(
            LogMessageType.DEFAULT,
            "{1} gains 1 M€ for a tile placed next to {2}",
            new LogMessageData(LogMessageDataType.PLAYER, adjacentSpace.player.id),
            new LogMessageData(LogMessageDataType.STRING, adjacentSpace.tile?.tileType.toString() || ""),);
  
    }
  }

  // TODO(kberg): find the right space for this, vincentneko@ made a good suggestion.
  public adjacentCost(space: ISpace) {
    let extraCost: number = 0;
    this.game.board.getAdjacentSpaces(space).forEach((adjacentSpace) => {
      if (adjacentSpace?.adjacency?.cost) {
        extraCost += adjacentSpace.adjacency.cost || 0;
      }
    });
    if (extraCost > 0) {
      // TODO(kberg): implement.
      throw new Error("Implement making opponent pay " + extraCost + " MC");
    }
  }
}