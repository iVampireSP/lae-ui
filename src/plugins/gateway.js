import user from "./stores/user.js";
import {dialog, message} from "../utils/layout.js";
import api from "../config/api.js";

let requests = []

let ws

let authed = false
let close = false

// 创建 ws，增加 header
if (user.state.token) {
    ws = new WebSocket(api.ws_gateway + '?token=' + user.state.token);

    ws.onclose = function () {
        dialog.warning({
            title: '网关连接关闭',
            content: '请尝试刷新页面。',
            positiveText: '好吧'
        })

        close = true
    };
    ws.onerror = function () {
        dialog.warning({
            title: '无法连接到网关',
            content: '请联系我们获得帮助。',
            positiveText: '好'
        })

        close = true
    };

    ws.onmessage = function (event) {
        const data = JSON.parse(event.data)

        if (data['status'] === 200 || data['msg'] === 'authed') {
            authed = true
        }

        // if dev, show message
        if (process.env.NODE_ENV === 'development') {
            console.log('gateway', data)
        }

        if (data['data']) {
            // if it has request_id, then it's a response
            if (data['request_id']) {
                const request = requests.find(request => request.request_id === data['request_id'])

                if (data.status !== 200 && data.data.message) {
                    message.error(data['data']['message'])
                } else {
                    if (request) {
                        request.callback(data)
                    }
                }

            }
        }
    }

}

const wsSend = function (module_id, method, path, data = [], callback = null) {
    if (user.state.token) {

        if (authed) {
            // 生成 request_id
            const request_id = Math.random().toString(36).substring(2, 9)

            const payload = {
                request_id: request_id,
                module_id: module_id,
                method: method,
                path: path,
                data: data
            }

            ws.send(JSON.stringify(payload))

            if (callback) {
                requests.push({
                    request_id: request_id,
                    callback: callback
                })
            }
        } else {
            if (!close) {
                console.warn('正在重试请求')
                setTimeout(function () {
                    wsSend(module_id, method, path, data, callback)
                }, 500)
            }
        }


    }
}


const get = function (module_id, url, data) {
    return new Promise((resolve) => {
        wsSend(module_id, 'GET', url, data, (data) => {
            resolve(data)
        })
    })
}

const post = function (module_id, url, data) {
    return new Promise((resolve) => {
        wsSend(module_id, 'POST', url, data, (data) => {
            resolve(data)

        })
    })
}

const put = function (module_id, url, data) {
    return new Promise((resolve) => {
        wsSend(module_id, 'PUT', url, data, (data) => {
            resolve(data)

        })
    })
}

const patch = function (module_id, url, data) {
    return new Promise((resolve) => {
        wsSend(module_id, 'PATCH', url, data, (data) => {
            resolve(data)

        })
    })
}

const del = function (module_id, url, data) {
    return new Promise((resolve) => {
        wsSend(module_id, 'DELETE', url, data, (data) => {
            resolve(data)

        })
    })
}

export default {
    get: get,
    post: post,
    put: put,
    patch: patch,
    delete: del
}