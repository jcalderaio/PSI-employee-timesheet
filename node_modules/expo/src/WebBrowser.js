// @flow
import { NativeModules } from 'react-native';

const { ExponentWebBrowser } = NativeModules;

export default {
  async openBrowserAsync(
    url: string
  ): Promise<{ type: 'cancel' | 'dismissed' }> {
    return ExponentWebBrowser.openBrowserAsync(url);
  },

  dismissBrowser(): void {
    ExponentWebBrowser.dismissBrowser();
  },
};
