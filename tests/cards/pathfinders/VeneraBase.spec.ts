import {expect} from 'chai';
import {VeneraBase} from '../../../src/cards/pathfinders/VeneraBase';
import {Game} from '../../../src/Game';
import {TestPlayer} from '../../TestPlayer';
import {TileType} from '../../../src/TileType';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {Turmoil} from '../../../src/turmoil/Turmoil';
import {Greens} from '../../../src/turmoil/parties/Greens';
import {Unity} from '../../../src/turmoil/parties/Unity';
import {Units} from '../../../src/Units';
import {SpaceName} from '../../../src/SpaceName';
import {IProjectCard} from '../../../src/cards/IProjectCard';
import {TitanShuttles} from '../../../src/cards/colonies/TitanShuttles';
import {FloatingHabs} from '../../../src/cards/venusNext/FloatingHabs';
import {Stratopolis} from '../../../src/cards/venusNext/Stratopolis';
import {MartianCulture} from '../../../src/cards/pathfinders/MartianCulture';
import {SelectCard} from '../../../src/inputs/SelectCard';

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
    expect(player.getProductionForTest()).deep.eq(Units.EMPTY);
    const space = game.board.getSpace(SpaceName.VENERA_BASE);
    expect(space.tile).is.undefined;
    expect(space.player).is.undefined;

    card.play(player);

    expect(player.getProductionForTest()).deep.eq(Units.of({megacredits: 3}));
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

    const action = game.deferredActions.pop()?.execute();
    expect(action).is.instanceOf(SelectCard);
    const selectCard = action as SelectCard<IProjectCard>;
    expect(selectCard.cards).to.have.members([venusFloater, venusFloater2]);

    selectCard.cb([venusFloater]);
    expect(venusFloater.resourceCount).eq(1);
    selectCard.cb([venusFloater2]);
    expect(venusFloater2.resourceCount).eq(1);
  });
});
