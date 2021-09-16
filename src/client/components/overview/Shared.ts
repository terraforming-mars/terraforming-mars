// Some vue methods that are shared across components that
// are harder to share when .ts files are .vue files.

export class Shared {
  public static isTagsViewConcise(root: any): boolean {
    return root.getVisibilityState('tags_concise');
  }
};
