import PusherJS from 'pusher-js'
import LaravelEcho from 'laravel-echo'

import userStore from './stores/user'

import api from '../config/api.js'

PusherJS.logToConsole = false

let echo = new LaravelEcho({
    broadcaster: 'pusher',
    key: 'app-key',
    wsHost: api.ws_host,
    wsPort: api.ws_port,
    wssPort: api.ws_port,
    forceTLS: false,
    encrypted: true,
    disableStats: true,
    enableLogging: true,
    enabledTransports: ['ws', 'wss'],

    authEndpoint: api.ws_auth_endpoint,
    auth: {
        headers: {
            Accept: 'application/json',
            Authorization: 'Bearer ' + userStore.state.token,
        },
    },
})

let events = []

echo.private(`users.${userStore.state.user.id}`).listen('.messages', (e) => {
    // console.log(e)

    let type = e['type']

    for (let i = 0; i < events.length; i++) {
        if (events[i].type === type) {
            events[i].callback(e)
        }
    }

})

const listen = (type, callback) => {
    events.push({type, callback})
}

// 取消监听
const leave = (type, callback) => {
    events = events.filter((e) => {
        return !(e.type === type && e.callback === callback)
    })
}


export {
    echo,
    listen,
    leave,
}
