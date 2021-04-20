/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import temp from './TEMP/temp';
import { typography } from './android/app/src/main/utils/typography';

typography()

AppRegistry.registerComponent(appName, () => App);
