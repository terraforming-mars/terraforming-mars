import {expect} from 'chai';
import {testGame} from '../TestGame';
import {RemoveResourcesFromCard, Response} from '../../src/server/deferredActions/RemoveResourcesFromCard';
import {CardResource} from '../../src/common/CardResource';
import {AtmoCollectors} from '../../src/server/cards/colonies/AtmoCollectors';
import {cast} from '@/common/utils/utils';
import {OrOptions} from '../../src/server/inputs/OrOptions';
import {formatMessage, runAllActions} from '../TestingUtils';

// This requires a lot more tests
describe('RemoveResourcesFromCard', () => {
  let response: Response;
  const andThen = (c: Response) => {
    response = c;
  };

  beforeEach(() => {
    response = undefined as unknown as Response;
  });

  it('simple', () => {
    const [/* game */, player] = testGame(3);
    const action = new RemoveResourcesFromCard(player, CardResource.FLOATER, 1, {source: 'self', blockable: false}).andThen(andThen);
    cast(action.execute(), undefined);

    expect(response).deep.eq({card: undefined, owner: undefined, proceed: false});
  });

  it('remove from self', () => {
    const [/* game */, player] = testGame(3);
    const atmoCollectors = new AtmoCollectors();
    player.playedCards.push(atmoCollectors);
    atmoCollectors.resourceCount = 2;
    const action = new RemoveResourcesFromCard(player, CardResource.FLOATER, 1, {source: 'self', blockable: false}).andThen(andThen);
    cast(action.execute(), undefined);

    expect(response).deep.eq({card: atmoCollectors, owner: player, proceed: true});
    expect(atmoCollectors.resourceCount).eq(1);
  });

  it('cannot block mandatory self-removals', () => {
    const [/* game */, player] = testGame(3, {underworldExpansion: true});
    const atmoCollectors = new AtmoCollectors();
    player.playedCards.push(atmoCollectors);
    player.underworldData.corruption = 1;
    atmoCollectors.resourceCount = 2;
    const action = new RemoveResourcesFromCard(player, CardResource.FLOATER, 1, {source: 'self', blockable: false}).andThen(andThen);
    cast(action.execute(), undefined);

    expect(response).deep.eq({card: atmoCollectors, owner: player, proceed: true});
    expect(atmoCollectors.resourceCount).eq(1);
  });
  it('unblockable removal logs', () => {
    const [game, player] = testGame(3);
    const atmoCollectors = new AtmoCollectors();
    player.playedCards.push(atmoCollectors);
    atmoCollectors.resourceCount = 2;
    game.gameLog.length = 0;
    const action = new RemoveResourcesFromCard(player, CardResource.FLOATER, 1, {source: 'self', blockable: false}).andThen(andThen);
    cast(action.execute(), undefined);

    expect(atmoCollectors.resourceCount).eq(1);
    expect(game.gameLog.map(formatMessage)).deep.eq([`${player.color} removed 1 resource(s) from ${player.color}'s Atmo Collectors`]);
  });

  it('unblockable removal from opponent cannot be blocked', () => {
    const [game, player, opponent] = testGame(3, {underworldExpansion: true});
    const atmoCollectors = new AtmoCollectors();
    opponent.playedCards.push(atmoCollectors);
    opponent.underworldData.corruption = 1;
    atmoCollectors.resourceCount = 2;
    const action = new RemoveResourcesFromCard(player, CardResource.FLOATER, 1, {source: 'opponents', blockable: false}).andThen(andThen);
    cast(action.execute(), undefined);

    expect(response).deep.eq({card: atmoCollectors, owner: opponent, proceed: true});
    expect(atmoCollectors.resourceCount).eq(1);
    runAllActions(game);
    cast(opponent.popWaitingFor(), undefined);
  });

  it('blockable removal from opponent can be blocked', () => {
    const [game, player, opponent] = testGame(3, {underworldExpansion: true});
    const atmoCollectors = new AtmoCollectors();
    opponent.playedCards.push(atmoCollectors);
    opponent.underworldData.corruption = 1;
    atmoCollectors.resourceCount = 2;
    const action = new RemoveResourcesFromCard(player, CardResource.FLOATER, 1, {source: 'opponents'}).andThen(andThen);
    cast(action.execute(), undefined);
    expect(response).is.undefined;

    runAllActions(game);
    const orOptions = cast(opponent.popWaitingFor(), OrOptions);
    orOptions.options[0].cb();

    expect(response).deep.eq({card: atmoCollectors, owner: opponent, proceed: false});
    expect(atmoCollectors.resourceCount).eq(2);
    expect(opponent.underworldData.corruption).eq(0);
  });
  it('blockable removal logs when not blocked', () => {
    const [game, player, opponent] = testGame(3, {underworldExpansion: true});
    const atmoCollectors = new AtmoCollectors();
    opponent.playedCards.push(atmoCollectors);
    opponent.underworldData.corruption = 1;
    atmoCollectors.resourceCount = 2;
    const action = new RemoveResourcesFromCard(player, CardResource.FLOATER, 1, {source: 'opponents'}).andThen(andThen);
    cast(action.execute(), undefined);

    runAllActions(game);
    const orOptions = cast(opponent.popWaitingFor(), OrOptions);
    game.gameLog.length = 0;
    orOptions.options[1].cb();

    expect(response).deep.eq({card: atmoCollectors, owner: opponent, proceed: true});
    expect(atmoCollectors.resourceCount).eq(1);
    expect(game.gameLog.map(formatMessage)).deep.eq([`${player.color} removed 1 resource(s) from ${opponent.color}'s Atmo Collectors`]);
  });
});
