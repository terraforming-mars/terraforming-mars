import {expect} from 'chai';
import {TrackAction, TrackDefinition} from '@/common/automa/AutomaTypes';
import {CardResource} from '@/common/CardResource';
import {CardType} from '@/common/cards/CardType';
import {Tag} from '@/common/cards/Tag';
import {Phase} from '@/common/Phase';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {MarsBotBoard} from '@/server/automa/MarsBotBoard';
import {MarsBotTilePlacer} from '@/server/automa/MarsBotTilePlacer';
import {MarsBotTurnResolver} from '@/server/automa/MarsBotTurnResolver';
import {THARSIS_MARSBOT_BOARD} from '@/server/automa/boards/TharsisMarsBot';
import {Splice} from '@/server/cards/promo/Splice';
import {testGame} from '../TestGame';
import {fakeCard, maxOutOceans, runAllActions, setTemperature} from '../TestingUtils';
import {recordingMarsBot} from './corps/RecordingMarsBot';

/** The Tharsis tracks without their icons, with `action` on space 1 of the Building track. */
function tracksWith(action?: TrackAction): ReadonlyArray<TrackDefinition> {
  return THARSIS_MARSBOT_BOARD.map((definition, index) => {
    const layout: Array<TrackAction | undefined> = new Array(19).fill(undefined);
    if (index === 0) {
      layout[1] = action;
    }
    return {...definition, layout};
  });
}

/** A resolver on a bot that records the calls it gets, and the notices for its corp in `notices`. */
function setup(action?: TrackAction, fields: Partial<IMarsBot> = {}) {
  const [game, human, botPlayer] = testGame(2);
  const notices: Array<string> = [];
  const {marsBot, calls} = recordingMarsBot({
    game,
    player: botPlayer,
    humanPlayer: human,
    marsBotBoard: new MarsBotBoard(tracksWith(action)),
    megacredits: 0,
    failedActionMc: 5,
    interceptsParameterRaise: () => false,
    triggerTrackCube: () => false,
    notifyTagResolved: (tag) => notices.push(`notifyTagResolved(${tag})`),
    notifyProjectCardResolved: (card) => notices.push(`notifyProjectCardResolved(${card.name})`),
    notifyTrackSpaceResolved: (trackIndex, position) => notices.push(`notifyTrackSpaceResolved(${trackIndex}, ${position})`),
    notifyFailedAction: () => notices.push('notifyFailedAction()'),
    ...fields,
  });
  const resolver = new MarsBotTurnResolver(marsBot, new MarsBotTilePlacer(marsBot));
  const positions = () => marsBot.marsBotBoard.tracks.map((track) => track.position);
  return {game, human, botPlayer, marsBot, calls, notices, resolver, positions};
}

