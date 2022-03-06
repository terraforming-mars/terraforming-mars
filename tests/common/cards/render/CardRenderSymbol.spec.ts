import {CardRenderSymbol} from '../../../../src/cards/render/CardRenderSymbol';
import {Size} from '../../../../src/common/cards/render/Size';
import {CardRenderSymbolType} from '../../../../src/common/cards/render/CardRenderSymbolType';
import {expect} from 'chai';

const sizeM = Size.MEDIUM;
const sizeS = Size.SMALL;

describe('CardRenderSymbol', function() {
  it('asterix: success', function() {
    const symbol = CardRenderSymbol.asterix();
    expect(symbol.size).to.equal(sizeM);
    expect(symbol.type).to.equal(CardRenderSymbolType.ASTERIX);
  });
  it('or: success', function() {
    const symbol = CardRenderSymbol.or(sizeS);
    expect(symbol.size).to.equal(sizeS);
    expect(symbol.type).to.equal(CardRenderSymbolType.OR);
  });
  it('plus: success', function() {
    const symbol = CardRenderSymbol.plus();
    expect(symbol.size).to.equal(sizeM);
    expect(symbol.isIcon).to.be.true;
    expect(symbol.type).to.equal(CardRenderSymbolType.PLUS);
  });
  it('minus: success', function() {
    const symbol = CardRenderSymbol.minus(sizeS);
    expect(symbol.size).to.equal(sizeS);
    expect(symbol.isIcon).to.be.true;
    expect(symbol.type).to.equal(CardRenderSymbolType.MINUS);
  });
  it('empty: success', function() {
    const symbol = CardRenderSymbol.empty();
    expect(symbol.size).to.equal(sizeM);
    expect(symbol.type).to.equal(CardRenderSymbolType.EMPTY);
  });
  it('slash: success', function() {
    const symbol = CardRenderSymbol.slash(sizeS);
    expect(symbol.size).to.equal(sizeS);
    expect(symbol.type).to.equal(CardRenderSymbolType.SLASH);
  });
  it('colon: success', function() {
    const symbol = CardRenderSymbol.colon();
    expect(symbol.size).to.equal(sizeM);
    expect(symbol.type).to.equal(CardRenderSymbolType.COLON);
  });
  it('arrow: success', function() {
    const symbol = CardRenderSymbol.arrow();
    expect(symbol.size).to.equal(sizeM);
    expect(symbol.isIcon).to.be.true;
    expect(symbol.type).to.equal(CardRenderSymbolType.ARROW);
  });
  it('bracketOpen: success', function() {
    const symbol = CardRenderSymbol.bracketOpen();
    expect(symbol.size).to.equal(sizeM);
    expect(symbol.type).to.equal(CardRenderSymbolType.BRACKET_OPEN);
  });
  it('bracketClose: success', function() {
    const symbol = CardRenderSymbol.bracketClose();
    expect(symbol.size).to.equal(sizeM);
    expect(symbol.type).to.equal(CardRenderSymbolType.BRACKET_CLOSE);
  });
  it('nbsp: success', function() {
    const symbol = CardRenderSymbol.nbsp(sizeS);
    expect(symbol.size).to.equal(sizeS);
    expect(symbol.isIcon).to.be.true;
    expect(symbol.type).to.equal(CardRenderSymbolType.NBSP);
  });
  it('vspace: success', function() {
    const symbol = CardRenderSymbol.vSpace();
    expect(symbol.size).to.equal(sizeM);
    expect(symbol.isIcon).to.be.true;
    expect(symbol.type).to.equal(CardRenderSymbolType.VSPACE);
  });
  it('equals: success', function() {
    const symbol = CardRenderSymbol.equals();
    expect(symbol.size).to.equal(sizeM);
    expect(symbol.type).to.equal(CardRenderSymbolType.EQUALS);
  });
});
