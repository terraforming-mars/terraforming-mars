import {expect} from "chai";
import {Research} from "../../../src/server/cards/base/Research";
import {SpecialDesign} from "../../../src/server/cards/base/SpecialDesign";
import {TransNeptuneProbe} from "../../../src/server/cards/base/TransNeptuneProbe";
import {LunaGovernor} from "../../../src/server/cards/colonies/LunaGovernor";
import {Faraday} from "../../../src/server/cards/leaders/Faraday";
import {Game} from "../../../src/server/Game";
import {OrOptions} from "../../../src/server/inputs/OrOptions";
import {TestPlayer} from '../../TestPlayer';
import {Tag} from '../../../src/common/cards/Tag';
import { OlympusConference } from "@/server/cards/base/OlympusConference";


describe('Faraday', function() {
  let card: Faraday;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: Game;

  beforeEach(() => {
    card = new Faraday();
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();

    player.megaCredits = 10;
    game = Game.newInstance('gameid', [player, player2], player);

    player.playedCards.push(card);
  });

  it('Can draw a card when reaching a multiple of 5 for a tag', function() {
    player.playedCards.push(new Research());
    player.playedCards.push(new Research());
    // 4 tags: Not sufficient
    expect(player.cardsInHand).has.length(0);

    // 5 tags: Draw a card with a Science tag
    player.playCard(new TransNeptuneProbe());
    
    const orOptions = game.deferredActions.pop()!.execute() as OrOptions;
    orOptions.options[0].cb();
    game.deferredActions.runAll(() => {});

    expect(player.cardsInHand).has.length(1);
    expect(player.cardsInHand[0].tags.includes(Tag.SCIENCE)).is.true;
    expect(player.megaCredits).to.eq(8);
  });

  it('Can choose to do nothing when reaching a multiple of 5 for a tag', function() {
    player.playedCards.push(new Research());
    player.playedCards.push(new Research());
    player.playCard(new TransNeptuneProbe());
    
    const orOptions = game.deferredActions.pop()!.execute() as OrOptions;
    orOptions.options[1].cb();
    game.deferredActions.runAll(() => {});

    expect(player.cardsInHand).has.length(0);
    expect(player.megaCredits).to.eq(10);
  });

  it('Auto resolves if player cannot afford to pay for card', function() {
    player.megaCredits = 1;
    player.playedCards.push(new Research());
    player.playedCards.push(new Research());
    player.playCard(new TransNeptuneProbe());

    expect(game.deferredActions).has.length(0);
    expect(player.cardsInHand).has.length(0);
    expect(player.megaCredits).to.eq(1);
  });

  it('Play a card with two of the same tag', function() {
    player.playedCards.push(new LunaGovernor());
    player.playedCards.push(new LunaGovernor());
    // 4 tags: Not sufficient
    expect(player.cardsInHand).has.length(0);

    // 6 tags: Draw a card with a Earth tag
    player.playCard(new LunaGovernor());
    
    const orOptions = game.deferredActions.pop()!.execute() as OrOptions;
    orOptions.options[0].cb();
    game.deferredActions.runAll(() => {});

    expect(player.cardsInHand).has.length(1);
    expect(player.cardsInHand[0].tags.includes(Tag.EARTH)).is.true;
    expect(player.megaCredits).to.eq(8);
  });

  // TODO! Write this check
  // it('Play a card that puts two tags at 5 count', function() {
  //   player.playedCards.push(new LunaGovernor());
  //   player.playedCards.push(new LunaGovernor());
  //   player.playedCards.push(new Research());
  //   player.playedCards.push(new Research());
  //   // 4 Earth, 4 Science
  //   expect(player.cardsInHand).has.length(0);

  //   // 6 tags: Draw a card with a Earth tag
  //   player.playCard(new OlympusConference());
    
  //   const orOptions = game.deferredActions.pop()!.execute() as OrOptions;
  //   orOptions.options[0].cb();
  //   game.deferredActions.runAll(() => {});
    

  //   expect(player.cardsInHand).has.length(1);
  //   expect(player.cardsInHand[0].tags.includes(Tag.EARTH)).is.true;
  //   expect(player.megaCredits).to.eq(8);
  // });


  it('Does not trigger on event cards', function() {
    player.playedCards.push(new Research(), new Research());
    player.playCard(new SpecialDesign());
    expect(game.deferredActions).has.length(0);
    expect(player.cardsInHand).has.length(0);
  });
});
