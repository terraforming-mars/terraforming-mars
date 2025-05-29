import {expect} from 'chai';
import {VeneraBase} from '../../../src/server/cards/pathfinders/VeneraBase';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {TileType} from '../../../src/common/TileType';
import {testGame} from '../../TestGame';
import {Turmoil} from '../../../src/server/turmoil/Turmoil';
import {Greens} from '../../../src/server/turmoil/parties/Greens';
import {Unity} from '../../../src/server/turmoil/parties/Unity';
import {Units} from '../../../src/common/Units';
import {SpaceName} from '../../../src/common/boards/SpaceName';
import {IProjectCard} from '../../../src/server/cards/IProjectCard';
import {TitanShuttles} from '../../../src/server/cards/colonies/TitanShuttles';
import {FloatingHabs} from '../../../src/server/cards/venusNext/FloatingHabs';
import {Stratopolis} from '../../../src/server/cards/venusNext/Stratopolis';
import {MartianCulture} from '../../../src/server/cards/pathfinders/MartianCulture';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {cast, churn} from '../../TestingUtils';

describe('VeneraBase', () => {
  let card: VeneraBase;
  let player: TestPlayer;
  let game: IGame;
  let nonVenusFloater: IProjectCard;
  let venusFloater: IProjectCard;
  let venusFloater2: IProjectCard;
  let data: IProjectCard;

  beforeEach(() => {
    card = new VeneraBase();
    [game, player] = testGame(1, {venusNextExtension: true, turmoilExtension: true, pathfindersExpansion: true});

    nonVenusFloater = new TitanShuttles();
    venusFloater = new FloatingHabs();
    venusFloater2 = new Stratopolis();
    data = new MartianCulture();
  });

  it('canPlay', () => {
    player.megaCredits = card.cost;
    const turmoil = Turmoil.getTurmoil(player.game);
    turmoil.rulingParty = new Greens();
    expect(player.canPlay(card)).is.false;
    turmoil.rulingParty = new Unity();
    expect(player.canPlay(card)).is.true;
  });

  it('play', () => {
    expect(player.production.asUnits()).deep.eq(Units.EMPTY);
    const space = game.board.getSpaceOrThrow(SpaceName.VENERA_BASE);
    expect(space.tile).is.undefined;
    expect(space.player).is.undefined;

    card.play(player);

    expect(player.production.asUnits()).deep.eq(Units.of({megacredits: 3}));
    expect(space.tile?.tileType).eq(TileType.CITY);
    expect(space.player?.id).eq(player.id);
  });

  it('canAct', () => {
    expect(card.canAct(player)).is.false;
    player.playedCards = [data];
    expect(card.canAct(player)).is.false;
    player.playedCards = [nonVenusFloater];
    expect(card.canAct(player)).is.false;
    player.playedCards = [venusFloater];
    expect(card.canAct(player)).is.true;
  });

  it('action', () => {
    player.playedCards = [venusFloater, venusFloater2, data, nonVenusFloater];

    const selectCard = cast(churn(card.action(player), player), SelectCard);
    expect(selectCard.cards).to.have.members([venusFloater, venusFloater2]);

    selectCard.cb([venusFloater]);
    expect(venusFloater.resourceCount).eq(1);
    selectCard.cb([venusFloater2]);
    expect(venusFloater2.resourceCount).eq(1);
  });
});
