import {expect} from 'chai';
import {JensonBoyleCo} from '../../../src/server/cards/underworld/JensonBoyleCo';
import {testGame} from '../../TestGame';
import {cast, runAllActions} from '../../TestingUtils';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {SelectOption} from '../../../src/server/inputs/SelectOption';
import {Units} from '../../../src/common/Units';

describe('JensonBoyleCo', () => {
  let card: JensonBoyleCo;
  let game: IGame;
  let player: TestPlayer;

  beforeEach(() => {
    card = new JensonBoyleCo();
    [game, player] = testGame(1);
  });

  it('play', () => {
    player.playCorporationCard(card);
    runAllActions(game);

    expect(player.underworldData.corruption).eq(2);
  });

  it('canAct', () => {
    player.setCorporationForTest(card);

    expect(card.canAct(player)).is.false;

    player.underworldData.corruption = 1;

    expect(card.canAct(player)).is.true;
  });

  it('action', () => {
    player.underworldData.corruption = 4;

    cast(card.action(player), undefined);
    runAllActions(game);
    const orOptions = cast(player.popWaitingFor(), OrOptions);

    player.stock.override(Units.EMPTY);
    cast(orOptions.options[0], SelectOption).cb(undefined);

    expect(player.underworldData.corruption).eq(3);
    expect(player.stock.asUnits()).deep.eq(Units.of({steel: 4}));

    player.stock.override(Units.EMPTY);
    cast(orOptions.options[1], SelectOption).cb(undefined);

    expect(player.underworldData.corruption).eq(2);
    expect(player.stock.asUnits()).deep.eq(Units.of({titanium: 3}));

    player.stock.override(Units.EMPTY);
    cast(orOptions.options[2], SelectOption).cb(undefined);

    expect(player.underworldData.corruption).eq(1);
    expect(player.stock.asUnits()).deep.eq(Units.of({plants: 3}));

    player.stock.override(Units.EMPTY);
    cast(orOptions.options[3], SelectOption).cb(undefined);

    expect(player.underworldData.corruption).eq(0);
    expect(player.stock.asUnits()).deep.eq(Units.of({heat: 6}));
  });
});
