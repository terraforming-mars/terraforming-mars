import {expect} from 'chai';
import {ResearchAndDevelopmentMarsBot} from '@/server/automa/bonusCards/ResearchAndDevelopmentMarsBot';
import {IProjectCard} from '@/server/cards/IProjectCard';
import {Mine} from '@/server/cards/base/Mine';
import {recordingMarsBot} from '../corps/RecordingMarsBot';

describe('ResearchAndDevelopmentMarsBot', () => {
  it('resolves the top project card', () => {
    const played: Array<IProjectCard> = [];
    const {marsBot} = recordingMarsBot({resolveProjectCard: (card) => played.push(card)});
    const mine = new Mine();
    marsBot.game.projectDeck.drawPile.push(mine);

    const destroyed = new ResearchAndDevelopmentMarsBot().resolve(marsBot);

    expect(played).deep.eq([mine]);
    expect(destroyed).is.false;
  });
});
