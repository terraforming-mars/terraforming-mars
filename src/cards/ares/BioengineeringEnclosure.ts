import { CardName } from "../../CardName";
import { Game } from "../../Game";
import { LogMessageType } from "../../LogMessageType";
import { Player } from "../../Player";
import { ResourceType } from "../../ResourceType";
import { CardType } from "../CardType";
import { IActionCard, IResourceCard } from "../ICard";
import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { LogMessageData } from "../../LogMessageData";
import { LogMessageDataType } from "../../LogMessageDataType";

export class BioengineeringEnclosure implements IProjectCard, IActionCard, IResourceCard {
  public cost: number = 7;
  public tags: Array<Tags> = [Tags.ANIMAL];
  public cardType: CardType = CardType.ACTIVE;
  public name: CardName = CardName.BIOENGINEERING_ENCLOSURE;
  public resourceType = ResourceType.ANIMAL;
  public resourceCount = 0;

  public canPlay(player: Player, _game: Game): boolean {
    return player.getTagCount(Tags.SCIENCE) >= 1;
  }

  public play(player: Player, _game: Game) {
    player.addResourceTo(this, 2);

    return undefined;
  }

  public canAct(player: Player): boolean {
    // >1 because this player already has bioengineering enclosure.
    return this.resourceCount > 0 &&
      player.getResourceCards(ResourceType.ANIMAL).length > 1;
  }

  public action(player: Player, game: Game) {
    // this code is a little brittle: if the player chooses not to select a
    // card in the SelectResourceCard action,
    // the player has still lost their animal.
    this.resourceCount--;
    game.log(
      LogMessageType.DEFAULT,
      "${0} removed 1 animal from Bioengineering Enclosure.",
      new LogMessageData(LogMessageDataType.PLAYER, player.id));

    // TODO(kberg): select an animal.
    return undefined;
    // return SelectResourceCard.newInstance(
    //   game, player, ResourceType.ANIMAL, player.playedCards, 1);
  }

}
