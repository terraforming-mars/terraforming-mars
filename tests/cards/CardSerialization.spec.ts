import {expect} from 'chai';

import {LobbyHalls} from '../../src/server/cards/pathfinders/LobbyHalls';
import {Tag} from '../../src/common/cards/Tag';
import {deserializeProjectCard, serializeProjectCard} from '../../src/server/cards/CardSerialization';
import {CardFinder} from '../../src/server/CardFinder';
import {cast} from '../TestingUtils';

describe('CardSerialization', function() {
  let cardFinder = new CardFinder();

  beforeEach(function() {
    cardFinder = new CardFinder();
  });
  it('undefiend clone tags serialize and deserialize', function() {
    const card = new LobbyHalls();
    expect(card.tags).deep.eq([Tag.CLONE, Tag.BUILDING]);

    const serializedCard = serializeProjectCard(card);

    expect(serializedCard.cloneTag).eq(Tag.CLONE);
    const deserialized = deserializeProjectCard(serializedCard, cardFinder);
    const lobbyHalls = cast(deserialized, LobbyHalls);
    expect(lobbyHalls.cloneTag).eq(Tag.CLONE);
    expect(lobbyHalls.tags).deep.eq([Tag.CLONE, Tag.BUILDING]);
  });

  it('defined clone tags serialize and deserialize', function() {
    const card = new LobbyHalls();
    card.cloneTag = Tag.SCIENCE;
    const serializedCard = serializeProjectCard(card);

    expect(serializedCard.cloneTag).eq(Tag.SCIENCE);

    const deserialized = deserializeProjectCard(serializedCard, cardFinder);
    const lobbyHalls = cast(deserialized, LobbyHalls);
    expect(lobbyHalls.cloneTag).eq(Tag.SCIENCE);
    expect(lobbyHalls.tags).deep.eq([Tag.SCIENCE, Tag.BUILDING]);
  });
});
