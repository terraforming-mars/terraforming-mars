// import {Game} from '../../../src/Game';
// import {Player} from '../../../src/Player';
// import {setCustomGameOptions, TestPlayers} from '../../TestingUtils';
// import {SyndicatePirateRaids} from '../../../src/cards/moon/SyndicatePirateRaids';
// import {expect} from 'chai';
// import {MoonExpansion} from '../../../src/moon/MoonExpansion';
// import {IMoonData} from '../../../src/moon/IMoonData';
// import {Resources} from '../../../src/Resources';

// const MOON_OPTIONS = setCustomGameOptions({moonExpansion: true});

// describe('SyndicatePirateRaids', () => {
//   let player: Player;
//   let card: SyndicatePirateRaids;
//   let moonData: IMoonData;

//   beforeEach(() => {
//     player = TestPlayers.BLUE.newPlayer();
//     const game = Game.newInstance('id', [player], player, MOON_OPTIONS);
//     card = new SyndicatePirateRaids();
//     moonData = MoonExpansion.moonData(game);
//   });

//   it('Players cannot retrieve their trade fleets', () => {
//     card.play(player);
//     expect(moonData.miningRate).eq(1);

//     expect(player.getProduction(Resources.TITANIUM)).eq(2);
//     expect(player.getTerraformRating()).eq(15);

//     card.play(player);
//     expect(moonData.miningRate).eq(2);

//     expect(player.getProduction(Resources.TITANIUM)).eq(4);
//     expect(player.getTerraformRating()).eq(16);

//     card.play(player);
//     expect(moonData.miningRate).eq(3);

//     expect(player.getProduction(Resources.TITANIUM)).eq(5);
//     expect(player.getTerraformRating()).eq(17);
//   });

//   it('Players cannot retrieve any added trade fleets', () => {
//     card.play(player);
//     expect(moonData.miningRate).eq(1);

//     expect(player.getProduction(Resources.TITANIUM)).eq(2);
//     expect(player.getTerraformRating()).eq(15);

//     card.play(player);
//     expect(moonData.miningRate).eq(2);

//     expect(player.getProduction(Resources.TITANIUM)).eq(4);
//     expect(player.getTerraformRating()).eq(16);

//     card.play(player);
//     expect(moonData.miningRate).eq(3);

//     expect(player.getProduction(Resources.TITANIUM)).eq(5);
//     expect(player.getTerraformRating()).eq(17);
//   });
// });

