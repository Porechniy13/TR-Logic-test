<template>
  <div class="container">
    <h1>Todo-list</h1>
    <!--Check todo-list and render all todo-lists -->
    <div v-if="todos !== null && todos !== undefined && todos.length > 0" class="task-list">
      <div class="task" v-for="todo in todos" :key="todo.title">
          <h2>{{ todo.title }}</h2>          
          <div class="todo-list">
            <!--Render preview tasks to current todo-list -->
            <ol>
              <li v-for="task in filteredTask(todo.id)" :key="task.title">
                <p>{{ task.title }}</p>
              </li>
            </ol>
          </div>
          <!--Go to task -->
          <div v-on:click="goTo(todo.id)" class="go">
            Edit
          </div>
          <!--Delete todo-list -->
          <div v-on:click="del(todo.id)" class="delete">
            Delete
          </div>        
      </div>      
    </div>
    <!--Template in case if todo-list is empty -->
    <div v-else>
      <h2>Your task list is empty. Get start!</h2>
    </div>
    <!--Add new todo-list -->
    <div class="add" v-on:click="addTask()">
      <p>Add task</p>
    </div>
    <!--Modal window to create todo-list -->
    <div v-if="this.openDialog" class="modal">
      <div class="modal-body">
        <h3>Enter the title of task list</h3>
        <input id="title" placeholder="Title">
        <!--Confirm action -->
        <div v-on:click="newTask()" class="confirm">
          <p>Add task</p>
        </div>
        <!--Close modal window -->
        <div v-on:click="close()" class="close">
          <p>Close</p>
        </div>
      </div>  
      <!--Modal window call in case if new todo-list title already exist -->
      <div v-if="this.openError" class="modal-error">
          <div class="modal-body">
            <div class="sure">
              <h3>This title already exist</h3>
            </div>
          </div>
      </div>    
    </div>
    <!--CModal window to confirm delete todo-list -->
      <div v-if="this.openConfirm" class="modal">
          <div class="modal-body">
            <div class="sure">
              <h3>Are you sure to delete this task?</h3>
            </div>
            <div v-on:click="delTask()" class="confirm">
              <p>Yes</p>
            </div>
            <div v-on:click="closeConfirm()" class="close">
              <p>No</p>
            </div>
          </div>
      </div>      
  </div>  
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: "Main",
  data() {
    return {
      openDialog: false,  // Variable of open/close modal-window (create todo-list)
      openConfirm: false, // Variable of open/close modal-window (confirm to delete todo-list)
      openError: false,   // Variable of open/close modal-window (in case of duplicate todo-list title)
      delIndex: null      // ID of the todo-list to delete
    };
  },
  methods: {
    // Open modal window to add new todo-list
     addTask: function(){
      this.openDialog = true;
     },
     // Close modal window to add new todo-list
     close: function(){
      this.openDialog = false;
     },
     // Close confirm window
     closeConfirm: function(){
       this.openConfirm = false;
     },
     // Check todo-list title of duplicate and
     // add it to store
     newTask: function(){
        let title = document.getElementById("title").value;
        let check = true
        this.todos.map((item) => {
          if(item.title == title){
            check = false
          }
        })
        if(check == true){
          let id = this.todos.length
          this.$store.commit("ADD_TODO", {title: title, index: id})
          this.close();
        } else {
          this.openError = true;
          document.getElementById("title").value = ''
          setTimeout(() => {
            this.openError = false
          }, 2000)
        }
     },
     // Go to todo-list tasks
     goTo: function(id){
       this.$router.push({ name: 'task', params: { id: id}}).catch(()=>{});
     },
     // Open confirm window and save ID to global variable
     del: function(id){
       this.openConfirm = true;
       this.delIndex = id
     },
     // Delete task
     delTask: function(){
       this.$store.commit("DELETE_TODO", this.delIndex);
       this.openConfirm = false;
     },
     // Filter task to display it preview to every todo-lists
     filteredTask: function(id){
      let counter = 0;
      let mainCounter = 0;
      // Add two example of tasks to preview
      let result = this.tasks.filter((item) => {
        if(item.todoId == id){
          mainCounter++
        }
        if(item.todoId == id && counter < 2){
          counter++
          return item
        }
      })
      // If tasks in this todo-list are more than two - add '...' in preview
      if(mainCounter != counter){
        result.push({title: '...'})
      }
      return result
    }
  },
  computed: {
    // Get values from Vuex-storage
    ...mapState([
        'todos',
        'tasks'
    ])
  }
}
</script>

