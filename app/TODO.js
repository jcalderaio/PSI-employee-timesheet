//iPhone button hex = #0x007aff

/*John Calderaio:
	@AriaFallah I'm not an expert with testing, but just try to create your functions as pure as possible, for example: */

class MessageStore {
  // bad
  markMessageAsRead = message => {
    if (message.status === 'new') {
      fetch({
        method: 'GET',
        path: `/notification/read/${message.id}`
      }).then(() => message.status = 'read')
    }
  }
  // good
  markMessageAsRead = message => {
    if (message.status !== 'new') {
      return Promise.reject('Message is not new')
    }
    // it's now easily mockable
    return api.markMessageAsRead(message).then(() => {
      // this is a pure function
      // you can test it easily
      return this.updateMessage(message, { status: ' read' })
    })
  }
}

<KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#F5F5F5' }} behavior="padding" >
	<Input placeholder="poop" style={{ flex: 7 }} />
	<Input placeholder="poop3" style={{ flex: 1 }} />
</KeyboardAvoidingView>

TODO:
  -raise input field to keyboard
  * there will be a function to get todays charges (just a not, not a TODO)
-MOBX - REALLY FUCKING LEARN!!! BE READY TO USE NEXT WEEK!
	https://github.com/mobxjs/mobx-react-boilerplate/issues/8
	https://www.youtube.com/watch?v=5AMQaWaqjyA
-React Navigation: Learn passing props
	https://www.google.com/search?q=passing+data+between+tabs+react+navigation&oq=passing+data+between+tabs+react+navigation&aqs=chrome..69i57.10238j0j4&sourceid=chrome&ie=UTF-8
	https://github.com/react-community/react-navigation/issues/143

WHAT I DID:
  -dont clear windows ID on not good
  -show First_Name Last_Name on Main screen
  -Hid status bar on Android only
  -changed Logout Icon
  -Alert and confirmation for Logout now
  -First keyboard says "Next" and goes to password
  -Second keboard logs in on submit
  -Unhid login from keyboard and animated logo
