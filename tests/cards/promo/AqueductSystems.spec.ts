import {expect} from 'chai';
import {AqueductSystems} from '@/server/cards/promo/AqueductSystems';
import {Tag} from '@/common/cards/Tag';
import {TileType} from '@/common/TileType';
import {SpaceType} from '@/common/boards/SpaceType';
import {IGame} from '@/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('AqueductSystems', () => {
  let card: AqueductSystems;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new AqueductSystems();
    [game, player] = testGame(2);
  });

  it('Cannot play with no city adjacent to an ocean', () => {
    expect(card.canPlay(player)).is.false;
  });

  it('Can play when a city is adjacent to an ocean', () => {
    const oceanSpace = game.board.getAvailableSpacesForOcean(player)[0];
    oceanSpace.tile = {tileType: TileType.OCEAN};

    const citySpace = game.board.getAdjacentSpaces(oceanSpace)[0];
    citySpace.tile = {tileType: TileType.CITY, card: card.name};
    citySpace.player = player;

    expect(card.canPlay(player)).is.true;
  });

  it('Cannot play when the city is not adjacent to any ocean', () => {
    const oceanSpace = game.board.getAvailableSpacesForOcean(player)[0];
    oceanSpace.tile = {tileType: TileType.OCEAN};

    const adjacentSpaces = game.board.getAdjacentSpaces(oceanSpace);
    const farSpace = game.board.spaces.find((space) => {
      return space.spaceType === SpaceType.LAND && space.tile === undefined && !adjacentSpaces.includes(space);
    })!;
    farSpace.tile = {tileType: TileType.CITY, card: card.name};
    farSpace.player = player;

    expect(card.canPlay(player)).is.false;
  });

  it('play', () => {
    expect(player.cardsInHand).has.lengthOf(0);
    card.play(player);
    expect(player.cardsInHand).has.lengthOf(3);

    expect(player.cardsInHand[0].tags).includes(Tag.BUILDING);
    expect(player.cardsInHand[1].tags).includes(Tag.BUILDING);
    expect(player.cardsInHand[2].tags).includes(Tag.BUILDING);
  });
});
