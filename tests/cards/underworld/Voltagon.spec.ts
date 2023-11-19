import {expect} from 'chai';
import {Voltagon} from '../../../src/server/cards/underworld/Voltagon';
import {testGame} from '../../TestGame';
import {cast, runAllActions} from '../../TestingUtils';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {SelectOption} from '../../../src/server/inputs/SelectOption';
import {Units} from '../../../src/common/Units';
import {UnderworldExpansion} from '../../../src/server/underworld/UnderworldExpansion';

describe('Voltagon', () => {
  let card: Voltagon;
  let game: IGame;
  let player: TestPlayer;

  beforeEach(() => {
    card = new Voltagon();
    [game, player] = testGame(1, {venusNextExtension: true, underworldExpansion: true});
  });

  it('play', () => {
    player.playCorporationCard(card);
    runAllActions(game);

    expect(player.production.asUnits()).deep.eq(Units.of({energy: 1}));
  });

  it('canAct', () => {
    player.energy = 7;

    expect(card.canAct(player)).is.false;

    player.energy = 8;

    expect(card.canAct(player)).is.true;
  });

  it('action', () => {
    player.energy = 16;

    cast(card.action(player), undefined);
    runAllActions(game);
    const orOptions = cast(player.popWaitingFor(), OrOptions);

    expect(game.getOxygenLevel()).eq(0);
    cast(orOptions.options[0], SelectOption).cb(undefined);

    expect(player.energy).eq(8);
    expect(game.getOxygenLevel()).eq(1);

    expect(game.getVenusScaleLevel()).eq(0);
    cast(orOptions.options[1], SelectOption).cb(undefined);

    expect(player.energy).eq(0);
    expect(game.getVenusScaleLevel()).eq(2);
  });

  it('onExcavate', () => {
    player.setCorporationForTest(card);
    player.energy = 0;
    const spaces = UnderworldExpansion.excavatableSpaces(player);
    spaces[0].undergroundResources = 'nothing';
    UnderworldExpansion.excavate(player, spaces[0]);

    expect(player.energy).eq(2);
  });
});
