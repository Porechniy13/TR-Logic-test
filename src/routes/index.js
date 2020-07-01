import Vue from 'vue'
import Router from 'vue-router'
import MainPage from '../components/MainPage'
import TodoList from '../components/TodoList'

Vue.use(Router)

const routes = [
  { path: '/', component: MainPage, name: 'main'},        //Main page (todo-lists)
  { path: '/task/:id', component: TodoList, name: 'task'} //Tasks page ('id' is props to filter all tasks)
]

export default new Router({
    mode: 'history',
    hashbang: false,
    base: process.env.BASE_URL,
    root: '/',
    routes: routes
})