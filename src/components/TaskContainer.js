import React, { useState, useEffect } from "react";
import Task from "./Task";
import styles from "./TaskContainer.module.css";
import { useParams } from "react-router-dom";
import { deleteTask, getAllTasks } from "../asyncCallFunctions";
import { notifySucess } from "../utils/notify";
// creates the individual lists for todo ongoing completed priority

function TaskContainer(props) {
  // accordion state
  const [showTasks, setShowTasks] = useState(
    window.innerWidth <= 740 ? false : true
  );
  // get window size as the size changes
  const [windowSize, setWindowSize] = useState(window.innerWidth);

  useEffect(() => {
    // logic to get the window size
    const handleTaskShow = () => {
      setShowTasks(window.innerWidth <= 740 ? false : true);
    };
    const handleWindowResize = () => {
      handleTaskShow();
      setWindowSize(window.innerWidth);
    };

    window.addEventListener("resize", handleWindowResize);
    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);
  // change color based on status
  const color =
    props.containerData === "todo"
      ? "hsl(34, 97%, 64%)"
      : props.containerData === "ongoing"
      ? "hsl(212, 86%, 64%)"
      : props.containerData === "priority"
      ? " hsl(0, 78%, 62%)"
      : "hsl(180, 62%, 55%)";

  const params = useParams();
  const [taskData, setTaskData] = useState(props.tasksData.filter(filterTasks));
  // filters the data to show tasks with the status equal to the particular list
  function filterTasks(task) {
    return task.status === props.containerData;
  }

  // delete task function----------------
  const handleDelete = async (id) => {
    deleteTask(params.id, id).then(() => {
      getAllTasks(params.id).then((data) => {
        setTaskData(data.filter(filterTasks));
        notifySucess("Deleted Successfully");
      });
    });
  };

  // --------------------------------
  return (
    <div className={styles.Bg}>
      <div style={{ border: `4px solid ${color}` }} className={styles.header}>
        <p className={styles.heading}>{props.containerData}</p>
        {windowSize <= 740 && (
          <ion-icon
            name="caret-down-outline"
            style={{ fontSize: 26, color: `${color}` }}
            onClick={() => {
              setShowTasks(!showTasks);
            }}
          ></ion-icon>
        )}
      </div>
      {
        <div
          className={styles.TaskContainer}
          style={{
            height: showTasks ? "450px" : 0,
            width: windowSize <= 740 ? "70vw" : "320px",
          }}
        >
          {taskData.length > 0 ? (
            taskData.map((task) => {
              return (
                // for individual task
                <Task
                  key={task.id}
                  taskData={task}
                  handleDelete={handleDelete}
                  windowSize={windowSize}
                />
              );
            })
          ) : (
            <p className={styles.taskpara}>No Tasks At The moment</p>
          )}
        </div>
      }
    </div>
  );
}

export default TaskContainer;
