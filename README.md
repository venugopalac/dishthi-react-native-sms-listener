## dishthi-react-native-sms-listener [![dishthi-react-native-sms-listener]](https://github.com/venugopalac/dishthi-react-native-sms-listener)
React Native SMS Listener

### Example

```JS
import SmsListener from 'dishthi-react-native-sms-listener'

SmsListener.addListener(message => {
  console.info(message)
})
```

The contents of `message` object will be:

```JS
{
  originatingAddress: string,
  body: string,
  timestamp: number
}
```

`SmsListener#addListener` returns a `Cancellable` so if you want to stop listening for incoming SMS messages you can simply `.remove` it:

```JS
let subscription = SmsListener.addListener(...)

subscription.remove()
```

In recent versions of Android you might also have to ask for permissions:

```JS
async function requestReadSmsPermission() {
  try {
    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_SMS,
      {
        title: "(...)",
        message: "Why you're asking for..."
      }
    );
  } catch (err) {}
}

class MyComponent extends Component {
  // ...

  componentDidMount() {
    requestReadSmsPermission();
  }

  // ...
}
```

### Example of using it for verification purposes:

...and if in your sign up process you have the phone number verification step which is done by sending a code via SMS to the specified phone, you might want to verify it automatically when the user receive it &mdash; pretty much like what Telegram or WhatsApp does:

```JS
let subscription = SmsListener.addListener(message => {
  let verificationCodeRegex = /Your verification code: ([\d]{6})/

  if (verificationCodeRegex.test(message.body)) {
    let verificationCode = message.body.match(verificationCodeRegex)[1]

    YourPhoneVerificationApi.verifyPhoneNumber(
      message.originatingAddress,
      verificationCode
    ).then(verifiedSuccessfully => {
      if (verifiedSuccessfully) {
        subscription.remove()
        return
      }

      if (__DEV__) {
        console.info(
          'Failed to verify phone `%s` using code `%s`',
          message.originatingAddress,
          verificationCode
        )
      }
    })
  }
})
```

If you're using Twilio or a similar third-party messaging service which you have a fixed phone number to deliver messages you might want to ensure that the message comes from your service by checking `message.originatingAddress`.

### Installation

```SH
$ npm install --save dishthi-react-native-sms-listener
$ react-native link dishthi-react-native-sms-listener
```

### Manual Installation

For a manual installation, all you need to do to use this so-called utility is:

_android/settings.gradle_

```Gradle
include ':dishthi-react-native-sms-listener'
project(':dishthi-react-native-sms-listener').projectDir = new File(rootProject.projectDir,'../node_modules/dishthi-react-native-sms-listener/android')
```

_android/app/build.gradle_

```Gradle
dependencies {
  compile project(':dishthi-react-native-sms-listener')
  // (...)
}
```

_MainApplication.java_

```Java
import com.centaurwarchief.smslistener.SmsListenerPackage;
```

```Java
@Override
protected List<ReactPackage> getPackages() {
  return Arrays.<ReactPackage>asList(
    new MainReactPackage(),
    new SmsListenerPackage()
    // (...)
  );
}
```