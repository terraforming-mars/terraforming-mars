/*
  Used to describe any distinct symbol on a card and prepare it for rendering in Vue
  e.g. plus and minus sign, asterix, arrow, dash, slash, etc.
 */
import {CardRenderSymbolType} from './CardRenderSymbolType';
import {CardRenderItemSize} from './CardRenderItemSize';

export class CardRenderSymbol {
  private constructor(public type: CardRenderSymbolType, public size: CardRenderItemSize, public isIcon: boolean = false) {}

  public static asterix(size: CardRenderItemSize = CardRenderItemSize.MEDIUM): CardRenderSymbol {
    return new CardRenderSymbol(CardRenderSymbolType.ASTERIX, size);
  }
  public static or(size: CardRenderItemSize = CardRenderItemSize.MEDIUM): CardRenderSymbol {
    return new CardRenderSymbol(CardRenderSymbolType.OR, size);
  }
  public static plus(size: CardRenderItemSize = CardRenderItemSize.MEDIUM): CardRenderSymbol {
    return new CardRenderSymbol(CardRenderSymbolType.PLUS, size, true);
  }
  public static minus(size: CardRenderItemSize = CardRenderItemSize.MEDIUM): CardRenderSymbol {
    return new CardRenderSymbol(CardRenderSymbolType.MINUS, size, true);
  }
  public static empty(size: CardRenderItemSize = CardRenderItemSize.MEDIUM): CardRenderSymbol {
    return new CardRenderSymbol(CardRenderSymbolType.EMPTY, size);
  }
  public static slash(size: CardRenderItemSize = CardRenderItemSize.MEDIUM): CardRenderSymbol {
    return new CardRenderSymbol(CardRenderSymbolType.SLASH, size);
  }
  public static colon(size: CardRenderItemSize = CardRenderItemSize.MEDIUM): CardRenderSymbol {
    return new CardRenderSymbol(CardRenderSymbolType.COLON, size);
  }
  public static arrow(size: CardRenderItemSize = CardRenderItemSize.MEDIUM): CardRenderSymbol {
    return new CardRenderSymbol(CardRenderSymbolType.ARROW, size, true);
  }
  public static bracketOpen(size: CardRenderItemSize = CardRenderItemSize.MEDIUM): CardRenderSymbol {
    return new CardRenderSymbol(CardRenderSymbolType.BRACKET_OPEN, size);
  }
  public static bracketClose(size: CardRenderItemSize = CardRenderItemSize.MEDIUM): CardRenderSymbol {
    return new CardRenderSymbol(CardRenderSymbolType.BRACKET_CLOSE, size);
  }
  public static nbsp(size: CardRenderItemSize = CardRenderItemSize.MEDIUM): CardRenderSymbol {
    return new CardRenderSymbol(CardRenderSymbolType.NBSP, size, true);
  }
  public static vSpace(size: CardRenderItemSize = CardRenderItemSize.MEDIUM): CardRenderSymbol {
    return new CardRenderSymbol(CardRenderSymbolType.VSPACE, size, true);
  }
  public static equals(size: CardRenderItemSize = CardRenderItemSize.MEDIUM): CardRenderSymbol {
    return new CardRenderSymbol(CardRenderSymbolType.EQUALS, size);
  }
}
