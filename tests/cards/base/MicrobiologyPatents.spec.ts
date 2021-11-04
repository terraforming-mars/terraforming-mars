import {expect} from 'chai';
import {MicrobiologyPatents} from '../../../src/cards/pathfinders/MicrobiologyPatents';
import {Virus} from '../../../src/cards/base/Virus';
import {MicroMills} from '../../../src/cards/base/MicroMills';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {Units} from '../../../src/Units';

describe('MicrobiologyPatents', function() {
  it('Should play', function() {
    const card = new MicrobiologyPatents();
    const game = newTestGame(1);
    const player = getTestPlayer(game, 0);

    const action = card.play();
    expect(action).is.undefined;

    card.onCardPlayed(player, new Virus());
    expect(player.getProductionForTest()).deep.eq(Units.of({megacredits: 1}));

    card.onCardPlayed(player, new MicroMills());
    expect(player.getProductionForTest()).deep.eq(Units.of({megacredits: 1}));
  });
});
