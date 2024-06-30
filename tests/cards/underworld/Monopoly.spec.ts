import {expect} from 'chai';
import {Monopoly} from '../../../src/server/cards/underworld/Monopoly';
import {testGame} from '../../TestGame';
import {cast, runAllActions} from '../../TestingUtils';
import {Units} from '../../../src/common/Units';
import {SelectResource} from '../../../src/server/inputs/SelectResource';
import {TestPlayer} from '../../TestPlayer';
import {IGame} from '../../../src/server/IGame';
import {Resource} from '../../../src/common/Resource';
import {assertIsMaybeBlock} from '../../underworld/underworldAssertions';

describe('Monopoly', () => {
  let card: Monopoly;
  let game: IGame;
  let player: TestPlayer;
  let [opponent1, opponent2, opponent3]: Array<TestPlayer> = [];

  beforeEach(() => {
    card = new Monopoly();
    [game, player, opponent1, opponent2, opponent3] = testGame(4, {underworldExpansion: true});
  });

  it('canPlay', () => {
    player.underworldData.corruption = 2;

    expect(card.canPlay(player)).is.false;

    player.underworldData.corruption = 3;

    expect(card.canPlay(player)).is.true;
  });

  function setup(player: TestPlayer, units: Partial<Units>, corruption: number) {
    player.production.adjust(Units.of(units));
    player.underworldData.corruption = corruption;
  }

  it('cannot play when ALL production is lost.', () => {
    setup(opponent1, {megacredits: -5}, 0);
    setup(opponent2, {megacredits: -5}, 0);
    setup(opponent3, {megacredits: -5}, 0);
    player.underworldData.corruption = 3;

    expect(card.canPlay(player)).is.false;

    opponent1.production.add(Resource.MEGACREDITS, 1);

    expect(card.canPlay(player)).is.true;
  });

  it('play', () => {
    setup(opponent1, {steel: 1, heat: 1}, 0);
    setup(opponent2, {steel: 1, heat: 1}, 0);
    setup(opponent3, {}, 0);

    const selectResource = cast(card.play(player), SelectResource);
    expect(selectResource.include).deep.eq([Resource.MEGACREDITS, Resource.STEEL, Resource.HEAT]);
    selectResource.cb('steel');
    runAllActions(game);

    expect(player.production.steel).eq(2);
    expect(opponent1.production.steel).eq(0);
    expect(opponent2.production.steel).eq(0);
    expect(opponent2.production.steel).eq(0);
  });

  it('Do not block if you have corruption, but none of that resource', () => {
    setup(opponent1, {steel: 1, heat: 1}, 0);
    setup(opponent2, {steel: 1, heat: 1}, 0);
    setup(opponent3, {}, 1);

    const selectResource = cast(card.play(player), SelectResource);
    selectResource.cb('steel');
    runAllActions(game);
    expect(opponent1.popWaitingFor()).is.undefined;
    expect(opponent2.popWaitingFor()).is.undefined;
    expect(opponent3.popWaitingFor()).is.undefined;

    expect(player.production.steel).eq(2);
    expect(opponent1.production.steel).eq(0);
    expect(opponent2.production.steel).eq(0);
    expect(opponent2.production.steel).eq(0);
  });

  it('Block with corruption', () => {
    setup(opponent1, {}, 1);
    setup(opponent2, {}, 1);
    setup(opponent3, {}, 1);

    const selectResource = cast(card.play(player), SelectResource);
    expect(selectResource.include).deep.eq([Resource.MEGACREDITS]);
    selectResource.cb('megacredits');

    runAllActions(game);
    assertIsMaybeBlock(opponent1, opponent1.popWaitingFor(), 'do not block');
    runAllActions(game);
    assertIsMaybeBlock(opponent2, opponent2.popWaitingFor(), 'corruption');
    runAllActions(game);
    assertIsMaybeBlock(opponent3, opponent3.popWaitingFor(), 'do not block');
    runAllActions(game);

    expect(player.production.megacredits).eq(2);
    expect(opponent1.production.megacredits).eq(-1);
    expect(opponent2.production.megacredits).eq(0);
    expect(opponent3.production.megacredits).eq(-1);
  });
});
