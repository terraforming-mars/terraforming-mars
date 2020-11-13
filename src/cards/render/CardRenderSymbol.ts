/*
  Used to describe any distinct symbol on a card and prepare it for rendering in Vue
  e.g. plus and minus sign, asterix, arrow, dash, slash, etc.
 */
import {CardRenderSymbolType} from './CardRenderSymbolType';
import {CardRenderItemSize} from './CardRenderItemSize';

export class CardRenderSymbol {
  private constructor(public type: CardRenderSymbolType, public isIcon: boolean = false, public size: CardRenderItemSize = CardRenderItemSize.MEDIUM) {}

  public static asterix(): CardRenderSymbol {
    return new CardRenderSymbol(CardRenderSymbolType.ASTERIX);
  }
  public static or(): CardRenderSymbol {
    return new CardRenderSymbol(CardRenderSymbolType.OR);
  }
  public static plus(): CardRenderSymbol {
    return new CardRenderSymbol(CardRenderSymbolType.PLUS, true);
  }
  public static minus(): CardRenderSymbol {
    return new CardRenderSymbol(CardRenderSymbolType.MINUS, true);
  }
  public static empty(): CardRenderSymbol {
    return new CardRenderSymbol(CardRenderSymbolType.EMPTY);
  }
  public static slash(): CardRenderSymbol {
    return new CardRenderSymbol(CardRenderSymbolType.SLASH);
  }
  public static colon(): CardRenderSymbol {
    return new CardRenderSymbol(CardRenderSymbolType.COLON);
  }
  public static arrow(): CardRenderSymbol {
    return new CardRenderSymbol(CardRenderSymbolType.ARROW, true);
  }
}
