import {expect} from 'chai';
import {FamilyConnections} from '../../../src/server/cards/underworld/FamilyConnections';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';
import {MicroMills} from '../../../src/server/cards/base/MicroMills';
import {PhobosSpaceHaven} from '../../../src/server/cards/base/PhobosSpaceHaven';
import {NoctisCity} from '../../../src/server/cards/base/NoctisCity';

describe('FamilyConnections', () => {
  it('play', () => {
    const card = new FamilyConnections();
    const [/* game */, player] = testGame(2, {underworldExpansion: true});

    cast(card.play(player), undefined);

    expect(player.underworldData.corruption).eq(0);
  });

  it('several cards', () => {
    const card = new FamilyConnections();
    const [/* game */, player] = testGame(2, {underworldExpansion: true});

    // Cards with City tag
    player.playedCards.push(new PhobosSpaceHaven());
    player.playedCards.push(new NoctisCity());
    // No city tag
    player.playedCards.push(new MicroMills());
    cast(card.play(player), undefined);

    expect(player.underworldData.corruption).eq(2);
  });
});
