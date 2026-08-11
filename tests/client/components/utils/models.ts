import {RecursivePartial} from '@/common/utils/utils';

/**
 * Casts a partial test fixture up to its full model type.
 *
 * Many of the tests require models where it's unnecessary and unreasonable
 * to supply the whole model.
 *
 * If there are strange compiler errors,  explicitly pass the type param
 * (`asComplete<PlayerViewModel>({...})`).
 */
export function asComplete<T>(partial: RecursivePartial<T>): T {
  return partial as T;
}
