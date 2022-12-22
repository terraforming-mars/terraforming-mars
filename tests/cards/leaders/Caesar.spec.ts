// import {expect} from "chai";
// import {Game} from "../../../src/server/Game";
// import {Player} from "../../../src/server/Player";
// import {TestPlayer} from '../../TestPlayer';
// import {forceGenerationEnd} from "../../TestingUtils";
// import {Caesar} from "../../../src/server/cards/leaders/Caesar";

// import {SelectProductionToLose} from "../../../src/inputs/SelectProductionToLose";
// import {SelectSpace} from "../../../src/inputs/SelectSpace";
// import {Units} from "../../../src/Units";
// import {AresTestHelper, ARES_OPTIONS_NO_HAZARDS, ARES_OPTIONS_WITH_HAZARDS} from "../ares/AresTestHelper";
// import {EmptyBoard} from "../ares/EmptyBoard";
// import {forceGenerationEnd} from "../../TestingUtils";

// describe('Caesar', function() {
//   let card: Caesar;
//  let player2: TestPlayer;
//   let player2: TestPlayer;
//   let game: Game;

//   beforeEach(() => {
//     card = new Caesar();
//     player = TestPlayer.BLUE.newPlayer();
//     player2 = TestPlayer.RED.newPlayer();
//     game = Game.newInstance('gameid', [player, player2], player, ARES_OPTIONS_NO_HAZARDS);
//     game.board = EmptyBoard.newInstance();
//     game.generation = 3;
//   });

//   it('Takes action - 5 or less hazards', function() {
//     card.action(player);
//     expect(game.deferredActions).has.lengthOf(4);

//     // Place 3 hazard tiles
//     for (let i = 0; i < 3; i++) {
//       const placeHazard = game.deferredActions.pop()!.execute() as SelectSpace;
//       placeHazard.cb(placeHazard.availableSpaces[i]);
//     }

//     const hazards = AresTestHelper.getHazards(player, game);
//     expect(hazards.length).to.eq(3);

//     game.deferredActions.runNext();

//     // Opponents lose 1 production
//     const input = game.deferredActions.pop()!.execute() as SelectProductionToLose;
//     expect(input.unitsToLose).eq(1);
//     input.cb(Units.of({megacredits: 1}));
//     expect(player.production.megacredits).eq(0);
//     expect(player2.production.megacredits).eq(-1);
//   });

//   it('Takes action - more than 5 hazards', function() {
//     game = Game.newInstance('gameid', [player, player2], player, ARES_OPTIONS_WITH_HAZARDS);
//     game.generation = 3;

//     card.action(player);
//     expect(game.deferredActions).has.lengthOf(4);

//     // Place 3 hazard tiles
//     for (let i = 0; i < 3; i++) {
//       const placeHazard = game.deferredActions.pop()!.execute() as SelectSpace;
//       placeHazard.cb(placeHazard.availableSpaces[i]);
//     }

//     const hazards = AresTestHelper.getHazards(player, game);
//     expect(hazards.length).to.eq(6);

//     game.deferredActions.runNext();

//     // Opponents lose 2 production
//     const input = game.deferredActions.pop()!.execute() as SelectProductionToLose;
//     expect(input.unitsToLose).eq(2);
//     input.cb(Units.of({megacredits: 2}));
//     expect(player.production.megacredits).eq(0);
//     expect(player2.production.megacredits).eq(-2);
//   });

//   it('Can only act once per game', function() {
//     card.action(player);
//     game.deferredActions.runAll(() => {});

//     forceGenerationEnd(game);
//     expect(card.isDisabled).is.true;
//     expect(card.canAct(player)).is.false;
//   });
// });
