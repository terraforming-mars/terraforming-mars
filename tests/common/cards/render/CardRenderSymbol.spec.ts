import {CardRenderSymbol} from '../../../../src/server/cards/render/CardRenderSymbol';
import {Size} from '../../../../src/common/cards/render/Size';
import {CardRenderSymbolType} from '../../../../src/common/cards/render/CardRenderSymbolType';
import {expect} from 'chai';

const sizeM = Size.MEDIUM;
const sizeS = Size.SMALL;

describe('CardRenderSymbol', () => {
  it('asterix: success', () => {
    const symbol = CardRenderSymbol.asterix();
    expect(symbol.size).to.equal(sizeM);
    expect(symbol.type).to.equal(CardRenderSymbolType.ASTERIX);
  });
  it('or: success', () => {
    const symbol = CardRenderSymbol.or(sizeS);
    expect(symbol.size).to.equal(sizeS);
    expect(symbol.type).to.equal(CardRenderSymbolType.OR);
  });
  it('plus: success', () => {
    const symbol = CardRenderSymbol.plus();
    expect(symbol.size).to.equal(sizeM);
    expect(symbol.isIcon).to.be.true;
    expect(symbol.type).to.equal(CardRenderSymbolType.PLUS);
  });
  it('minus: success', () => {
    const symbol = CardRenderSymbol.minus(sizeS);
    expect(symbol.size).to.equal(sizeS);
    expect(symbol.isIcon).to.be.true;
    expect(symbol.type).to.equal(CardRenderSymbolType.MINUS);
  });
  it('empty: success', () => {
    const symbol = CardRenderSymbol.empty();
    expect(symbol.size).to.equal(sizeM);
    expect(symbol.type).to.equal(CardRenderSymbolType.EMPTY);
  });
  it('slash: success', () => {
    const symbol = CardRenderSymbol.slash(sizeS);
    expect(symbol.size).to.equal(sizeS);
    expect(symbol.type).to.equal(CardRenderSymbolType.SLASH);
  });
  it('colon: success', () => {
    const symbol = CardRenderSymbol.colon();
    expect(symbol.size).to.equal(sizeM);
    expect(symbol.type).to.equal(CardRenderSymbolType.COLON);
  });
  it('arrow: success', () => {
    const symbol = CardRenderSymbol.arrow();
    expect(symbol.size).to.equal(sizeM);
    expect(symbol.isIcon).to.be.true;
    expect(symbol.type).to.equal(CardRenderSymbolType.ARROW);
  });
  it('bracketOpen: success', () => {
    const symbol = CardRenderSymbol.bracketOpen();
    expect(symbol.size).to.equal(sizeM);
    expect(symbol.type).to.equal(CardRenderSymbolType.BRACKET_OPEN);
  });
  it('bracketClose: success', () => {
    const symbol = CardRenderSymbol.bracketClose();
    expect(symbol.size).to.equal(sizeM);
    expect(symbol.type).to.equal(CardRenderSymbolType.BRACKET_CLOSE);
  });
  it('nbsp: success', () => {
    const symbol = CardRenderSymbol.nbsp(sizeS);
    expect(symbol.size).to.equal(sizeS);
    expect(symbol.isIcon).to.be.true;
    expect(symbol.type).to.equal(CardRenderSymbolType.NBSP);
  });
  it('vspace: success', () => {
    const symbol = CardRenderSymbol.vSpace();
    expect(symbol.size).to.equal(sizeM);
    expect(symbol.isIcon).to.be.true;
    expect(symbol.type).to.equal(CardRenderSymbolType.VSPACE);
  });
  it('equals: success', () => {
    const symbol = CardRenderSymbol.equals();
    expect(symbol.size).to.equal(sizeM);
    expect(symbol.type).to.equal(CardRenderSymbolType.EQUALS);
  });
});
