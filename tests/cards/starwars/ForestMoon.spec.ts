import {expect} from 'chai';
import {ForestMoon} from '../../../src/server/cards/starwars/ForestMoon';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {addGreenery, cast, runAllActions} from '../../TestingUtils';
import {SelectPlayer} from '../../../src/server/inputs/SelectPlayer';
import {Fish} from '../../../src/server/cards/base/Fish';

describe('ForestMoon', () => {
  let card: ForestMoon;
  let player: TestPlayer;
  let player2: TestPlayer;
  let player3: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new ForestMoon();
    [game, player, player2, player3] = testGame(3, {starWarsExpansion: true});
  });

  it('Can play', () => {
    addGreenery(player2);
    addGreenery(player2);
    addGreenery(player2);
    player2.production.override({energy: 2});

    expect(card.canPlay(player)).is.false;

    addGreenery(player2);
    expect(card.canPlay(player)).is.true;

    player2.production.override({energy: 1});
    expect(card.canPlay(player)).is.false;
    // Add an animal to any card.',
  });

  it('play, no animals', () => {
    player.production.override({energy: 2});
    player2.production.override({energy: 1});
    player3.production.override({energy: 2});
    cast(card.play(player), undefined);
    runAllActions(game);
    const selectPlayer = cast(player.popWaitingFor(), SelectPlayer);

    expect(selectPlayer.players).has.members([player, player3]);

    selectPlayer.cb(player3);

    expect(player3.production.energy).eq(0);

    runAllActions(game);
    expect(player.popWaitingFor()).is.undefined;
  });

  it('play, animals', () => {
    player3.production.override({energy: 2});
    const fish = new Fish();
    player.playedCards.push(fish);

    cast(card.play(player), undefined);

    runAllActions(game);
    expect(player.popWaitingFor()).is.undefined;
    runAllActions(game);

    expect(player3.production.energy).eq(0);
    expect(fish.resourceCount).eq(1);
  });
});
