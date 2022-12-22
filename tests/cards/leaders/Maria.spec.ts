// import {expect} from "chai";
// import {ColonyName} from '../../../src/common/colonies/ColonyName';
// import {Game} from "../../../src/server/Game";
// import {SelectColony} from '../../../src/server/inputs/SelectColony';
// import {forceGenerationEnd, setCustomGameOptions} from "../../TestingUtils";
// import {TestPlayer} from '../../TestPlayer';
// // import {SpaceType} from "../../../src/common/cards/SpaceType";
// import {InputResponse} from '../../../src/common/inputs/InputResponse';


// import {Maria} from "../../../src/server/cards/leaders/Maria";



// describe('Maria', function() {
//   let card: Maria;
//   let player: TestPlayer;
//   let game: Game;

//   beforeEach(() => {
//     card = new Maria();
//     player = TestPlayer.BLUE.newPlayer();
//     game = Game.newInstance('gameid', [player], player);

//   });

//   it('Can act', function() {
//     expect(card.canAct(player)).is.true;
//   });
  
//   it('Takes action generation 1', function() {
//     // const selectColony = card.action(player) as SelectColony;
//     const colonyInPlay = game.colonies[0];
//     const discardedColony = game.discardedColonies[0];
//     console.log(discardedColony)
//     card.action(player)

//     // expect(game.colonies).does.not.include(discardedColony);
//     // expect(game.colonies).has.length(5);

//     expect(() => player.process(<InputResponse>{})).to.throw(/Not a valid SelectColonyResponse/);
//     expect(() => player.process(<InputResponse>{type: 'colony', colonyName: undefined as unknown as ColonyName})).to.throw(/No colony selected/);
//     expect(() => player.process({type: 'colony', colonyName: colonyInPlay.name})).to.throw(/Colony .* not found/);

//   });

//   it('Takes action in Generation 4', function() {
//     for (let i = 0; i < 3; i++) {
//       game.deferredActions.runAll(() => {});
//       forceGenerationEnd(game);
//     }

//     const selectColony = card.action(player) as SelectColony;
//     expect(selectColony.colonies).has.length(4);
    
//     selectColony.cb(selectColony.colonies[0]);
//     // expect(player.playedCards.filter((card) => card.cardType === SpaceType.COLONY)).has.length(1);
//   });



//   it('Can only act once per game', function() {
//     const selectColony = card.action(player) as SelectColony;
//     const builtColonyName = selectColony.colonies[0].name;
//     selectColony.cb((<any>ColonyName)[builtColonyName.toUpperCase()]);
//     game.deferredActions.runAll(() => {});
//     forceGenerationEnd(game);

//     expect(card.isDisabled).is.true;
//     expect(card.canAct(player)).is.false;
//   });
// });
