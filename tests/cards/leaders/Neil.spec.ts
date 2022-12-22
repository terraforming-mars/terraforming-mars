// import {expect} from "chai";
// import {Neil} from "../../../src/server/cards/leaders/Neil";
// import {LTFPrivileges} from "../../../src/server/cards/moon/LTFPrivileges";
// import {ThoriumRush} from "../../../src/server/cards/moon/ThoriumRush";
// import {Game} from "../../../src/server/Game";
// import {MoonExpansion} from "../../../src/moon/MoonExpansion";
// import {Resources} from "../../../src/common/Resources";
// import {forceGenerationEnd} from "../../TestingUtils";
// import {TestPlayer} from '../../TestPlayer';


// describe('Neil', function() {
//   let card: Neil;
//   let player: TestPlayer;
//   let player2: TestPlayer;
//   let game: Game;

//   beforeEach(() => {
//     card = new Neil();
//     player = TestPlayer.BLUE.newPlayer();
//     player2 = TestPlayer.RED.newPlayer();

//     const gameOptions = TestingUtils.setCustomGameOptions({moonExpansion: true});
//     game = Game.newInstance('gameid', [player, player2], player, gameOptions);
//   });

//   it('Can act', function() {
//     expect(card.canAct()).is.true;
//   });

//   it('Takes action: Gains M€ production equal to lowest Moon rate', function() {
//     MoonExpansion.raiseColonyRate(player, 5);
//     MoonExpansion.raiseLogisticRate(player, 2);
//     MoonExpansion.raiseMiningRate(player, 1);

//     card.action(player);
//     expect(player.production.MEGACREDITS)).eq(1);
//   });

//   it('Gains 1 M€ when any player plays a Moon tag', function() {
//     player.playedCards.push(card);

//     card.onCardPlayed(player, new LTFPrivileges());
//     expect(player.megaCredits).eq(1);

//     card.onCardPlayed(player2, new ThoriumRush());
//     expect(player.megaCredits).eq(2);
//   });

//   it('Can only act once per game', function() {
//     card.action(player);
//     forceGenerationEnd(game);
//     expect(card.isDisabled).is.true;
//     expect(card.canAct()).is.false;
//   });
// });
