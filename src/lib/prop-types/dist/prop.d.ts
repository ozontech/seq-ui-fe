import type { Validator, OptionalProp, DefaultedProp, RequiredProp } from './types';
export declare function prop<T>(validator?: Validator<T>): {
    optional: {
        (): OptionalProp<T>;
        (value: T): DefaultedProp<T>;
    };
    required: () => RequiredProp<T>;
};
