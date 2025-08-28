import type { PropType, VNodeProps, AllowedComponentProps, ComponentPublicInstance } from 'vue'

export type Validator<T> = (value: T) => boolean
export type WithValidator<T> = { validator?: Validator<T> }
export type WithType<T> = { type: PropType<T> }
export type WithRequired = { required: true }
export type WithDefault<T> = { default: () => T }

export type RequiredProp<T> = WithType<T> & WithValidator<T> & WithRequired
export type OptionalProp<T> = WithType<T> & WithValidator<T>
export type DefaultedProp<T> = WithType<T> & WithValidator<T> & WithDefault<T>
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PropsDefinition = Record<string, RequiredProp<any> | OptionalProp<any> | DefaultedProp<any>>

type Simplify<T> = {
	[K in keyof T]: T[K]
}

type Mutable<T> = {
	-readonly [K in keyof T]: T[K]
}

type RequiredPropKeys<T> = {
	[K in keyof T]: T[K] extends WithRequired ? K : never;
}[keyof T]

type OptionalPropKeys<T> = Exclude<keyof T, RequiredPropKeys<T>>

type InferPropTypes<T, Keys extends keyof T> = {
	[K in Keys]: T[K] extends WithType<infer U> ? U : never;
}

export type ExtractPropsFromObject<T extends PropsDefinition> = Simplify<InferPropTypes<T, RequiredPropKeys<T>> & Partial<InferPropTypes<T, OptionalPropKeys<T>>>>

// eslint-disable-next-line @typescript-eslint/ban-types
export type ExtractPropsFromComponent<T extends (new () => ComponentPublicInstance)> = Mutable<Omit<InstanceType<T>['$props'], keyof VNodeProps | keyof AllowedComponentProps>>

export type ExtractProps<T extends (new () => ComponentPublicInstance) | PropsDefinition> =
	T extends (new () => ComponentPublicInstance)
		? ExtractPropsFromComponent<T>
		: T extends PropsDefinition
			? ExtractPropsFromObject<T>
			: never

export function prop<T>(validator?: Validator<T>) {
	const withValidator = validator !== undefined ? { validator } : {}

	function optional(): OptionalProp<T>
	function optional(value: T): DefaultedProp<T>
	function optional(value?: T): OptionalProp<T> | DefaultedProp<T> {
		if (value !== undefined) {
			return {
				type: null as unknown as PropType<T>,
				default: () => value,
				...withValidator,
			}
		}
		return {
			type: null as unknown as PropType<T>,
			...withValidator,
		}
	}

	function required(): RequiredProp<T> {
		return {
			type: null as unknown as PropType<T>,
			required: true,
			...withValidator,
		}
	}

	return {
		optional,
		required,
	}
}
