import {createStore} from 'vuex'
import http from "../http.js";

export default createStore({
    state: {
        client: '',
        config: {
            client: '',
            server: '',
        },
        created_at: '',
        custom_domain: '',
        deleted_at: '',
        free_traffic: 0,
        host_id: 0,
        id: 0,
        last_add_free_traffic_at: '',
        last_bytes: 0,
        local_address: '',
        name: '',
        price: 0,
        protocol: '',
        remote_port: 0,
        review_at: '',
        run_id: '',
        server: {
            allow_http: 0,
            allow_https: 0,
            allow_stcp: 0,
            allow_tcp: 0,
            allow_udp: 0,
            free_traffic: 0,
            id: 0,
            is_china_mainland: 0,
            max_port: 0,
            max_tunnels: 0,
            min_port: 0,
            name: '',
            price_per_gb: 0,
            server_address: '',
            server_port: '',
            status: '',
            token: '',
            tunnels: 0,
        },
        server_id: 0,
        sk: '',
        status: '',
        suspended_at: '',
        traffic: {
            name: '',
            traffic_in: [],
            traffic_out: [],
        },
        tunnel: {
            conf: {
                HealthCheckAddr: '',
                PluginParams: '',
                bandwidth_limit: '',
                group: '',
                group_key: '',
                health_check_interval_s: 0,
                health_check_max_failed: 0,
                health_check_timeout_s: 0,
                health_check_type: '',
                health_check_url: '',
                local_ip: '',
                local_port: 0,
                metas: '',
                name: '',
                plugin: '',
                proxy_protocol_version: "",
                remote_port: 0,
                type: '',
                use_compression: false,
                use_encryption: false,
            },
            cur_conns: 0,
            last_close_time: '',
            last_start_time: '',
            name: '',
            status: '',
            today_traffic_in: 0,
            today_traffic_out: 0,
        },
        updated_at: '',
        use_compression: 0,
        use_encryption: 0,
        user_id: 0,
    },
    actions: {
        updateHosts({commit}, id) {
            http.get('/modules/frp/hosts/' + id).then(response => {
                commit('updateHosts', response.data);
            })
        },
    },
    mutations: {
        updateHosts(state, hosts) {
            state = hosts;
        }
    },
})
