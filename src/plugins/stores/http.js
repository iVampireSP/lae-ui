import {defineStore} from 'pinia'

export const useHttpStore = defineStore('http', {
    state: () => ({
        isAlertedToken: false,
    })
})