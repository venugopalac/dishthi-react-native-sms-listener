/* @flow */
import type Cancellable from './Cancellable'
import type SmsReceiver from './SmsReceiver'
import { DeviceEventEmitter } from 'react-native'

const SMS_RECEIVED_EVENT = 'com.dishthi.smslistener:smsReceived'

export default {
  addListener(listener: (message: SmsReceiver) => void): Cancellable {
    return DeviceEventEmitter.addListener( SMS_RECEIVED_EVENT, listener)
  }
}