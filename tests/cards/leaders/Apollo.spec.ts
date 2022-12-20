import {expect} from "chai";
import {Game} from "../../../src/server/Game";
import {TestPlayer} from '../../TestPlayer';
import {forceGenerationEnd, setCustomGameOptions} from "../../TestingUtils";

import {Apollo} from "../../../src/server/cards/leaders/Apollo";

import {IMoonData} from "../../../src/server/moon/IMoonData";
import {MoonExpansion} from "../../../src/server/moon/MoonExpansion";

describe('Apollo', function() {
  let card: Apollo;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: Game;
  let moonData: IMoonData;

  beforeEach(() => {
    card = new Apollo();
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();

    const gameOptions = setCustomGameOptions({moonExpansion: true});
    game = Game.newInstance('gameid', [player, player2], player, gameOptions);
    moonData = MoonExpansion.moonData(game);
  });

  it('Can act', function() {
    expect(card.canAct()).is.true;
  });

  it('Takes action: Gains 3 M€ for each Moon tile', function() {
    const spaces = moonData.moon.getAvailableSpacesOnLand(player);
    MoonExpansion.addHabitatTile(player, spaces[0].id);
    MoonExpansion.addMineTile(player2, spaces[1].id);
    MoonExpansion.addRoadTile(player2, spaces[2].id);

    card.action(player);
    expect(player.megaCredits).eq(9);
  });

  it('Can only act once per game', function() {
    card.action(player);
    forceGenerationEnd(game);
    expect(card.isDisabled).is.true;
    expect(card.canAct()).is.false;
  });
});
