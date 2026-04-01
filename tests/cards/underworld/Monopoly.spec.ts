import {expect} from 'chai';
import {Monopoly} from '../../../src/server/cards/underworld/Monopoly';
import {testGame} from '../../TestGame';
import {runAllActions} from '../../TestingUtils';
import {Units} from '../../../src/common/Units';
import {SelectResource} from '../../../src/server/inputs/SelectResource';
import {TestPlayer} from '../../TestPlayer';
import {IGame} from '../../../src/server/IGame';
import {assertIsMaybeBlock} from '../../underworld/underworldAssertions';
import {ProtectedHabitats} from '../../../src/server/cards/base/ProtectedHabitats';
import {cast} from '../../../src/common/utils/utils';

describe('Monopoly', () => {
  let card: Monopoly;
  let game: IGame;
  let player: TestPlayer;
  let [opponent1, opponent2, opponent3]: Array<TestPlayer> = [];

  beforeEach(() => {
    card = new Monopoly();
    [game, player, opponent1, opponent2, opponent3] = testGame(4, {underworldExpansion: true});
  });

  for (const run of [
    {corruption: 1, opponentPlants: 0, isProtected: false, expected: false},
    {corruption: 2, opponentPlants: 0, isProtected: false, expected: false},
    {corruption: 1, opponentPlants: 1, isProtected: false, expected: false},
    {corruption: 2, opponentPlants: 1, isProtected: false, expected: true},
    {corruption: 2, opponentPlants: 1, isProtected: true, expected: false},
  ] as const) {
    it('canPlay ' + JSON.stringify(run), () => {
      player.underworldData.corruption = run.corruption;
      opponent1.plants = run.opponentPlants;
      if (run.isProtected) {
        opponent1.playedCards.push(new ProtectedHabitats());
      }
      expect(card.canPlay(player)).eq(run.expected);
    });
  }

  function setup(player: TestPlayer, units: Partial<Units> & {corruption: number}) {
    player.stock.adjust(Units.of(units));
    player.underworldData.corruption = units.corruption;
  }

  it('play', () => {
    setup(opponent1, {steel: 1, heat: 1, corruption: 0});
    setup(opponent2, {steel: 1, heat: 1, corruption: 0});
    setup(opponent3, {corruption: 0});

    const selectResource = cast(card.play(player), SelectResource);
    expect(selectResource.include).deep.eq(['steel', 'heat']);
    selectResource.cb('steel');
    runAllActions(game);

    expect(player.stock.steel).eq(2);
    expect(opponent1.stock.steel).eq(0);
    expect(opponent2.stock.steel).eq(0);
    expect(opponent2.stock.steel).eq(0);
  });

  it('Do not block if you have corruption, but none of that resource', () => {
    setup(opponent1, {steel: 1, heat: 1, corruption: 0});
    setup(opponent2, {steel: 1, heat: 1, corruption: 0});
    setup(opponent3, {corruption: 1});

    const selectResource = cast(card.play(player), SelectResource);
    selectResource.cb('steel');
    runAllActions(game);
    expect(opponent1.popWaitingFor()).is.undefined;
    expect(opponent2.popWaitingFor()).is.undefined;
    expect(opponent3.popWaitingFor()).is.undefined;

    expect(player.stock.steel).eq(2);
    expect(opponent1.stock.steel).eq(0);
    expect(opponent2.stock.steel).eq(0);
    expect(opponent2.stock.steel).eq(0);
  });

  it('Block with corruption', () => {
    setup(opponent1, {megacredits: 3, corruption: 1});
    setup(opponent2, {megacredits: 3, corruption: 1});
    setup(opponent3, {megacredits: 3, corruption: 1});

    const selectResource = cast(card.play(player), SelectResource);
    expect(selectResource.include).deep.eq(['megacredits']);
    selectResource.cb('megacredits');

    runAllActions(game);
    assertIsMaybeBlock(opponent1, opponent1.popWaitingFor(), 'do not block');
    runAllActions(game);
    assertIsMaybeBlock(opponent2, opponent2.popWaitingFor(), 'corruption');
    runAllActions(game);
    assertIsMaybeBlock(opponent3, opponent3.popWaitingFor(), 'do not block');
    runAllActions(game);

    expect(player.stock.megacredits).eq(4);
    expect(opponent1.stock.megacredits).eq(1);
    expect(opponent2.stock.megacredits).eq(3);
    expect(opponent3.stock.megacredits).eq(1);
  });

  it('Works in solo', () => {
    const [game, player] = testGame(1, {underworldExpansion: true});
    player.underworldData.corruption = 1;

    expect(card.canPlay(player)).is.false;

    player.underworldData.corruption = 2;

    expect(card.canPlay(player)).is.true;

    card.play(player);

    const selectResource = cast(card.play(player), SelectResource);

    expect(selectResource.include).deep.eq([
      'megacredits',
      'steel',
      'titanium',
      'plants',
      'energy',
      'heat']);

    selectResource.cb('steel');
    runAllActions(game);

    expect(player.stock.steel).eq(2);
  });
});
