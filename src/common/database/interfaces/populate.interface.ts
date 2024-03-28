export type SortOptions = Record<string, 'asc' | 'desc'>;

export interface PopulateOptions {
  path: string;
  match?: Record<string, unknown>;
  options?: Record<'sort', SortOptions>;
}
