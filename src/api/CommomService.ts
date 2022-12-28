import { IframeMessageProxy } from 'iframe-message-proxy'
import ReactGA from 'react-ga'
export class CommomService {
  static startLoading = () =>
    IframeMessageProxy.sendMessage({ action: 'startLoading' })

  static stopLoading = () =>
    IframeMessageProxy.sendMessage({ action: 'stopLoading' })

  static setHeight = (height) =>
    IframeMessageProxy.sendMessage({ action: 'heightChange', content: height })

  static showSuccessToast = (message: string) =>
    IframeMessageProxy.sendMessage({
      action: 'toast',
      content: {
        type: 'success',
        message: message,
      },
    })

  static showErrorToast = (message: string) => {
    IframeMessageProxy.sendMessage({
      action: 'toast',
      content: {
        type: 'danger',
        message: message,
      },
    })
    ReactGA.event({
      category: 'Close Mutiple Ticket Project',
      action: message,
      label:  'Plugin',
    })
  }
  static withLoading = async (func: Function) => {
    CommomService.startLoading()

    try {
      return await func()
    } finally {
      CommomService.stopLoading()
    }
  }
}
