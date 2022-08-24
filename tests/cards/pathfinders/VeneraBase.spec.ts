import {expect} from 'chai';
import {VeneraBase} from '../../../src/server/cards/pathfinders/VeneraBase';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {TileType} from '../../../src/common/TileType';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {Turmoil} from '../../../src/server/turmoil/Turmoil';
import {Greens} from '../../../src/server/turmoil/parties/Greens';
import {Unity} from '../../../src/server/turmoil/parties/Unity';
import {Units} from '../../../src/common/Units';
import {SpaceName} from '../../../src/server/SpaceName';
import {IProjectCard} from '../../../src/server/cards/IProjectCard';
import {TitanShuttles} from '../../../src/server/cards/colonies/TitanShuttles';
import {FloatingHabs} from '../../../src/server/cards/venusNext/FloatingHabs';
import {Stratopolis} from '../../../src/server/cards/venusNext/Stratopolis';
import {MartianCulture} from '../../../src/server/cards/pathfinders/MartianCulture';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {cast} from '../../TestingUtils';

describe('VeneraBase', function() {
  let card: VeneraBase;
  let player: TestPlayer;
  let game: Game;
  let nonVenusFloater: IProjectCard;
  let venusFloater: IProjectCard;
  let venusFloater2: IProjectCard;
  let data: IProjectCard;

  beforeEach(function() {
    card = new VeneraBase();
    game = newTestGame(1, {turmoilExtension: true, pathfindersExpansion: true});
    player = getTestPlayer(game, 0);

    nonVenusFloater = new TitanShuttles();
    venusFloater = new FloatingHabs();
    venusFloater2 = new Stratopolis();
    data = new MartianCulture();
  });

  it('canPlay', function() {
    player.megaCredits = card.cost;
    const turmoil = Turmoil.getTurmoil(player.game);
    turmoil.rulingParty = new Greens();
    expect(player.canPlay(card)).is.false;
    turmoil.rulingParty = new Unity();
    expect(player.canPlay(card)).is.true;
  });

  it('play', function() {
    expect(player.production.asUnits()).deep.eq(Units.EMPTY);
    const space = game.board.getSpace(SpaceName.VENERA_BASE);
    expect(space.tile).is.undefined;
    expect(space.player).is.undefined;

    card.play(player);

    expect(player.production.asUnits()).deep.eq(Units.of({megacredits: 3}));
    expect(space.tile?.tileType).eq(TileType.CITY);
    expect(space.player?.id).eq(player.id);
  });

  it('canAct', function() {
    expect(card.canAct(player)).is.false;
    player.playedCards = [data];
    expect(card.canAct(player)).is.false;
    player.playedCards = [nonVenusFloater];
    expect(card.canAct(player)).is.false;
    player.playedCards = [venusFloater];
    expect(card.canAct(player)).is.true;
  });

  it('action', function() {
    player.playedCards = [venusFloater, venusFloater2, data, nonVenusFloater];

    card.action(player);

    const selectCard = cast(game.deferredActions.pop()?.execute(), SelectCard);
    expect(selectCard.cards).to.have.members([venusFloater, venusFloater2]);

    selectCard.cb([venusFloater]);
    expect(venusFloater.resourceCount).eq(1);
    selectCard.cb([venusFloater2]);
    expect(venusFloater2.resourceCount).eq(1);
  });
});
