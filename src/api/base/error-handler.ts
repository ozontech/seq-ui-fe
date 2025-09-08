import axios from 'axios'
import { toast } from 'vue-sonner'

export function HandleErrorDecorator<T, R extends () => T>(handler: (error: Error) => void, defaultValueConstructor?: R) {
	return function (target: object, key: string, descriptor: PropertyDescriptor) {
		const original = descriptor.value

		descriptor.value = function (...args: unknown[]) {
			try {
				return original.apply(this, args)
			} catch (error: unknown) {
				if (error instanceof Error) {
					handler(error)
				}

				if (defaultValueConstructor) {
					return defaultValueConstructor()
				}
			}
		}

		return descriptor
	}
}

const errorNotification = (error: Error) => {
  toast.error(error.message)
}

const throwError = (e: Error) => {
	const message = axios.isAxiosError(e) ? e.response?.data.message : e.message
	throw message
}

// Генератор декоратора с привязанной функцией обрабоки ошибки
const ServiceHandleError = <T, R extends () => T>(defaultValueConstructor?: R) => {
	return HandleErrorDecorator<T, R>(errorNotification, defaultValueConstructor)
}

const ThrowErrorHandler = <T, R extends () => T>(defaultValueConstructor?: R) => {
	return HandleErrorDecorator<T, R>(throwError, defaultValueConstructor)
}

export { ServiceHandleError }
