import {expect} from 'chai';
import {IGame} from '../../src/server/IGame';
import {EmptyBoard} from '../testing/EmptyBoard';
import {toID} from '../../src//common/utils/utils';
import {Decomposers} from '../../src/server/cards/base/Decomposers';
import {EnergyTapping} from '../../src/server/cards/base/EnergyTapping';
import {AresSetup} from '../../src/server/ares/AresSetup';
import {Ants} from '../../src/server/cards/base/Ants';
import {Birds} from '../../src/server/cards/base/Birds';
import {testGame} from '../TestGame';
import {CaretakerContract} from '../../src/server/cards/base/CaretakerContract';
import {SpaceId} from '../../src/common/Types';

describe('AresSetup', () => {
  function spacesWithTiles(game: IGame): Array<SpaceId> {
    return game.board.spaces.filter((space) => space.tile !== undefined).map(toID);
  }

  it('4 player game', () => {
    const [game] = testGame(4, {aresExtension: true, aresHazards: false});
    game.board = EmptyBoard.newInstance();

    // front-load the deck with cards of predetermined costs.
    // four player game places two dust storms.

    const deck = game.projectDeck.drawPile;
    deck.push(new EnergyTapping()); // Cost 3, drawn second.
    deck.push(new Decomposers()); // Cost 5, drawn first.

    AresSetup.setupHazards(game);

    expect(spacesWithTiles(game)).to.deep.eq(['07', '61']);
  });

  it('5 player game', () => {
    const [game] = testGame(5, {aresExtension: true});
    game.board = EmptyBoard.newInstance();

    // front-load the deck with cards of predetermined costs.
    // 5 player game places one dust storm but with two cards.

    const deck = game.projectDeck.drawPile;
    deck.push(new EnergyTapping()); // Cost 3, drawn second.
    deck.push(new Decomposers()); // Cost 5, drawn first.

    AresSetup.setupHazards(game);

    expect(spacesWithTiles(game)).to.deep.eq(['10']);
  });

  it('3 player game', () => {
    const [game] = testGame(3, {aresExtension: true});
    game.board = EmptyBoard.newInstance();

    // front-load the deck with cards of predetermined costs.
    // 3 player game places 3 dust storms, the first with two cards.

    const deck = game.projectDeck.drawPile;
    deck.push(new EnergyTapping()); // Cost 3, drawn fourth.
    deck.push(new Decomposers()); // Cost 5, drawn third.
    deck.push(new Ants()); // Cost 9, drawn second
    deck.push(new Birds()); // Cost 10, drawn first.

    AresSetup.setupHazards(game);

    expect(spacesWithTiles(game)).to.deep.eq(['07', '21', '61']);
  });

  const skipNomadRuns = [
    {nomadSpace: '09', hazardSpace: '08'},
    {nomadSpace: '08', hazardSpace: '09'},
  ] as const;
  for (const run of skipNomadRuns) {
    it('Hazards skip Mars Nomads ' + JSON.stringify(run), () => {
      const [game] = testGame(5, {aresExtension: true});
      game.board = EmptyBoard.newInstance();
      game.projectDeck.drawPile.push(new CaretakerContract(), new EnergyTapping());

      game.nomadSpace = run.nomadSpace;
      AresSetup.setupHazards(game);

      expect(spacesWithTiles(game)).to.deep.eq([run.hazardSpace]);
    });
  }
});