describe('MarsBotTurnResolver', () => {
  for (const run of [
    {tags: [Tag.BUILDING, Tag.SPACE], type: CardType.AUTOMATED, expected: [1, 1, 0, 0, 0, 0, 0]},
    {tags: [Tag.SPACE], type: CardType.EVENT, expected: [0, 1, 1, 0, 0, 0, 0]},
    {tags: [Tag.WILD], type: CardType.AUTOMATED, expected: [1, 0, 0, 0, 0, 0, 0]},
    {tags: [Tag.VENUS], type: CardType.AUTOMATED, expected: [0, 0, 0, 0, 0, 0, 0]},
  ] as const) {
    it('advances the track of each tag on the card: ' + JSON.stringify(run), () => {
      const {resolver, positions} = setup();

      resolver.resolveProjectCard(fakeCard({tags: [...run.tags], type: run.type}));

      expect(positions()).deep.eq(run.expected);
    });
  }

  it('advances only the first tag with firstTagOnly', () => {
    const {resolver, positions} = setup();

    resolver.resolveProjectCard(fakeCard({tags: [Tag.BUILDING, Tag.SPACE]}), true);

    expect(positions()).deep.eq([1, 0, 0, 0, 0, 0, 0]);
  });

  it('takes a Failed Action for a card with no tags', () => {
    const {resolver, calls, notices} = setup();
    const card = fakeCard({tags: []});

    resolver.resolveProjectCard(card);

    expect(calls).deep.eq(['gainMc(5)']);
    expect(notices).deep.eq(['notifyFailedAction()', `notifyProjectCardResolved(${card.name})`]);
  });

  it("tells MarsBot's corp about the tag, the space it reached and the card", () => {
    const {resolver, notices} = setup();
    const card = fakeCard({tags: [Tag.BUILDING]});

    resolver.resolveProjectCard(card);

    expect(notices).deep.eq(['notifyTagResolved(building)', 'notifyTrackSpaceResolved(0, 1)', `notifyProjectCardResolved(${card.name})`]);
  });

  it("runs the player's card effects for MarsBot's card, which holds no resources for MarsBot", () => {
    const {game, human, botPlayer, resolver} = setup();
    human.playedCards.push(new Splice());

    resolver.resolveProjectCard(fakeCard({tags: [Tag.MICROBE], resourceType: CardResource.MICROBE}));
    runAllActions(game);

    expect(human.megaCredits).eq(2);
    expect(botPlayer.popWaitingFor()).is.undefined;
  });

  for (const run of [
    {action: 'milestone', expected: ['maybeClaimMilestone()']},
    {action: 'award', expected: ['maybeFundAward()']},
    {action: 'temperature', expected: ['raiseTemperature(1)']},
    {action: 'temperature2', expected: ['raiseTemperature(2)']},
  ] as const) {
    it('resolves the icon of the space the track reaches through MarsBot: ' + JSON.stringify(run), () => {
      const {resolver, calls} = setup(run.action);

      resolver.advanceTrack(0);

      expect(calls).deep.eq(run.expected);
    });
  }

  for (const run of [
    {action: 'tr2', expected: {terraformRating: 22, positions: [1, 0, 0, 0, 0, 0, 0]}},
    {action: 'advance', expected: {terraformRating: 20, positions: [2, 0, 0, 0, 0, 0, 0]}},
    {action: 'tag_6', expected: {terraformRating: 20, positions: [1, 0, 0, 0, 0, 0, 1]}},
    {action: 'tag_earth', expected: {terraformRating: 20, positions: [1, 0, 0, 0, 0, 1, 0]}},
  ] as const) {
    it('raises the TR or moves a track for the icon of the space reached: ' + JSON.stringify(run), () => {
      const {botPlayer, resolver, positions} = setup(run.action);

      resolver.advanceTrack(0);

      expect({terraformRating: botPlayer.terraformRating, positions: positions()}).deep.eq(run.expected);
    });
  }

  for (const run of [
    {action: 'greenery', expected: {greeneries: 1, cities: 0, oceans: 0, oxygen: 1}},
    {action: 'city', expected: {greeneries: 0, cities: 1, oceans: 0, oxygen: 0}},
    {action: 'ocean', expected: {greeneries: 0, cities: 0, oceans: 1, oxygen: 0}},
  ] as const) {
    it('places a tile for MarsBot for the icon of the space reached: ' + JSON.stringify(run), () => {
      const {game, botPlayer, resolver} = setup(run.action);

      resolver.advanceTrack(0);

      expect({
        greeneries: game.board.getGreeneries(botPlayer).length,
        cities: game.board.getCities(botPlayer).length,
        oceans: game.board.getOceanSpaces().length,
        oxygen: game.getOxygenLevel(),
      }).deep.eq(run.expected);
    });
  }

  for (const run of [
    {name: 'a maxed track', action: undefined, fields: {}},
    {name: 'no milestone to claim', action: 'milestone', fields: {maybeClaimMilestone: () => false}},
    {name: 'no award to fund', action: 'award', fields: {maybeFundAward: () => false}},
    {name: 'a maxed temperature', action: 'temperature', fields: {}},
    {name: 'no ocean left', action: 'ocean', fields: {}},
  ] as const) {
    it('takes a Failed Action when the space reached cannot resolve: ' + JSON.stringify(run), () => {
      const {game, human, marsBot, resolver, calls, notices} = setup(run.action, run.fields);
      if (run.name === 'a maxed track') {
        marsBot.marsBotBoard.tracks[0].position = 18;
      }
      if (run.name === 'a maxed temperature') {
        setTemperature(game, 8);
      }
      if (run.name === 'no ocean left') {
        maxOutOceans(human);
      }

      resolver.advanceTrack(0);

      expect(calls).deep.eq(['gainMc(5)']);
      expect(notices).includes('notifyFailedAction()');
    });
  }

  it('leaves the icon unresolved when a corp cube replaces it', () => {
    const {botPlayer, resolver} = setup('tr2', {triggerTrackCube: () => true});

    resolver.advanceTrack(0);

    expect(botPlayer.terraformRating).eq(20);
  });

  it('places no ocean, and takes no Failed Action, when the corp cancels the raise', () => {
    const {game, resolver, calls} = setup('ocean', {interceptsParameterRaise: () => true});

    resolver.advanceTrack(0);

    expect(game.board.getOceanSpaces()).is.empty;
    expect(calls).is.empty;
  });

  it("doesn't tell the corp about a space the track regressed from", () => {
    const {marsBot, resolver, notices} = setup();
    marsBot.marsBotBoard.tracks[0].regressedPositions.add(1);

    resolver.advanceTrack(0);

    expect(notices).is.empty;
  });

  it('moves no track once the game has ended', () => {
    const {game, resolver, calls, positions} = setup();
    game.phase = Phase.END;

    resolver.resolveProjectCard(fakeCard({tags: [Tag.BUILDING]}));

    expect(positions()).deep.eq([0, 0, 0, 0, 0, 0, 0]);
    expect(calls).is.empty;
  });
});
