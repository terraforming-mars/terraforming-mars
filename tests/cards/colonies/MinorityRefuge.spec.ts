import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {MinorityRefuge} from '../../../src/server/cards/colonies/MinorityRefuge';
import {SelectColony} from '../../../src/server/inputs/SelectColony';
import {ColonyName} from '../../../src/common/colonies/ColonyName';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {cast, churnPlay, runAllActions} from '../../TestingUtils';
import {Units} from '../../../src/common/Units';
import {IColony} from '../../../src/server/colonies/IColony';
import {Luna} from '../../../src/server/colonies/Luna';

describe('MinorityRefuge', function() {
  let card: MinorityRefuge;
  let player: TestPlayer;
  let game: Game;
  let triton: IColony;

  beforeEach(function() {
    card = new MinorityRefuge();
    // By choosing 2 players I don't have to pay attention to the first action which
    // removes a colony tile.
    [game, player] = testGame(2, {
      coloniesExtension: true,
      customColoniesList: [
        ColonyName.TRITON,
        ColonyName.CERES,
        ColonyName.LEAVITT,
        ColonyName.EUROPA,
        ColonyName.GANYMEDE,
      ],
    });
    triton = game.colonies.find((colony) => colony.name === ColonyName.TRITON)!;
  });

  it('canPlay', () => {
    player.production.override(Units.of({megacredits: -4}));
    expect(card.canPlay(player)).is.false;
    player.production.override(Units.of({megacredits: -3}));
    expect(card.canPlay(player)).is.true;
  });

  it('play)', () => {
    expect(player.production.asUnits()).deep.eq(Units.EMPTY);
    const selectColony = cast(churnPlay(card, player), SelectColony);
    expect(selectColony.colonies).has.length(5);
    expect(selectColony.title).eq('Select colony for Minority Refuge');

    // Gain plant production
    selectColony.cb(triton);

    // Card cost
    expect(player.production.asUnits()).deep.eq(Units.of({megacredits: -2}));
    // Colony bonus
    expect(player.stock.asUnits()).deep.eq(Units.of({titanium: 3}));

    runAllActions(game);
    cast(player.popWaitingFor(), undefined);
  });

  it('can play with low MC production when Luna is in play', () => {
    const luna = new Luna();
    player.production.override(Units.of({megacredits: -4}));
    expect(card.canPlay(player)).is.false;
    game.colonies[0] = luna;
    expect(card.canPlay(player)).is.true;
    const selectColony = cast(churnPlay(card, player), SelectColony);

    // Gain plant production
    selectColony.cb(luna);

    // Card cost + colony bonus
    expect(player.production.asUnits()).deep.eq(Units.of({megacredits: -4}));

    runAllActions(game);
    cast(player.popWaitingFor(), undefined);
  });
});
