export type ComponentType =
  'root' |
  'production-box' |
  'effect' |
  'corp-box-effect' |
  'corp-box-action' |
  'symbol' |
  'item' |
  'tile';

export interface CardComponent {
  is: ComponentType;
}
