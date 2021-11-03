import {expect} from 'chai';

import {LobbyHalls} from '../../src/cards/pathfinders/LobbyHalls';
import {Tags} from '../../src/cards/Tags';
import {deserializeProjectCard, serializeProjectCard} from '../../src/cards/CardSerialization';
import {CardFinder} from '../../src/CardFinder';

describe('CardSerialization', function() {
  let cardFinder = new CardFinder();

  beforeEach(function() {
    cardFinder = new CardFinder();
  });
  it('undefiend clone tags serialize and deserialize', function() {
    const card = new LobbyHalls();
    expect(card.tags).deep.eq([Tags.CLONE, Tags.BUILDING]);

    const serializedCard = serializeProjectCard(card);

    expect(serializedCard.cloneTag).eq(Tags.CLONE);
    const deserialized = deserializeProjectCard(serializedCard, cardFinder);
    expect(deserialized).is.instanceOf(LobbyHalls);
    expect((deserialized as LobbyHalls).cloneTag).eq(Tags.CLONE);
    expect(deserialized.tags).deep.eq([Tags.CLONE, Tags.BUILDING]);
  });

  it('defined clone tags serialize and deserialize', function() {
    const card = new LobbyHalls();
    card.cloneTag = Tags.SCIENCE;
    const serializedCard = serializeProjectCard(card);

    expect(serializedCard.cloneTag).eq(Tags.SCIENCE);

    const deserialized = deserializeProjectCard(serializedCard, cardFinder);
    expect(deserialized).is.instanceOf(LobbyHalls);
    expect((deserialized as LobbyHalls).cloneTag).eq(Tags.SCIENCE);
    expect(deserialized.tags).deep.eq([Tags.SCIENCE, Tags.BUILDING]);
  });
});
