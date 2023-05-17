import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { containerData } from "../dummyData";
import TaskContainer from "../components/TaskContainer";
import { useNavigate, useParams,Link } from "react-router-dom";
import { onSnapshot, collection } from "firebase/firestore";
import { db } from "../firebaseConfig";
import styles from "./TasksPage.module.css";
import { checkProject } from "../asyncCallFunctions";
import { notifyError } from "../utils/notify";
import { Blocks } from "react-loader-spinner";

// this is the main tasks page
function TasksPage(props) {
  const params = useParams();
  const navigate = useNavigate();
  const [tasksData, setTasksData] = useState();
  const [isLoading, setIsLoading] = useState(false);

 
  useEffect(() => {
    setIsLoading(true);
    // check if project exists for a given id in route
    checkProject(params.id).then((data) => {
      if (!data.find((id) => id === params.id)) {
        notifyError("No such project found");
        navigate("/dashboard");
      }
    });
// listening to realtime project changes
    let data = [];
    onSnapshot(collection(db, "projects", params.id, "tasks"), (taskData) => {
      taskData.forEach((doc) => {
        data.push({ ...doc.data(), id: doc.id });
      });
      setTasksData(data);
      setIsLoading(false);
      return data;
    })
  }, []);

  return (
    <div style={{ backgroundColor: "rgb(240, 253, 244)", overflowX: "hidden", minHeight: "100vh" }}>
      {/* reusable navbar */}
      <Navbar />
      {/* LOADER SPINNER */}
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}
      >
        {isLoading && <Blocks />}
      </div>

      {!isLoading && (
        <div className={styles.btn__container}>
          <Link to="./new-task">
            <button className={styles.addProject__btn}>ADD NEW Task</button>
          </Link>
        </div>
      )}

      {/* dummy container data that contains the status titles like ongoing todo completed */}
      {!isLoading && (
        <div className={styles.TasksPage}>
          {tasksData &&
            containerData &&
            containerData.map((container, index) => {
              return (
                // creates the list which will surround the tasks
                <TaskContainer
                  key={index}
                  containerData={container}
                  tasksData={tasksData}
                />
              );
            })}
        </div>
      )}
    </div>
  );
}

export default TasksPage;
