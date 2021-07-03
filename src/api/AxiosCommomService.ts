import { toast } from 'react-toastify'

export class AxiosCommomService {
  // eslint-disable-next-line no-unused-vars
  static loadingHookFunc: Function = (isActive: boolean) => {}

  static startLoading = () => {
    AxiosCommomService.loadingHookFunc(true)
  }
  static stopLoading = () => {
    AxiosCommomService.loadingHookFunc(false)
  }
  static showSuccessToast = (message: string) => toast.success(message)

  static showErrorToast = (message: string) => toast.error(message)

  static setLoadingHookFunc = async (func: Function) => {
    AxiosCommomService.loadingHookFunc = func
  }
  static resolveAfterSeconds(time: number) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true)
      }, time)
    })
  }

  static withLoading = async (
    func: Function,
    waitTime?: number | undefined
  ) => {
    AxiosCommomService.startLoading()
    waitTime !== undefined &&
      (await AxiosCommomService.resolveAfterSeconds(waitTime))
    try {
      return await func()
    } finally {
      AxiosCommomService.stopLoading()
    }
  }
}
