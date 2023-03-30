import {expect} from 'chai';
import {CassiniStation} from '../../../src/server/cards/pathfinders/CassiniStation';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {Leavitt} from '../../../src/server/cards/community/Leavitt';
import {Mercury} from '../../../src/server/cards/community/Mercury';
import {Units} from '../../../src/common/Units';
import {IProjectCard} from '../../../src/server/cards/IProjectCard';
import {TitanShuttles} from '../../../src/server/cards/colonies/TitanShuttles';
import {FloatingHabs} from '../../../src/server/cards/venusNext/FloatingHabs';
import {MartianCulture} from '../../../src/server/cards/pathfinders/MartianCulture';
import {EconomicEspionage} from '../../../src/server/cards/pathfinders/EconomicEspionage';
import {SearchForLife} from '../../../src/server/cards/base/SearchForLife';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {cast} from '../../TestingUtils';

describe('CassiniStation', function() {
  let card: CassiniStation;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: Game;

  let floater1: IProjectCard;
  let floater2: IProjectCard;
  let data1: IProjectCard;
  let data2: IProjectCard;
  let other: IProjectCard;

  beforeEach(function() {
    card = new CassiniStation();
    [game, player, player2] = testGame(2);
    floater1 = new TitanShuttles();
    floater2 = new FloatingHabs();
    data1 = new MartianCulture();
    data2 = new EconomicEspionage();
    other = new SearchForLife();
  });

  it('play', function() {
    const colonyTile1 = new Leavitt();
    const colonyTile2 = new Mercury();
    game.colonies = [colonyTile1, colonyTile2];
    const options = card.play(player);
    expect(player.production.asUnits()).deep.eq(Units.of({energy: 0}));
    expect(options).is.undefined;

    colonyTile1.colonies.push(player.id);

    card.play(player);

    expect(player.production.asUnits()).deep.eq(Units.of({energy: 1}));

    player.production.override(Units.EMPTY);
    colonyTile2.colonies.push(player.id);
    colonyTile2.colonies.push(player2.id);

    card.play(player);

    expect(player.production.asUnits()).deep.eq(Units.of({energy: 3}));
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
    const options = cast(card.play(player), SelectCard);

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
