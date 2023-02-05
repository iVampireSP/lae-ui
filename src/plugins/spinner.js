import {ref} from 'vue'

const loading = ref(false)

export default {
    loading,
    start: () => {
        loading.value = true
    },
    finish: () => {
        loading.value = false
    },
    error: () => {
        loading.value = false
    }
}