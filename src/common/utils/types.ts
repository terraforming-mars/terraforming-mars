/**
 * Makes a field in T fully optional.
 *
 * With these types
 *
 *   type Profile = {firstname: string, lastname: string, company: string};
 *   type InputOuptut = {input: Profile, output: Profile};
 *
 *   InputOutput is
 *
 *   {
 *     input: {firstname: string, lastname: string, company: string},
 *     output: {firstname: string, lastname: string, company: string},
 *   }
 *
 * Partial<InputOuptut, 'input'>;
 *
 * yields {input: Partial<Profile>, output: Profile}
 *
 * or
 *
 * {
 *   input: {firstname?: string, lastname?: string, company?: string},
 *   output: {firstname: string, lastname: string, company: string},
 * }
 *
 */
export type PartialField<T, K extends keyof T> = Omit<T, K> & {[k in K]: Partial<T[K]>};
