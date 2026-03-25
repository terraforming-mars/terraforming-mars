import {expect} from 'chai';
import {Racketeering} from '../../../src/server/cards/underworld/Racketeering';
import {testGame} from '../../TestGame';
import {cast, fakeCard} from '../../TestingUtils';
import {InheritedFortune} from '../../../src/server/cards/underworld/InheritedFortune';
import {JensonBoyleCo} from '../../../src/server/cards/underworld/JensonBoyleCo';
import {MicroMills} from '../../../src/server/cards/base/MicroMills';
import {HiredRaiders} from '../../../src/server/cards/underworld/HiredRaiders';
import {Tag} from '../../../src/common/cards/Tag';

describe('Racketeering', () => {
  it('play', () => {
    const card = new Racketeering();
    const [/* game */, player] = testGame(2, {underworldExpansion: true});

    cast(card.play(player), undefined);

    expect(player.production.megacredits).eq(1);
  });

  it('several cards', () => {
    const card = new Racketeering();
    const [/* game */, player] = testGame(2, {underworldExpansion: true});

    // Prelude with crime tag
    player.playedCards.push(new InheritedFortune());
    // Corporation with crime tag
    player.playedCards.push(new JensonBoyleCo());
    // No crime tag
    player.playedCards.push(new MicroMills());
    cast(card.play(player), undefined);

    expect(player.production.megacredits).eq(3);
  });

  it('including events', () => {
    const card = new Racketeering();
    const [/* game */, player] = testGame(2, {underworldExpansion: true});

    // Underworld Hired Raiders has a crime tag.
    player.playedCards.push(new HiredRaiders());
    cast(card.play(player), undefined);

    expect(player.production.megacredits).eq(2);
  });

  it('including wild tags', () => {
    const card = new Racketeering();
    const [/* game */, player] = testGame(2, {underworldExpansion: true});

    player.playedCards.push(fakeCard({tags: [Tag.WILD]}));
    cast(card.play(player), undefined);

    expect(player.production.megacredits).eq(2);
  });
});
