import { IComputedValue } from "../core/computedvalue";
export interface IComputedValueOptions<T> {
    compareStructural?: boolean;
    struct?: boolean;
    name?: string;
    setter?: (value: T) => void;
    context?: any;
}
export interface IComputed {
    <T>(func: () => T, setter?: (value: T) => void): IComputedValue<T>;
    <T>(func: () => T, options: IComputedValueOptions<T>): IComputedValue<T>;
    (target: Object, key: string | symbol, baseDescriptor?: PropertyDescriptor): void;
    struct(target: Object, key: string | symbol, baseDescriptor?: PropertyDescriptor): void;
}
/**
 * Decorator for class properties: @computed get value() { return expr; }.
 * For legacy purposes also invokable as ES5 observable created: `computed(() => expr)`;
 */
export declare var computed: IComputed;
