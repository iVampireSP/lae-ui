import {defineStore} from 'pinia'

export const useUserStore = defineStore('user', {
    state: () => ({
        token: null,
        name: null,
        email: null,
        email_md5: null,
        real_name: null,
        created_at: null,
        updated_at: null,
    }),
    actions: {
        logout() {
            this.token = null;
            this.name = null;
            this.email = null;
            this.email_md5 = null;
            this.real_name = null;
            this.created_at = null;
            this.updated_at = null;
        },
    },
})