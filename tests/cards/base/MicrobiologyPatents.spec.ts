import {expect} from 'chai';
import {MicrobiologyPatents} from '../../../src/server/cards/pathfinders/MicrobiologyPatents';
import {Virus} from '../../../src/server/cards/base/Virus';
import {MicroMills} from '../../../src/server/cards/base/MicroMills';
import {testGame} from '../../TestGame';
import {Units} from '../../../src/common/Units';
import {cast} from '../../TestingUtils';

describe('MicrobiologyPatents', function() {
  it('Should play', function() {
    const card = new MicrobiologyPatents();
    const [/* skipped */, player] = testGame(1);

    cast(card.play(player), undefined);
    card.onCardPlayed(player, new Virus());
    expect(player.production.asUnits()).deep.eq(Units.of({megacredits: 1}));

    card.onCardPlayed(player, new MicroMills());
    expect(player.production.asUnits()).deep.eq(Units.of({megacredits: 1}));
  });
});
