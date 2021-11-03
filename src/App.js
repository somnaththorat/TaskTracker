import Header from "./components/Header";
import Tasks from "./components/Tasks";
import { useState, useEffect } from "react";
import AddTask from "./components/AddTask";

function App() {

  const [showAddTask, setShowAddTask] = useState(false);


  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const getTasks = async () => {
      const taskFromServer = await FetchTasks();
      setTasks(taskFromServer);
    }
    getTasks();
  }, []);

  //fetch tasks
  const FetchTasks = async () => {
    const response = await fetch("http://localhost:5000/tasks");
    const data = await response.json();
    console.log(data);
    return data;
  }



  //fetch tasks
  const FetchTask = async (id) => {
    const response = await fetch(`http://localhost:5000/tasks/${id}`);
    const data = await response.json();
    console.log(data);
    return data;
  }



  //delete task function
  const deleteTask = async (id) => {
    // console.log('delete', id);
    await fetch(`http://localhost:5000/tasks/${id}`, {
      method: "DELETE",
    });
    setTasks(tasks.filter(task => task.id !== id));
  }

  //toggle reminder function
  const toggleReminder = async (id) => {
    // console.log('toggle', id);
    const taskToToggle = await FetchTask(id);
    const updatedTask = { ...taskToToggle, reminder: !taskToToggle.reminder };
    const res = await fetch(`http://localhost:5000/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updatedTask)
    })
    const data = await res.json();
    setTasks(tasks.map(task =>
    (task.id === id ? { ...task, reminder: data.reminder }
      : task
    )
    )
    )
  }
  

  //add task function
  const addTask = async (task) => {
    // console.log('add', task);
    // const id = Math.floor(Math.random() * 10000) + 1;
    // const newTask = { ...task, id };
    // setTasks([...tasks, newTask]);
    const response = await fetch("http://localhost:5000/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(task)
    });
    const data = await response.json();
    setTasks([...tasks, data]);

  }



  return (
    <div className="container">
      <Header onAdd={() => setShowAddTask(!showAddTask)} showAdd={showAddTask} />
      {showAddTask && <AddTask onAdd={addTask} />}
      {tasks.length > 0 ? <Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder} /> : 'No task to show'}
    </div>
  );
}

export default App;

