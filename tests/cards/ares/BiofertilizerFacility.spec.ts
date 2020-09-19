import { expect } from "chai";

import { AresSpaceBonus } from "../../../src/ares/AresSpaceBonus";
import { CardName } from "../../../src/CardName";
import { BiofertilizerFacility } from "../../../src/cards/ares/BiofertilizerFacility";
import { CardType } from "../../../src/cards/CardType";
import { IProjectCard } from "../../../src/cards/IProjectCard";
import { Tags } from "../../../src/cards/Tags";
import { Color } from "../../../src/Color";
import { Game } from "../../../src/Game";
import { Player } from "../../../src/Player";
import { Resources } from "../../../src/Resources";
import { ResourceType } from "../../../src/ResourceType";
import { SpaceBonus } from "../../../src/SpaceBonus";
import { TileType } from "../../../src/TileType";

describe("BiofertilizerFacility", function () {
  let card : BiofertilizerFacility, player : Player, game : Game;

  const scienceTagCard: IProjectCard = {
    name: CardName.ACQUIRED_COMPANY,
    cardType: CardType.ACTIVE,
    cost: 0,
    tags: [Tags.SCIENCE],
    play: () => undefined
  };

  const microbeHost: IProjectCard = {
    name: CardName.ACQUIRED_SPACE_AGENCY,
    cardType: CardType.ACTIVE,
    cost: 0,
    tags: [],
    resourceType: ResourceType.MICROBE,
    resourceCount: 0,
    play: () => undefined
  }

  beforeEach(function() {
    card = new BiofertilizerFacility();
    player = new Player("test", Color.BLUE, false);
    game = new Game("foobar", [player, player], player);
  });

  it("Can't play without a science tag", function () {
    expect(card.canPlay(player, game)).to.eq(false);
  });

  it("Play", function () {
    // Adds the necessary Science tag.
    player.playCard(game, scienceTagCard);
    player.playCard(game, microbeHost);
    expect(card.canPlay(player, game)).to.eq(true);

    expect(player.getProduction(Resources.PLANTS)).is.eq(0);
    expect(microbeHost.resourceCount || 0).is.eq(0);

    const action = card.play(player, game);

    expect(player.getProduction(Resources.PLANTS)).is.eq(1);
    // TODO(kberg): uncomment and test this.
    // expect(action).instanceOf(AndOptions);
        
    const citySpace = game.board.getAvailableSpacesForCity(player)[0];
    action.cb(citySpace);
    // TODO(kberg): uncomment and test this.
    // action.options[0].cb(citySpace);
    expect(citySpace.player).to.eq(player);
    expect(citySpace.tile!.tileType).to.eq(TileType.BIOFERTILIZIER_FACILITY);
    expect(citySpace.adjacency).to.deep.eq({bonus: [SpaceBonus.PLANT, AresSpaceBonus.MICROBE]});

    // TODO(kberg): uncomment and test this.
    // action.options[1].cb([microbeHost]);
    // expect(microbeHost.resourceCount).is.eq(2);
  });

});
