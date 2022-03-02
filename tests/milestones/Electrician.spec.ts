import {PowerPlant} from "@/cards/base/PowerPlant";
import {SolarPower} from "@/cards/base/SolarPower";
import {SpaceMirrors} from "@/cards/base/SpaceMirrors";
import {ResearchCoordination} from "@/cards/prelude/ResearchCoordination";
import {FieldCappedCity} from "@/cards/promo/FieldCappedCity";
import {Game} from "@/Game";
import {Electrician} from "@/milestones/Electrician";
import {Player} from "@/Player";
import {expect} from "chai";
import {TestPlayers} from "tests/TestPlayers";

describe('Electrician', () => {
  let milestone : Electrician; let player : Player;

  beforeEach(() => {
    milestone = new Electrician();
    player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('test', [player], player);

    player.playedCards.push(new SolarPower(), new PowerPlant(), new SpaceMirrors());
  });

  it('Can claim with 4 Power tags', () => {
    player.playedCards.push(new FieldCappedCity());
    expect(milestone.canClaim(player)).is.true;
  });

  it('Wild tag counts', () => {
    player.playedCards.push(new ResearchCoordination());
    expect(milestone.canClaim(player)).is.true;
  });
});