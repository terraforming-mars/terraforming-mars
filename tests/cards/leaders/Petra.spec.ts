// import {expect} from "chai";
// import {Game} from "../../../src/server/Game";
// import {SelectPartyToSendDelegate} from "../../../src/inputs/SelectPartyToSendDelegate";
// import {PartyName} from '../../../src/common/turmoil/PartyName';
// import {Turmoil} from "../../../src/server/turmoil/Turmoil";
// import {forceGenerationEnd} from "../../TestingUtils";
// import {TestPlayer} from '../../TestPlayer';

// import {Petra} from "../../../src/server/cards/leaders/Petra";


// describe('Petra', function() {
//   let card: Petra;
//   let player: TestPlayer;
//   let player2: TestPlayer;
//   let game: Game;

//   beforeEach(() => {
//     card = new Petra();
//     player = TestPlayer.BLUE.newPlayer();
//     player2 = TestPlayer.RED.newPlayer();

//     const gameOptions = TestingUtils.setCustomGameOptions();
//     game = Game.newInstance('gameid', [player, player2], player, gameOptions);
//     const turmoil = game.turmoil as Turmoil;

//     // Manually set up some neutral delegates
//     turmoil.parties.forEach((party) => party.delegates = []);
//     turmoil.chairman = "NEUTRAL";

//     const scientists = turmoil.getPartyByName(PartyName.SCIENTISTS)!;
//     turmoil.sendDelegateToParty("NEUTRAL", scientists.name, game);
//     turmoil.sendDelegateToParty("NEUTRAL", scientists.name, game);

//     const greens = turmoil.getPartyByName(PartyName.GREENS)!;
//     turmoil.sendDelegateToParty("NEUTRAL", greens.name, game);

//     const reds = turmoil.getPartyByName(PartyName.REDS)!;
//     turmoil.sendDelegateToParty("NEUTRAL", reds.name, game);
//   });

//   it('Can act', function() {
//     expect(card.canAct(player)).is.true;
//   });
  
//   it('Takes action - lobby delegate remains unused', function() {
//     // Replace 4 delegates + chairman
//     card.action(player);

//     const turmoil = game.turmoil as Turmoil;
//     expect(turmoil.getDelegatesInReserve(player.id)).eq(1);
//     expect(turmoil.lobby.has(player.id)).is.true;
//     expect(turmoil.chairman).eq(player.id);
    
//     const scientists = turmoil.getPartyByName(PartyName.SCIENTISTS)!;
//     expect(scientists.delegates.filter((delegate) => delegate === player.id)).has.length(2);
//     expect(scientists.partyLeader).eq(player.id);

//     const greens = turmoil.getPartyByName(PartyName.GREENS)!;
//     expect(greens.delegates.filter((delegate) => delegate === player.id)).has.length(1);
//     expect(greens.partyLeader).eq(player.id);

//     const reds = turmoil.getPartyByName(PartyName.REDS)!;
//     expect(reds.delegates.filter((delegate) => delegate === player.id)).has.length(1);
//     expect(reds.partyLeader).eq(player.id);
//     expect(player.megaCredits).to.eq(15);

//     // Send 3 Neutral delegates
//     // This creates at least 3 deferredActions, with possible extra deferredActions for logging
//     expect(game.deferredActions.length).is.greaterThanOrEqual(3);

//     while (game.deferredActions.length) {
//       const selectParty = game.deferredActions.pop()!.execute() as SelectPartyToSendDelegate;
//       if (selectParty !== undefined) {
//         selectParty.cb(PartyName.GREENS);
//       }
//     }

//     expect(greens.delegates.filter((delegate) => delegate === 'NEUTRAL')).has.length(3);
//   });

//   it('Takes action - lobby delegate is also used', function() {
//     const turmoil = game.turmoil as Turmoil;
//     const scientists = turmoil.getPartyByName(PartyName.SCIENTISTS)!;
//     turmoil.sendDelegateToParty("NEUTRAL", scientists.name, game);
//     turmoil.sendDelegateToParty("NEUTRAL", scientists.name, game);

//     // Replace 6 delegates + chairman
//     card.action(player);
//     expect(turmoil.getDelegatesInReserve(player.id)).eq(0);
//     expect(turmoil.lobby.has(player.id)).is.false;
//     expect(turmoil.chairman).eq(player.id);
    
//     expect(scientists.delegates.filter((delegate) => delegate === player.id)).has.length(4);
//     expect(scientists.partyLeader).eq(player.id);

//     const greens = turmoil.getPartyByName(PartyName.GREENS)!;
//     expect(greens.delegates.filter((delegate) => delegate === player.id)).has.length(1);
//     expect(greens.partyLeader).eq(player.id);

//     const reds = turmoil.getPartyByName(PartyName.REDS)!;
//     expect(reds.delegates.filter((delegate) => delegate === player.id)).has.length(1);
//     expect(reds.partyLeader).eq(player.id);
//     expect(player.megaCredits).to.eq(21);
//   });

//   it('Can only act once per game', function() {
//     card.action(player);
//     forceGenerationEnd(game);

//     expect(card.isDisabled).is.true;
//     expect(card.canAct(player)).is.false;
//   });
// });
