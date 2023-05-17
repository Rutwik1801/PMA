import React, { useState, useEffect } from "react";
import { UserAuth } from "../store/AuthContext";
import { getAssignedTaskUsers } from "../asyncCallFunctions";
import { useParams } from "react-router-dom";
import styles from "./ProjectCard.module.css";
import { Card, Typography } from "@mui/material";
import EditTaskModal from "./EditTaskModal";

// creates the task component
function Task(props) {
  // AUTH CONTEXT DATA
  const { user } = UserAuth();
  // REACT STATES
  const [isAdmin, setIsAdmin] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [userCanEdit, setUserCanEdit] = useState(
    props.taskData.creator == user.uid ? true : false
  );
  const [assignedUsers, setAssignedUsers] = useState([]);

  // REACT ROUTER IMPORTS
  const params = useParams();

  // logic for date comparison
  var date = new Date();
  let currentDate =
    date.getFullYear() +
    "-" +
    (date.getMonth() > 8 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1)) +
    "-" +
    (date.getDate() > 9 ? date.getDate() : "0" + date.getDate());
  const dateColor = props.taskData.dueDate > currentDate ? "green" : "red";

  useEffect(() => {
    // get assigned users for each project
    getAssignedTaskUsers(params.id, props.taskData.id).then((data) => {
      // gives object of objects, so converting it to array of objects
      let temp = [];
      for (const prop in data[0]) {
        temp.push(data[0][prop]);
      }
      setAssignedUsers(temp);
    });

    
  }, []);

  // to handle update task functionality
  const handleEdit = () => {
    setShowModal(true);
  };
  // to handle delete task functionality
  const handleDelete = () => {
    props.handleDelete(props.taskData.id);
  };
// change color according to status
  const color =
    props.taskData.status === "todo"
      ? "hsl(34, 97%, 64%)"
      : props.taskData.status === "ongoing"
      ? "hsl(212, 86%, 64%)"
      : props.taskData.status === "priority"
      ? " hsl(0, 78%, 62%)"
      : "hsl(180, 62%, 55%)";

  return (
    <>
      <Card
        sx={{
          width: props.windowSize <= 740 ? "65vw" : "280px",
          margin: 2,
          backgroundColor: "#f8fafc",
        }}
        style={{ border: `4px solid ${color}` }}
      >
        <div style={{ marginTop: "40px", padding: "0 10px" }}>
          <p className={styles.taskTitle}>{props.taskData.title}</p>
          <p className={styles.taskDescription}>{props.taskData.description}</p>
          <div
            style={{ display: "flex", justifyContent: "space-between" }}
            sx={{ margin: 1 }}
          >
            <Typography style={{ color: `${dateColor}`, marginLeft: "10px" }}>
              {props.taskData.dueDate}
            </Typography>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ margin: "20px 5px" }}>
              {assignedUsers.map((data) => {
                // to display photos
                return (
                  <img
                    className={styles.userImg}
                    key={data.id}
                    src={data.photo}
                  ></img>
                );
              })}
            </div>

            {(userCanEdit || isAdmin) && (
              <div className={styles.iconsDiv}>
                <ion-icon
                  name="trash-outline"
                  style={{
                    fontSize: 26,
                    color: "hsl(0, 78%, 62%)",
                    cursor: "pointer",
                  }}
                  onClick={handleDelete}
                ></ion-icon>
                <ion-icon
                  name="create"
                  style={{
                    fontSize: 26,
                    color: "hsl(212, 86%, 64%)",
                    marginLeft: "10px",
                    cursor: "pointer",
                  }}
                  onClick={handleEdit}
                ></ion-icon>
              </div>
            )}
          </div>
        </div>
        {showModal && (
          <EditTaskModal
            projectId={params.id}
            taskId={props.taskData.id}
            showModal={showModal}
            setShowModal={setShowModal}
            title={props.taskData.title}
            desc={props.taskData.description}
            status={props.taskData.status}
            due={props.taskData.dueDate}
            assignedUsers={assignedUsers}
          />
        )}
      </Card>
    </>
  );
}

export default Task;
