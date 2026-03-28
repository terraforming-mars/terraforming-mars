import {expect} from 'chai';
import {Tag} from '../../src/common/cards/Tag';
import {MarsBotBoard, MarsBotTrack} from '../../src/server/automa/MarsBotBoard';
import {THARSIS_MARSBOT_BOARD} from '../../src/server/automa/boards/TharsisMarsBot';

describe('MarsBotBoard', () => {
  let board: MarsBotBoard;

  beforeEach(() => {
    board = new MarsBotBoard(THARSIS_MARSBOT_BOARD);
  });

  it('has 7 tracks', () => {
    expect(board.tracks.length).to.eq(7);
  });

  it('maps Building tag to track 0 (Track 1)', () => {
    expect(board.getTrackIndexForTag(Tag.BUILDING)).to.eq(0);
  });

  it('maps Space tag to track 1 (Track 2)', () => {
    expect(board.getTrackIndexForTag(Tag.SPACE)).to.eq(1);
  });

  it('maps Event tag to track 2 (Track 3)', () => {
    expect(board.getTrackIndexForTag(Tag.EVENT)).to.eq(2);
  });

  it('maps Science tag to track 3 (Track 4)', () => {
    expect(board.getTrackIndexForTag(Tag.SCIENCE)).to.eq(3);
  });

  it('maps Power/Jovian to track 4 (Track 5)', () => {
    expect(board.getTrackIndexForTag(Tag.POWER)).to.eq(4);
    expect(board.getTrackIndexForTag(Tag.JOVIAN)).to.eq(4);
  });

  it('maps Earth/City to track 5 (Track 6)', () => {
    expect(board.getTrackIndexForTag(Tag.EARTH)).to.eq(5);
    expect(board.getTrackIndexForTag(Tag.CITY)).to.eq(5);
  });

  it('maps Plant/Animal/Microbe to track 6 (Track 7)', () => {
    expect(board.getTrackIndexForTag(Tag.PLANT)).to.eq(6);
    expect(board.getTrackIndexForTag(Tag.ANIMAL)).to.eq(6);
    expect(board.getTrackIndexForTag(Tag.MICROBE)).to.eq(6);
  });

  it('returns undefined for unmapped tags', () => {
    expect(board.getTrackIndexForTag(Tag.VENUS)).to.be.undefined;
    expect(board.getTrackIndexForTag(Tag.WILD)).to.be.undefined;
  });

  it('getTrack returns correct track by 1-based number', () => {
    const track1 = board.getTrack(1);
    expect(track1.definition.num).to.eq(1);
    expect(track1.definition.tags).to.include(Tag.BUILDING);
  });
});

describe('MarsBotTrack', () => {
  it('starts at position 0', () => {
    const track = new MarsBotTrack(THARSIS_MARSBOT_BOARD.trackDefs[0]);
    expect(track.position).to.eq(0);
  });

  it('can advance and returns action at position', () => {
    const track = new MarsBotTrack(THARSIS_MARSBOT_BOARD.trackDefs[0]);
    // Track 1 layout: [null, null, 'ocean', null, null, 'tr2', ...]
    expect(track.advance()).to.be.null; // pos 1: null
    expect(track.position).to.eq(1);

    expect(track.advance()).to.eq('ocean'); // pos 2: ocean
    expect(track.position).to.eq(2);

    expect(track.advance()).to.be.null; // pos 3: null
    expect(track.advance()).to.be.null; // pos 4: null
    expect(track.advance()).to.eq('tr2'); // pos 5: tr2
    expect(track.position).to.eq(5);

    expect(track.advance()).to.eq('temperature'); // pos 6: temperature
  });

  it('cannot advance past max position', () => {
    const track = new MarsBotTrack(THARSIS_MARSBOT_BOARD.trackDefs[0]);
    for (let i = 0; i < 18; i++) track.advance();
    expect(track.position).to.eq(18);
    expect(track.canAdvance()).to.be.false;
    expect(track.advance()).to.be.null;
    expect(track.position).to.eq(18); // Doesn't go past 18
  });

  it('regresses track and marks position', () => {
    const track = new MarsBotTrack(THARSIS_MARSBOT_BOARD.trackDefs[0]);
    track.advance(); // pos 1
    track.advance(); // pos 2 (ocean)
    track.advance(); // pos 3

    track.regress(); // back to pos 2
    expect(track.position).to.eq(2);
    expect(track.regressedPositions.has(3)).to.be.true;

    // When re-advancing to the regressed position, skip the action
    const action = track.advance(); // pos 3 (was regressed, skip action)
    expect(action).to.be.null;
    expect(track.regressedPositions.has(3)).to.be.false;
  });

  it('peekNextAction shows next position action without advancing', () => {
    const track = new MarsBotTrack(THARSIS_MARSBOT_BOARD.trackDefs[0]);
    // pos 0, next is pos 1 which is null
    expect(track.peekNextAction()).to.be.null;

    track.advance(); // pos 1
    // next is pos 2 which is 'ocean'
    expect(track.peekNextAction()).to.eq('ocean');
    expect(track.position).to.eq(1); // Position unchanged
  });
});
