import {createStore} from "vuex";
import http from "../http.js";

function filterStatus(task_status) {
    if (task_status === 'error') {
        return 'error';
    } else if (task_status === 'success') {
        return 'success';
    } else if (task_status === 'failed') {
        return 'warning';
    } else {
        return 'info';
    }
}

export default createStore({
    state: {
        tasks: [],
        last_status: 'info',
        processing: false,
    },
    actions: {
        fetch({commit}) {
            http.get('/tasks').then(response => {

                let tasks = response.data;
                // 只保留 status 为 pending, processing, error, success, failed 的任务
                tasks = tasks.filter(task => {
                    return ['pending', 'processing',].includes(task.status);
                })

                commit('set', tasks);
            });
        },
    },
    mutations: {
        set(state, tasks) {
            state.tasks = tasks;
        },
        deleteTask(state, task_id) {
            console.log('deleteTask', task_id);
            state.tasks = state.tasks.filter(t => t.id !== task_id);

            state.processing = false;


            // 如果没有任务了，就设置为 info
            if (state.tasks.length === 0) {
                state.last_status = 'info';
            }

        },
        addTask(state, task) {
            state.tasks.push(task);

            state.last_status = filterStatus(task.status);

        },
        updateTask(state, task) {
            let index = state.tasks.findIndex(t => t.id === task.id);
            state.tasks[index] = task;

            state.last_status = filterStatus(task.status);
            //
            // console.log(task.status)
            // console.log('current status', state.last_status)
            // console.log('processing', state.processing)

            state.processing = task.status === 'processing';

        }
    }
});