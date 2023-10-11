import {expect} from 'chai';
import {TestPlayer} from '../TestPlayer';
import {testGame} from '../TestGame';
import {UnderworldExpansion} from '../../src/server/underworld/UnderworldExpansion';
import {Game} from '../../src/server/Game';
import {UnderworldData} from '../../src/server/underworld/UnderworldData';
import {fakeCard} from '../TestingUtils';
// import {Tag} from '../../src/common/cards/Tag';
// import {CardResource} from '../../src/common/CardResource';
// import {CardName} from '../../src/common/cards/CardName';
// import {SelectParty} from '../../src/server/inputs/SelectParty';
// import {Turmoil} from '../../src/server/turmoil/Turmoil';

describe('UnderworldExpansion', function() {
  let player1: TestPlayer;
  let player2: TestPlayer;
  let game: Game;
  let underworldData: UnderworldData;

  beforeEach(() => {
    [game, player1, player2] = testGame(2, {underworldExpansion: true});
    underworldData = game.underworldData;
  });

  it('sanity', () => {
    expect(underworldData).is.not.undefined;
  });

  it('Game without expansions has no tokens', () => {
    const [game, player] = testGame(1);
    expect(game.underworldData.tokens).is.empty;
    expect(player.underworldData).is.not.undefined;
  });

  it('sanity', () => {
    expect(underworldData.tokens).has.length(89);
  });

  it('identify', () => {
    const space = game.board.getAvailableSpacesOnLand(player1)[0];

    expect(space.undergroundResources).is.undefined;
    expect(underworldData.tokens).has.length(89);

    UnderworldExpansion.identify(game, space, player1);

    expect(space.undergroundResources).is.not.undefined;
    expect(underworldData.tokens).has.length(88);
    expect(space.excavator).is.undefined;
  });

  it('identify calls card callbacks', () => {
    const responses: Array<string> = [];
    const space = game.board.getAvailableSpacesOnLand(player1)[0];
    const fake = fakeCard({
      onIdentification(identifyingPlayer, cardOwner, space) {
        responses.push(`${identifyingPlayer.id} - ${cardOwner.id} - ${space.id}`);
      },
    });
    player1.playedCards.push(fake);
    player2.playedCards.push(fake);

    UnderworldExpansion.identify(game, space, player1);

    expect(responses).deep.eq([
      'p-player1-id - p-player1-id - 03',
      'p-player1-id - p-player2-id - 03',
    ]);
  });

  it('serializing and deserializing board spaces', () => {
    const spaces = game.board.getAvailableSpacesOnLand(player1);
    spaces[0].undergroundResources = 'data3';
    spaces[1].undergroundResources = 'corruption2';
    spaces[2].undergroundResources = 'ocean';
    spaces[0].excavator = player1;
    spaces[1].excavator = player2;

    const spaceIds = spaces.map((s) => s.id);
    const serialized = game.serialize();
    const serializedSpaces = serialized.board.spaces.filter((space) => spaceIds.includes(space.id));

    expect(serializedSpaces[0].undergroundResources).eq('data3');
    expect(serializedSpaces[1].undergroundResources).eq('corruption2');
    expect(serializedSpaces[2].undergroundResources).eq('ocean');
    expect(serializedSpaces[3]).does.not.haveOwnPropertyDescriptor('undergroundResources');
    expect(serializedSpaces[0].excavator).eq('p-player1-id');
    expect(serializedSpaces[1].excavator).eq('p-player2-id');
    expect(serializedSpaces[2]).does.not.haveOwnPropertyDescriptor('excavator');
    expect(serializedSpaces[3]).does.not.haveOwnPropertyDescriptor('excavator');

    const game2 = Game.deserialize(serialized);
    const deserializedSpaces = game2.board.spaces.filter((space) => spaceIds.includes(space.id));
    expect(deserializedSpaces[0].undergroundResources).eq('data3');
    expect(deserializedSpaces[1].undergroundResources).eq('corruption2');
    expect(deserializedSpaces[2].undergroundResources).eq('ocean');
    expect(deserializedSpaces[3]).does.not.haveOwnPropertyDescriptor('undergroundResources');
    expect(deserializedSpaces[0].excavator?.id).eq('p-player1-id');
    expect(deserializedSpaces[1].excavator?.id).eq('p-player2-id');
    expect(deserializedSpaces[2]).does.not.haveOwnPropertyDescriptor('excavator');
    expect(deserializedSpaces[3]).does.not.haveOwnPropertyDescriptor('excavator');
  });
});
