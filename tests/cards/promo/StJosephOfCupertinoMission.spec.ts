import {expect} from 'chai';
import {StJosephOfCupertinoMission} from '@/server/cards/promo/StJosephOfCupertinoMission';
import {Space} from '@/server/boards/Space';
import {TileType} from '@/common/TileType';
import {Payment} from '@/common/inputs/Payment';
import {IGame} from '@/server/IGame';
import {OrOptions} from '@/server/inputs/OrOptions';
import {SelectPayment} from '@/server/inputs/SelectPayment';
import {SelectSpace} from '@/server/inputs/SelectSpace';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {addCity, runAllActions} from '../../TestingUtils';
import {cast} from '@/common/utils/utils';
import {SelectOption} from '@/server/inputs/SelectOption';
import {EmptyBoard} from '../../testing/EmptyBoard';

describe('StJosephOfCupertinoMission', () => {
  let card: StJosephOfCupertinoMission;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new StJosephOfCupertinoMission();
    [game, player, player2] = testGame(2);
    game.board = EmptyBoard.newInstance();
  });

  for (const run of [
    {cities: 0, cathedrals: 0, expected: false},
    {cities: 1, cathedrals: 0, expected: true},
    {cities: 1, cathedrals: 1, expected: false},
    {cities: 2, cathedrals: 1, expected: true},
  ] as const) {
    it('canAct ' + JSON.stringify(run), () => {
      player.megaCredits = 5;
      const spaces = [];
      for (let i = 0; i < run.cities; i++) {
        spaces.push(addCity(player));
      }
      for (let i = 0; i < run.cathedrals; i++) {
        game.stJosephCathedrals.push(spaces[i].id);
      }

      expect(card.canAct(player)).to.eq(run.expected);
    });
  }

  for (const run of [
    {mc: 4, steel: 0, expected: false},
    {mc: 5, steel: 0, expected: true},
    {mc: 0, steel: 3, expected: true},
    {mc: 2, steel: 1, expected: false},
  ] as const) {
    it('affording canAct ' + JSON.stringify(run), () => {
      addCity(player);
      player.megaCredits = run.mc;
      player.stock.steel = run.steel;
      expect(card.canAct(player)).eq(run.expected);
    });
  }

  it('action lets the player pay using steel', () => {
    const citySpace = addCity(player);
    player.megaCredits = 0;
    player.stock.steel = 3;

    card.action(player);
    runAllActions(game);

    const selectPayment = cast(player.popWaitingFor(), SelectPayment);
    selectPayment.cb(Payment.of({steel: 3}));
    runAllActions(game);

    const selectSpace = cast(player.popWaitingFor(), SelectSpace);
    selectSpace.cb(citySpace);

    expect(player.stock.steel).to.eq(0);
    expect(game.stJosephCathedrals).includes(citySpace.id);
  });

  it('action offers only cities without an existing cathedral, and records the new one', () => {
    const eligible = addCity(player);
    const ineligible = addCity(player2);
    game.stJosephCathedrals.push(ineligible.id);

    player.megaCredits = 5;
    card.action(player);
    runAllActions(game);

    const selectSpace = cast(player.popWaitingFor(), SelectSpace);
    expect(selectSpace.spaces).deep.eq([eligible]);

    selectSpace.cb(eligible);

    expect(game.stJosephCathedrals).includes(eligible.id);
    expect(player.megaCredits).to.eq(0);
  });

  function buildCathedralOn(player: TestPlayer, citySpace: Space) {
    card.action(player);
    runAllActions(game);
    cast(player.popWaitingFor(), SelectSpace).cb(citySpace);
    runAllActions(game);
  }

  function assertDrawCardPrompt(player: TestPlayer, accept: boolean) {
    const orOptions = cast(player.popWaitingFor(), OrOptions);
    expect(orOptions.options).has.lengthOf(2);
    const selectPayment = cast(orOptions.options[0], SelectPayment);
    const decline = cast(orOptions.options[1], SelectOption);

    if (accept) {
      selectPayment.cb(Payment.of({megacredits: 2}));
      expect(player.cardsInHand).has.lengthOf(1);
    } else {
      decline.cb(undefined);
      expect(player.cardsInHand).has.lengthOf(0);
    }
    return orOptions;
  }

  it('the city owner may pay 2 M€ to draw a card', () => {
    const citySpace = addCity(player2);
    player.megaCredits = 7;
    player2.megaCredits = 5;

    buildCathedralOn(player, citySpace);
    expect(player.megaCredits).to.eq(2);

    assertDrawCardPrompt(player2, true);

    expect(player.megaCredits).to.eq(2);
    expect(player2.megaCredits).to.eq(3);
  });

  it('the city owner may decline to draw a card', () => {
    const citySpace = addCity(player2);
    player.megaCredits = 7;
    player2.megaCredits = 5;

    buildCathedralOn(player, citySpace);
    expect(player.megaCredits).to.eq(2);

    assertDrawCardPrompt(player2, false);

    expect(player.megaCredits).to.eq(2);
    expect(player2.megaCredits).to.eq(5);
  });

  it('does not offer a draw-card prompt when the city is unowned (solo game)', () => {
    const citySpace = game.board.getAvailableSpacesForCity(player)[0];
    citySpace.tile = {tileType: TileType.CITY};
    player.megaCredits = 7;

    buildCathedralOn(player, citySpace);
    expect(player.megaCredits).to.eq(2);

    expect(player.popWaitingFor()).is.undefined;
    expect(player2.popWaitingFor()).is.undefined;
  });

  it('does not offer a draw-card prompt when the owner cannot afford it', () => {
    const citySpace = addCity(player2);
    player2.megaCredits = 1;
    player.megaCredits = 7;

    buildCathedralOn(player, citySpace);
    expect(player.megaCredits).to.eq(2);

    expect(player2.popWaitingFor()).is.undefined;
    expect(player.popWaitingFor()).is.undefined;
  });

  it('offers the draw-card prompt to the acting player when they own the chosen city', () => {
    const citySpace = addCity(player);
    player.megaCredits = 7;

    buildCathedralOn(player, citySpace);
    expect(player.megaCredits).to.eq(2);

    assertDrawCardPrompt(player, true);
    expect(player.megaCredits).to.eq(0);
  });

  it('getVictoryPoints counts cathedrals placed by any player', () => {
    game.stJosephCathedrals = ['01', '02', '03'];
    expect(card.getVictoryPoints(player)).to.eq(3);
    expect(card.getVictoryPoints(player2)).to.eq(3);
  });
});
