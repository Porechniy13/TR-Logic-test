<template>
  <div class="container">
    <!--Template for tasks in current todo-list -->
    <h1>{{ todos[id].title }}</h1>
    <!--Check in case if tasks is empty-->
    <div v-if="filtredTasks !== null && filtredTasks !== undefined && filtredTasks.length > 0">
      <div v-for="(task, index) in filtredTasks" :key="index" class="task">
        <!--Template if task not need to edit-->
        <div v-if="editModeFor !== task.selfId" >
          <h3 v-if="task.status" class="done">{{ index+1 }}.   {{ task.title }}</h3>
          <h3 v-else>{{ index+1 }}.   {{ task.title }}</h3>
          <div v-if="!task.status" class="save" v-on:click="done(task.selfId)">
            Done
          </div>
          <div v-else class="save" v-on:click="done(task.selfId)">
            Not done
          </div>
          <div class="edit" v-on:click="edit(task.selfId, task.title)">
            Edit
          </div>
          <div v-on:click="del(task.selfId)" class="del">
            Delete
          </div> 
        </div>  
        <!--Template if task need edit -->
        <div v-else>
          <h3>{{ index+1 }}. <input v-model="task.title" class="title" :id="task.selfId"></h3>
          <div class="save" v-on:click="save(false)">
            Save
          </div>
          <div class="cancel" v-on:click="cancel(task.selfId)">
            Cancel
          </div> 
        </div>  
      </div>
    </div>
    <!--Template if tasks is empty -->
    <div v-else>
      <h2>Your tasks list is empty. Add Task!</h2>
    </div>
    <div v-on:click="addTask()" class="add">
      Add task
    </div>
    <div v-on:click="beforeBack()" class="back">
      Back
    </div>
    <div v-if="this.checkWindow" class="modal">
          <div class="modal-body">
            <div class="sure">
              <h3>Are you want to save your changes?</h3>
            </div>
            <div v-on:click="save(true)" class="confirm">
              <p>Yes</p>
            </div>
            <div v-on:click="back()" class="close">
              <p>No</p>
            </div>
          </div>
      </div> 
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: "Todo",
  computed: {
    // Get data from Vuex-storage
    ...mapState([
        'tasks',
        'todos'
    ]),
    // Filter all tasks to display current todo-lists tasks only
    filtredTasks: function() {
      if(this.tasks.length > 0){
        return this.tasks.filter((item) => {
          if(item.todoId == this.id){
            return item
          }
        })
      } else {
        return null
      }      
    }
  },
  data() {
    return {
      id: this.$router.currentRoute.params.id,  //ID of current todo-list
      editModeFor: null,                        //ID to enable 'EditMode' for this task
      oldValue: null,                           //Buffer to save old value, if user will want to roll back changes
      checkWindow: false                        //Variable to open/close confirm modal window
    }
  },
  methods: {
    //Add template of new task
    addTask: function(){
      let data = {}
      data.title = 'New task'           //Title task
      data.todoId = this.id             //ID of tasks todo-list (parent ID)
      data.selfId = this.tasks.length   //ID of current task
      data.status = false               //Status task (done or not done)
      this.$store.commit("ADD_TASK", data)
    },
    del: function(index){
      this.$store.commit("DELETE_TASK", index)
    },
    //Enable 'EditMode' to task with this ID ('index' variable)
    edit: function(index, title){
      if(this.editModeFor !== null){
        this.filtredTasks.map((item) => {
          if(item.selfId == this.editModeFor){
            item.title = this.oldValue
          }
        })
      }
      this.editModeFor = index
      this.oldValue = title
    },
    // Save changes
    save: function(exit){
      this.oldValue = null
      this.editModeFor = null
      if(exit){
        this.back()
      }
    },
    // Cancel changes
    cancel: function(index){
      this.filtredTasks.map((item) => {
        if(item.selfId == index){
          item.title = this.oldValue
        }
      })
      this.oldValue = null;
      this.editModeFor = null;
    },
    // Open check window before back to main page
    beforeBack: function(){
      if(this.editModeFor !== null && this.oldValue !== null){
        this.checkWindow = true
      } else {
        this.back()
      }
    },
    // Check before back to main page
    back: function(){
      if(this.editModeFor != null){
        this.cancel(this.editModeFor)
      }      
      this.$router.push({ name: 'main'}).catch(()=>{});
    },
    // Change status of task in 'EditMode'
    done: function(index){
      this.$store.commit('EDIT_TASK_STATUS', index)
    }
  }
}
</script>

<style scoped>
  .task{
    width: 50%;
    text-align: left;
    margin-top: 2vh;
    margin-left: 25%;
    min-height: 5vh;
    padding: .8em 1em calc(.8em + 3px);
    border-radius: 3px;
    background: rgb(236, 236, 236);
    box-shadow: 0 -3px rgb(201, 201, 201) inset;
    position: relative;
  }
  input{
    width: 25%;
    margin-top: 0;
  }
  input:disabled{
    background: rgb(236, 236, 236);
    border: none;
  }
  .edit {
    position: absolute;
    right: 15%;
    bottom: 0;
    width: 10%;
    height: 5vh;
    text-align: center;
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
  .edit:hover{
    background:  rgb(53,167,110);
  }
  .edit:active{
    background:  rgb(33,147,90);
    box-shadow: 0 3px  rgb(33,147,90) inset;
  }
  .del {
    position: absolute;
    right: 0;
    bottom: 0;
    height: 5vh;
    width: 10%;
    font-weight: 700;
    color: white;
    text-decoration: none;
    text-align: center;
    padding: .8em 1em calc(.8em + 3px);
    border-radius: 3px;
    background: rgb(199, 64, 64);
    box-shadow: 0 -3px  rgb(167, 53, 53) inset;
    transition: 0.4s;
    cursor: pointer;
  }
  .del:hover{
    background:  rgb(167, 53, 53);
  }
  .del:active{
    background:  rgb(147, 33, 33);
    box-shadow: 0 3px  rgb(147, 33, 33) inset;
  }
  .save {
    position: absolute;
    right: 30%;
    bottom: 0;
    height: 5vh;
    width: 10%;
    font-weight: 700;
    color: white;
    text-decoration: none;
    text-align: center;
    padding: .8em 1em calc(.8em + 3px);
    border-radius: 3px;
    background: rgb(64, 194, 199);
    box-shadow: 0 -3px  rgb(53, 159, 167) inset;
    transition: 0.4s;
    cursor: pointer;
  }
  .save:hover{
    background:  rgb(53, 159, 167) ;
  }
  .save:active{
    background:  rgb(64, 194, 199);
    box-shadow: 0 3px  rgb(53, 159, 167) inset;
  }
  .cancel {
    position: absolute;
    right: 15%;
    bottom: 0;
    height: 5vh;
    width: 10%;
    font-weight: 700;
    color: white;
    text-decoration: none;
    text-align: center;
    padding: .8em 1em calc(.8em + 3px);
    border-radius: 3px;
    background: rgb(199, 64, 64);
    box-shadow: 0 -3px  rgb(167, 53, 53) inset;
    transition: 0.4s;
    cursor: pointer;
  }
  .cancel:hover{
    background:  rgb(167, 53, 53);
  }
  .cancel:active{
    background:  rgb(147, 33, 33);
    box-shadow: 0 3px  rgb(147, 33, 33) inset;
  }
  .back {
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
  }
  .back:hover{
    background: rgb(53, 167, 110);
  }
  .back:active{
    background: rgb(33,147,90);
    box-shadow: 0 3px rgb(33,147,90) inset;
  }
  .done {
    text-decoration: line-through;
  }
</style>