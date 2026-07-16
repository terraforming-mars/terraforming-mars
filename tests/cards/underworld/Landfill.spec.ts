import {expect} from 'chai';
import {Landfill} from '../../../src/server/cards/underworld/Landfill';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';
import {Units} from '../../../src/common/Units';

describe('Landfill', () => {
  it('Should play', () => {
    const card = new Landfill();
    const [/* game */, player] = testGame(2);

    player.production.override({megacredits: -1, steel: 1, heat: 1});

    cast(card.play(player), undefined);

    expect(player.production.asUnits()).deep.eq(Units.of({megacredits: 1, steel: 1, heat: 1}));

    player.production.override({megacredits: 2, plants: 4, energy: 1, heat: 1});

    cast(card.play(player), undefined);

    expect(player.production.asUnits()).deep.eq(Units.of({megacredits: 6, plants: 4, energy: 1, heat: 1}));
  });
});
