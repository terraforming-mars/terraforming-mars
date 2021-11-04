import {expect} from 'chai';
import {CassiniStation} from '../../../src/cards/pathfinders/CassiniStation';
import {Game} from '../../../src/Game';
import {TestPlayer} from '../../TestPlayer';
import {newTestGame} from '../../TestGame';
import {Leavitt} from '../../../src/cards/community/Leavitt';
import {Mercury} from '../../../src/cards/community/Mercury';
import {Callisto} from '../../../src/colonies/Callisto';
import {Units} from '../../../src/Units';
import {IProjectCard} from '../../../src/cards/IProjectCard';
import {TitanShuttles} from '../../../src/cards/colonies/TitanShuttles';
import {FloatingHabs} from '../../../src/cards/venusNext/FloatingHabs';
import {MartianCulture} from '../../../src/cards/pathfinders/MartianCulture';
import {EconomicEspionage} from '../../../src/cards/pathfinders/EconomicEspionage';
import {SearchForLife} from '../../../src/cards/base/SearchForLife';

describe('CassiniStation', function() {
  let card: CassiniStation;
  let player: TestPlayer;
  let game: Game;

  let floater1: IProjectCard;
  let floater2: IProjectCard;
  let data1: IProjectCard;
  let data2: IProjectCard;
  let other: IProjectCard;

  beforeEach(function() {
    card = new CassiniStation();
    game = newTestGame(1);
    player = game.getPlayers()[0] as TestPlayer;
    floater1 = new TitanShuttles();
    floater2 = new FloatingHabs();
    data1 = new MartianCulture();
    data2 = new EconomicEspionage();
    other = new SearchForLife();
  });

  it('play', function() {
    game.colonies = [new Leavitt(), new Mercury(), new Callisto()];
    const options = card.play(player);
    expect(player.getProductionForTest()).deep.eq(Units.of({energy: 3}));
    expect(options).is.undefined;
  });

  it('play - one floater card', function() {
    player.playedCards = [floater1];
    const options = card.play(player);
    expect(options).is.undefined;
    expect(floater1.resourceCount).eq(2);
  });

  it('play - one data card', function() {
    player.playedCards = [data1];
    const options = card.play(player);
    expect(options).is.undefined;
    expect(data1.resourceCount).eq(3);
  });

  it('play - all', function() {
    player.playedCards = [floater1, floater2, data1, data2, other];
    const options = card.play(player);

    expect(options?.cards.length).eq(4);

    options?.cb([options.cards[0]]);
    expect(floater1.resourceCount).eq(2);

    options?.cb([options.cards[1]]);
    expect(floater2.resourceCount).eq(2);

    options?.cb([options.cards[2]]);
    expect(data1.resourceCount).eq(3);

    options?.cb([options.cards[3]]);
    expect(data2.resourceCount).eq(3);
  });
});
