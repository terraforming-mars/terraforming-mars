import {expect} from 'chai';
import {PrivateResorts} from '../../../src/server/cards/underworld/PrivateResorts';
import {testGame} from '../../TestGame';
import {cast, maxOutOceans} from '../../TestingUtils';

describe('PrivateResorts', () => {
  it('canPlay', () => {
    const card = new PrivateResorts();
    const [/* game */, player] = testGame(2, {underworldExpansion: true});

    maxOutOceans(player, 2);
    player.production.override({heat: 1});
    expect(card.canPlay(player)).is.false;

    maxOutOceans(player, 3);
    player.production.override({heat: 0});
    expect(card.canPlay(player)).is.false;

    maxOutOceans(player, 3);
    player.production.override({heat: 1});
    expect(card.canPlay(player)).is.true;
  });

  it('Should play', () => {
    const card = new PrivateResorts();
    const [/* game */, player] = testGame(2, {underworldExpansion: true});

    player.production.override({heat: 1});

    cast(card.play(player), undefined);
    expect(player.production.megacredits).eq(3);
    expect(player.underworldData.corruption).eq(1);
    expect(player.production.heat).eq(0);
  });
});
