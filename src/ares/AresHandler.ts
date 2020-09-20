// Game.ts-specific behavior for Ares

import { CardName } from "../CardName";
import { ICard } from "../cards/ICard";
import { LogHelper } from "../components/LogHelper";
import { Game } from "../Game";
import { SelectCard } from "../inputs/SelectCard";
import { ISpace } from "../ISpace";
import { LogMessageData } from "../LogMessageData";
import { LogMessageDataType } from "../LogMessageDataType";
import { LogMessageType } from "../LogMessageType";
import { Player } from "../Player";
import { Resources } from "../Resources";
import { ResourceType } from "../ResourceType";
import { SpaceBonus } from "../SpaceBonus";
import { AresSpaceBonus } from "./AresSpaceBonus";

export class AresHandler {

  public static isAresSpaceBonus(a: SpaceBonus | AresSpaceBonus) : a is AresSpaceBonus {
    switch(a) {
      case AresSpaceBonus.ANIMAL:
      case AresSpaceBonus.MEGACREDITS:
      case AresSpaceBonus.MICROBE:
      case AresSpaceBonus.POWER:
            return true;
    }
    return false;
  }

  // |player| placed a tile next to |adjacentSpace|.
  public handleAdjacentPlacement (game: Game, adjacentSpace: ISpace, player: Player) {
    if (adjacentSpace.adjacency?.bonus) {
      if (!adjacentSpace.player) {
        throw new Error("A tile with an adjacency bonus must have an owner " + adjacentSpace);
      }

      adjacentSpace.adjacency.bonus.forEach(bonus => {
        if (AresHandler.isAresSpaceBonus(bonus)) {
          // TODO(kberg): group and sum. Right now cards only have one animal to place, so this isn't
          // a problem.
          if (bonus === AresSpaceBonus.ANIMAL) {
            const availableAnimalCards = player.getResourceCards(ResourceType.ANIMAL);
            if (availableAnimalCards.length === 0) {
            } else if (availableAnimalCards.length === 1) {
              player.addResourceTo(availableAnimalCards[0]);
            } else if (availableAnimalCards.length > 1) {
              game.addInterrupt({
                player: player,
                playerInput:
                  new SelectCard(
                    "Select a card to add an animal",
                    "Add animals",
                    availableAnimalCards,
                    (selected: ICard[]) => {
                      player.addResourceTo(selected[0]);
                      LogHelper.logAddResource(game, player, selected[0], 1);
                      return undefined;
                    })
              });
            }
          } else {
            player.megaCredits += 1;
          }
        } else {
          game.grantSpaceBonus(player, bonus);
        }
        game.log(
          LogMessageType.DEFAULT,
          "${1} gains 1 ${2} for placing next to ${3}",
          new LogMessageData(LogMessageDataType.PLAYER, player.id),
          new LogMessageData(LogMessageDataType.STRING, bonus.toString()),
          new LogMessageData(LogMessageDataType.STRING, adjacentSpace.tile?.tileType.toString() || ""));
        });

    // TODO(kberg): test.
    if (adjacentSpace.player.playedCards.find(card => card.name === CardName.MARKETING_EXPERTS)) {
      adjacentSpace.player.megaCredits += 1;
      // TODO(kberg): log.
    };
    adjacentSpace.player.megaCredits += 1;
        game.log(
            LogMessageType.DEFAULT,
            "${1} gains 1 M€ for a tile placed next to ${2}",
            new LogMessageData(LogMessageDataType.PLAYER, adjacentSpace.player.id),
            new LogMessageData(LogMessageDataType.STRING, adjacentSpace.tile?.tileType.toString() || ""),);
    }
  }

  // TODO(kberg): find the right space for this, vincentneko@ made a good suggestion.
  public adjacentCost(game: Game, space: ISpace) {
    let extraCost: number = 0;
    game.board.getAdjacentSpaces(space).forEach((adjacentSpace) => {
      if (adjacentSpace?.adjacency?.cost) {
        extraCost += adjacentSpace.adjacency.cost || 0;
      }
    });
    if (extraCost > 0) {
      // TODO(kberg): implement.
      throw new Error("Implement making opponent pay " + extraCost + " MC");
    }
  }

  private static countResources(player: Player, resourceType: ResourceType) : number {
    let count = player.playedCards
        .map(c => resourceType === c.resourceType ? (c.resourceCount || 0) : 0)
        .reduce((prior, current) => prior + current , 0);

    if (resourceType === player.corporationCard?.resourceType) {
      count += player.corporationCard.resourceCount || 0;
    }
    return count;
  }

  // Returns a map of resources and resource types to track, and the current count
  // of each of these |player| has. Used with |rewardForPlacement|.
  //
  // This feature is part of Ecological Survey and Geological Survey.
  //
  public beforeTilePlacement(player: Player): Map<Resources | ResourceType, number> {
    var map: Map<Resources | ResourceType, number> = new Map();
    if (player.playedCards.find(c => c.name === CardName.ECOLOGICAL_SURVEY)) {
      map.set(Resources.PLANTS, player.getResource(Resources.PLANTS));
      map.set(ResourceType.ANIMAL, AresHandler.countResources(player, ResourceType.ANIMAL));
      map.set(ResourceType.MICROBE, AresHandler.countResources(player, ResourceType.MICROBE));
    }
    if (player.playedCards.find(c => c.name === CardName.GEOLOGICAL_SURVEY)) {
      map.set(Resources.STEEL, player.getResource(Resources.STEEL));
      map.set(Resources.TITANIUM, player.getResource(Resources.TITANIUM));
      map.set(Resources.HEAT, player.getResource(Resources.HEAT));
    }
    return map;
  }

  // Used with Ecological Survey and Geological Survey
  public afterTilePlacement(game: Game, player: Player, startingResources?: Map<Resources | ResourceType, number>): void {
    if (!startingResources) {
      return;
    }

    function giveBonus(start: number, current: number | undefined):boolean {
      return (current && current > start) ? true : false;
    }

    // Although this bit of code goes through all six resource types, the expected input map will only contain
    // the three (or six) resources it is tracking.
    [Resources.PLANTS, Resources.STEEL, Resources.TITANIUM, Resources.HEAT].forEach(
      resource => {
      if (giveBonus(player.getResource(resource), startingResources.get(resource))) {
        player.setResource(resource, 1);
      }}
    );
    [ResourceType.MICROBE, ResourceType.ANIMAL].forEach(
      resourceType => {
        if (giveBonus(AresHandler.countResources(player, resourceType), startingResources.get(resourceType))) {
        game.addSelectResourceCardInterrupt(player, 1, resourceType, player.getResourceCards(resourceType));      
      }
    });
  }
}