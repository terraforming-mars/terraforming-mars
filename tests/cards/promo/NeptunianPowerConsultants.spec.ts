import {expect} from 'chai';
import {addOcean, cast, runAllActions} from '../../TestingUtils';
import {NeptunianPowerConsultants} from '../../../src/server/cards/promo/NeptunianPowerConsultants';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {IGame} from '../../../src/server/IGame';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {Payment} from '../../../src/common/inputs/Payment';
import {IceAsteroid} from '../../../src/server/cards/base/IceAsteroid';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';

describe('NeptunianPowerConsultants', () => {
  let card: NeptunianPowerConsultants;
  let game: IGame;
  let player: TestPlayer;
  let player2: TestPlayer;

  beforeEach(() => {
    card = new NeptunianPowerConsultants();
    [game, player, player2] = testGame(2);
    player.playedCards.push(card);
  });

  it('play - cannot afford', () => {
    player.megaCredits = 4;
    addOcean(player2);
    runAllActions(game);
    cast(player.popWaitingFor(), undefined);
  });

  it('play - can afford - do not use', () => {
    player.megaCredits = 5;
    addOcean(player2);
    runAllActions(game);
    const orOptions = cast(player.popWaitingFor(), OrOptions);
    orOptions.options[1].cb();

    expect(card.resourceCount).eq(0);
    expect(player.production.energy).eq(0);
    expect(player.megaCredits).eq(5);
  });

  it('play - can afford - use', () => {
    player.megaCredits = 5;
    addOcean(player2);
    runAllActions(game);
    const orOptions = cast(player.popWaitingFor(), OrOptions);
    orOptions.options[0].cb(Payment.of({megaCredits: 5}));

    expect(card.resourceCount).eq(1);
    expect(player.production.energy).eq(1);
    expect(player.megaCredits).eq(0);
  });

  it('play - can afford, using steel', () => {
    player.megaCredits = 3;
    player.steel = 1;
    addOcean(player2);
    runAllActions(game);
    const orOptions = cast(player.popWaitingFor(), OrOptions);
    orOptions.options[0].cb(Payment.of({megaCredits: 3, steel: 1}));

    expect(card.resourceCount).eq(1);
    expect(player.production.energy).eq(1);
    expect(player.megaCredits).eq(0);
    expect(player.steel).eq(0);
  });

  it('Plays in correct priority order', () => {
    player.megaCredits = 6;
    const iceAsteroid = new IceAsteroid();
    iceAsteroid.play(player2);
    runAllActions(game);

    const selectSpace = cast(player2.popWaitingFor(), SelectSpace);
    selectSpace.cb(selectSpace.spaces[0]);
    runAllActions(game);
    cast(player2.popWaitingFor(), undefined);
    const orOptions = cast(player.popWaitingFor(), OrOptions);
    orOptions.options[0].cb(Payment.of({megaCredits: 5, steel: 0}));

    runAllActions(game);

    cast(player2.popWaitingFor(), SelectSpace);
  });
});
