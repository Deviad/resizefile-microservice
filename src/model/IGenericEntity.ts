export interface IGenericEntity<T> {
  create?: (entity: IGenericEntity<T>) => IGenericEntity<T>;
}
