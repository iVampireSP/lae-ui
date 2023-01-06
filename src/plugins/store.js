import {createPinia, setActivePinia} from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia();

pinia.use(piniaPluginPersistedstate);

setActivePinia(pinia);

export default pinia;