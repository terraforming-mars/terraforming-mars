import {expect} from 'chai';
import {IGame} from '../../../src/server/IGame';
import {testGame} from '../../TestGame';
import {TestPlayer} from '../../TestPlayer';
import {LunaTradeFederation} from '../../../src/server/cards/moon/LunaTradeFederation';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
// import {IMoonData} from '../../../src/server/moon/IMoonData';
// import {cast, fakeCard, runAllActions} from '../../TestingUtils';
import {fakeCard, runAllActions} from '../../TestingUtils';
import {Units} from '../../../src/common/Units';
// import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {Tag} from '../../../src/common/cards/Tag';

describe('LunaTradeFederation', () => {
  let game: IGame;
  let player: TestPlayer;
  let player2: TestPlayer;
  let lunaTradeFederation: LunaTradeFederation;
  // let moonData: IMoonData;

  beforeEach(() => {
    [game, player, player2] = testGame(2, {moonExpansion: true});
    lunaTradeFederation = new LunaTradeFederation();
  });

  it('play', () => {
    expect(player.canUseTitaniumAsMegacredits).is.false;
    player.playCorporationCard(lunaTradeFederation);
    runAllActions(game);
    expect(player.titanium).eq(10);
    expect(player.megaCredits).eq(15);
    expect(player.canUseTitaniumAsMegacredits).is.true;
  });

  // it('initialAction', () => {
  //   player.corporations.push(lunaTradeFederation);
  //   player.production.override(Units.EMPTY);
  //   expect(moonData.miningRate).eq(0);
  //   expect(player.getTerraformRating()).eq(20);

  //   player.runInitialAction(lunaTradeFederation);

  //   runAllActions(game);
  //   const selectSpace = cast(player.popWaitingFor(), SelectSpace);
  //   selectSpace.cb(moonData.moon.getSpaceOrThrow('m02'));
  //   runAllActions(game);

  //   expect(moonData.miningRate).eq(1);
  //   expect(player.getTerraformRating()).eq(21);
  //   expect(player.production.asUnits()).deep.eq(Units.of({titanium: 1}));
  // });

  it('onTilePlaced', () => {
    player.corporations.push(lunaTradeFederation);

    MoonExpansion.addRoadTile(player, 'm07');
    expect(player.production.asUnits()).deep.eq(Units.of({}));

    MoonExpansion.addMineTile(player, 'm08');
    expect(player.production.asUnits()).deep.eq(Units.of({titanium: 1}));

    MoonExpansion.addRoadTile(player2, 'm09');
    expect(player.production.asUnits()).deep.eq(Units.of({titanium: 1}));

    MoonExpansion.addMineTile(player2, 'm10');
    // expect(player.production.asUnits()).deep.eq(Units.of({titanium: 2}));
    expect(player.production.asUnits()).deep.eq(Units.of({titanium: 1}));
  });

  it('can use titanium to pay for space project cards as normal', () => {
    player.corporations.push(lunaTradeFederation);
    lunaTradeFederation.play(player);
    expect(player.canUseTitaniumAsMegacredits).is.true;

    const card = fakeCard({cost: 10, tags: [Tag.SPACE]});
    player.megaCredits = 6;
    player.titanium = 1;

    expect(player.canAfford(player.affordOptionsForCard(card))).is.false;

    player.megaCredits = 7;
    player.titanium = 1;
    expect(player.canAfford(player.affordOptionsForCard(card))).is.true;
  });

  it('can use titanium to pay for non-space project cards at a discount', () => {
    player.corporations.push(lunaTradeFederation);
    lunaTradeFederation.play(player);
    expect(player.canUseTitaniumAsMegacredits).is.true;

    const card = fakeCard({cost: 10, tags: [Tag.MICROBE]});
    player.megaCredits = 7;
    player.titanium = 1;

    expect(player.spendableMegacredits()).eq(9);
    expect(player.canAfford(player.affordOptionsForCard(card))).is.false;

    player.megaCredits = 8;
    player.titanium = 1;
    expect(player.spendableMegacredits()).eq(10);
    expect(player.canAfford(player.affordOptionsForCard(card))).is.true;

    player.megaCredits = 8;
    player.titanium = 3;
    expect(player.spendableMegacredits()).eq(14);

    player.increaseTitaniumValue();

    expect(player.spendableMegacredits()).eq(17);
  });

  it('can use titanium for other purchases', () => {

  });
});
