import {CardRenderSymbolType} from './CardRenderSymbolType';
import {CardRenderItemSize} from './CardRenderItemSize';

export class CardRenderSymbol {
  private constructor(private type: CardRenderSymbolType, private isIcon: boolean = false, private size: CardRenderItemSize = CardRenderItemSize.MEDIUM) {}
  public getType(): CardRenderSymbolType {
    return this.type;
  }
  public getIsIcon(): boolean {
    return this.isIcon;
  }
  public getSize(): CardRenderItemSize {
    return this.size;
  }
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
  public small(): CardRenderSymbol {
    this.size = CardRenderItemSize.SMALL;
    return this;
  }
  public medium(): CardRenderSymbol {
    this.size = CardRenderItemSize.MEDIUM;
    return this;
  }
  public large(): CardRenderSymbol {
    this.size = CardRenderItemSize.LARGE;
    return this;
  }
}
