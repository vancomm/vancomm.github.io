export default interface CacheRecord<T> {
  version: number;
  expires: Date;
  value: T;
}
