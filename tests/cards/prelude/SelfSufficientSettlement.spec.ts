import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {SelfSufficientSettlement} from '../../../src/server/cards/prelude/SelfSufficientSettlement';
import {Units} from '../../../src/common/Units';
import {cast, runAllActions} from '../../TestingUtils';
import {assertPlaceCity} from '../../assertions';

describe('SelfSufficientSettlement', () => {
  it('Should play', () => {
    const [game, player] = testGame(1);
    const card = new SelfSufficientSettlement();

    expect(player.production.asUnits()).deep.eq(Units.of({}));

    const action = card.play(player);
    runAllActions(game);
    cast(action, undefined);

    expect(player.production.asUnits()).deep.eq(Units.of({megacredits: 2}));
    assertPlaceCity(player, player.popWaitingFor());
  });
});
