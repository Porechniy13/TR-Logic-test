import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
      todos: new Array(), // Todo-lists
      tasks: new Array()  // Tasks of todo-lists
  },
  mutations: {
      // Add new todo-list
      ADD_TODO: (state, data) => {
        state.todos.push({title: data.title, id: data.index});
      },
      // Delete todo-list
      DELETE_TODO: (state, index) => {
        let buffer = new Array()
        // Delete all tasks of current todo-list
        buffer = state.tasks.filter((item) => {
          if(item.todoId !== index){
            return item
          }
        })
        state.tasks = buffer
        // Delete current todo-list
        buffer = state.todos.filter((item) => {
          if(item.id !== index){
            return item
          }
        })
        state.todos = buffer
      },
      // Add task to current todo-list
      ADD_TASK: (state, data) => {
        state.tasks.push({title: data.title, status: data.status, todoId: data.todoId, selfId: data.selfId});
      },
      // Change task status (done or not done)
      EDIT_TASK_STATUS: (state, index) => {
        state.tasks.map((item) => {
          if(item.selfId == index){
            if(item.status){
              item.status = false
            } else {
              item.status = true
            }
          }
        })
      },
      // Delete task
      DELETE_TASK: (state, id) => {
        let buffer = new Array()
        buffer = state.tasks.filter((item) => {
          if(item.selfId !== id){
            return item
          }
        })
        state.tasks = buffer
      }
  },
  // I use this plugin to save data when page is refresh 
  // Plugin use the serialize data and save it to localStorage
  plugins: [createPersistedState()], 
});