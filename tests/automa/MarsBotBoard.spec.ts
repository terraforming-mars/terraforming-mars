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

  it('maps Building tag to track 0', () => {
    expect(board.getTrackIndexForTag(Tag.BUILDING)).to.eq(0);
  });

  it('maps Space tag to track 1', () => {
    expect(board.getTrackIndexForTag(Tag.SPACE)).to.eq(1);
  });

  it('maps Event tag to track 2', () => {
    expect(board.getTrackIndexForTag(Tag.EVENT)).to.eq(2);
  });

  it('maps Science tag to track 3', () => {
    expect(board.getTrackIndexForTag(Tag.SCIENCE)).to.eq(3);
  });

  it('maps Power/Jovian to track 4', () => {
    expect(board.getTrackIndexForTag(Tag.POWER)).to.eq(4);
    expect(board.getTrackIndexForTag(Tag.JOVIAN)).to.eq(4);
  });

  it('maps Earth/City to track 5', () => {
    expect(board.getTrackIndexForTag(Tag.EARTH)).to.eq(5);
    expect(board.getTrackIndexForTag(Tag.CITY)).to.eq(5);
  });

  it('maps Plant/Animal/Microbe to track 6', () => {
    expect(board.getTrackIndexForTag(Tag.PLANT)).to.eq(6);
    expect(board.getTrackIndexForTag(Tag.ANIMAL)).to.eq(6);
    expect(board.getTrackIndexForTag(Tag.MICROBE)).to.eq(6);
  });

  it('returns undefined for unmapped tags', () => {
    expect(board.getTrackIndexForTag(Tag.VENUS)).to.be.undefined;
    expect(board.getTrackIndexForTag(Tag.WILD)).to.be.undefined;
  });
});

describe('MarsBotTrack', () => {
  it('starts at position 0', () => {
    const track = new MarsBotTrack(THARSIS_MARSBOT_BOARD.trackDefs[0]);
    expect(track.position).to.eq(0);
  });

  it('can advance and returns action at position', () => {
    const track = new MarsBotTrack(THARSIS_MARSBOT_BOARD.trackDefs[0]);
    // Building track layout: [undef, undef, 'ocean', undef, undef, 'tr2', ...]
    const r1 = track.advance();
    expect(r1.type).to.eq('none');
    expect(track.position).to.eq(1);

    const r2 = track.advance();
    expect(r2.type).to.eq('action');
    if (r2.type === 'action') {
      expect(r2.action).to.eq('ocean');
    }
    expect(track.position).to.eq(2);

    expect(track.advance().type).to.eq('none'); // pos 3
    expect(track.advance().type).to.eq('none'); // pos 4
    const r5 = track.advance(); // pos 5: tr2
    expect(r5.type).to.eq('action');
    if (r5.type === 'action') {
      expect(r5.action).to.eq('tr2');
    }
    expect(track.position).to.eq(5);
  });

  it('returns maxed when at max position', () => {
    const track = new MarsBotTrack(THARSIS_MARSBOT_BOARD.trackDefs[0]);
    for (let i = 0; i < 18; i++) {
      track.advance();
    }
    expect(track.position).to.eq(18);
    expect(track.canAdvance()).to.be.false;
    expect(track.advance().type).to.eq('maxed');
    expect(track.position).to.eq(18);
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
    const result = track.advance(); // pos 3 (was regressed, skip action)
    expect(result.type).to.eq('none');
    expect(track.regressedPositions.has(3)).to.be.false;
  });

  it('advance returns action, regress and re-advance skips it', () => {
    const track = new MarsBotTrack(THARSIS_MARSBOT_BOARD.trackDefs[0]);
    track.advance(); // pos 1
    const r = track.advance(); // pos 2: ocean
    expect(r.type).to.eq('action');

    track.regress(); // back to pos 1
    expect(track.position).to.eq(1);

    const r2 = track.advance(); // pos 2 again, but regressed → skipped
    expect(r2.type).to.eq('none');
  });

  it('peek shows next position action without advancing', () => {
    const track = new MarsBotTrack(THARSIS_MARSBOT_BOARD.trackDefs[0]);
    // pos 0, next is pos 1 which is undefined
    expect(track.peek()).to.be.undefined;

    track.advance(); // pos 1
    // next is pos 2 which is 'ocean'
    expect(track.peek()).to.eq('ocean');
    expect(track.position).to.eq(1);
  });

  it('peek returns undefined at max position', () => {
    const track = new MarsBotTrack(THARSIS_MARSBOT_BOARD.trackDefs[0]);
    for (let i = 0; i < 18; i++) {
      track.advance();
    }
    expect(track.peek()).to.be.undefined;
  });

  it('peek after regression still shows the layout action', () => {
    const track = new MarsBotTrack(THARSIS_MARSBOT_BOARD.trackDefs[0]);
    track.advance(); // pos 1
    track.advance(); // pos 2 (ocean)
    track.regress(); // back to pos 1, pos 2 is regressed

    // peek looks at pos 2 which has 'ocean' in layout
    // peek does NOT check regression markers — it shows raw layout
    expect(track.peek()).to.eq('ocean');
  });
});