<style>
.task-list{ 
    display: -webkit-flex;
    display: flex; 
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-around;
    width: 100%;
  }
  .task {
    width: 25%; 
    flex-grow: 0;
    flex-shrink: 0;
    margin-top: 3vh;
    min-height: 20vh;
    padding: .8em 1em calc(.8em + 3px);
    border-radius: 3px;
    background: rgb(236, 236, 236);
    box-shadow: 0 -3px rgb(201, 201, 201) inset;
    position: relative;
  }
  .modal {
    position: fixed;
    z-index: 998;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background:rgba(0,0,0,.7);
    transition: 1s;
    padding: 0;
  }
  .modal-error {
    position: fixed;
    z-index: 999;
    top: 5vh;
    width: 100%;
    height: 1vh;
    transition: 1s;
    padding: 0;
  }
  .modal-body {
    position: relative;
    width: 40%;
    height: 25vh;
    margin-left: 30%;
    margin-top: 35vh;
    background: rgba(255, 255, 255, 1);
    color: rgba(0, 0, 0, 1);
    border-radius: 5px;
  }
  .todo-list {
    margin-left: 5%;
    text-align: left;
  }
  .add {
    width: 20%;
    margin-top: 5vh;
    margin-left: 39%;
    font-weight: 700;
    color: white;
    text-decoration: none;
    padding: .8em 1em calc(.8em + 3px);
    border-radius: 3px;
    background: rgb(64,199,129);
    box-shadow: 0 -3px rgb(53,167,110) inset;
    transition: 0.4s;
    cursor: pointer;
  }
  .add:hover{
    background: rgb(53, 167, 110);
  }
  .add:active{
    background: rgb(33,147,90);
    box-shadow: 0 3px rgb(33,147,90) inset;
  }
  .close {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 20%;
    font-weight: 700;
    color: white;
    text-decoration: none;
    padding: .8em 1em calc(.8em + 3px);
    border-radius: 3px;
    background: rgb(199, 64, 64);
    box-shadow: 0 -3px rgb(167, 53, 53) inset;
    transition: 0.4s;
    cursor: pointer;
  }
  .close:hover{
    background: rgb(167, 53, 53);
  }
  .close:active{
    background: rgb(147, 33, 33);
    box-shadow: 0 3px rgb(147, 33, 33) inset;
  }
  .confirm {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 20%;
    font-weight: 700;
    color: white;
    text-decoration: none;
    padding: .8em 1em calc(.8em + 3px);
    border-radius: 3px;
    background: rgb(64,199,129);
    box-shadow: 0 -3px  rgb(53,167,110) inset;
    transition: 0.4s;
    cursor: pointer;
  }
  .confirm:hover{
    background:  rgb(53,167,110);
  }
  .confirm:active{
    background:  rgb(33,147,90);
    box-shadow: 0 3px  rgb(33,147,90) inset;
  }
  .go {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 20%;
    font-weight: 700;
    color: white;
    text-decoration: none;
    padding: .8em 1em calc(.8em + 3px);
    border-radius: 3px;
    background: rgb(64,199,129);
    box-shadow: 0 -3px  rgb(53,167,110) inset;
    transition: 0.4s;
    cursor: pointer;
  }
  .go:hover{
    background:  rgb(53,167,110);
  }
  .go:active{
    background:  rgb(33,147,90);
    box-shadow: 0 3px  rgb(33,147,90) inset;
  }
  .delete {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 20%;
    font-weight: 700;
    color: white;
    text-decoration: none;
    padding: .8em 1em calc(.8em + 3px);
    border-radius: 3px;
    background: rgb(199, 64, 64);
    box-shadow: 0 -3px  rgb(167, 53, 53) inset;
    transition: 0.4s;
    cursor: pointer;
  }
  .delete:hover{
    background:  rgb(167, 53, 53);
  }
  .delete:active{
    background:  rgb(147, 33, 33);
    box-shadow: 0 3px  rgb(147, 33, 33) inset;
  }
  input {
    margin-top: 5vh;
    width: 300px;
    font-size: 13px;
    padding: 6px 0 4px 10px;
    border: 1px solid #cecece;
    background: #F6F6f6;
    border-radius: 8px;
  }
  .sure {
    position: absolute;
    width: 100%;
    text-align: center;
    top: 30%;
  }
</style>
