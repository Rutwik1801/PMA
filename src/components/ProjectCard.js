import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import { UserAuth } from "../store/AuthContext";
import { onSnapshot, collection } from "firebase/firestore";
import { db } from "../firebaseConfig";
import styles from "./ProjectCard.module.css";
import { getCurrentUser } from "../asyncCallFunctions";
import { notifySucess } from "../utils/notify";
import EditProjectModal from "./EditProjectModal";

export const ProjectCard = (props) => {
  const { user } = UserAuth();

  // EDIT PROJECT MODAL STATE
  const [showModal, setShowModal] = useState(false);

  const [assignedUsers, setAssignedUsers] = useState([]);

  const [userCanEdit, setUserCanEdit] = useState(
    props.project.creator === user.uid ? true : false
  );

  // logic for date comparison
  var date = new Date();
  let currentDate =
    date.getFullYear() +
    "-" +
    (date.getMonth() > 8 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1)) +
    "-" +
    (date.getDate() > 9 ? date.getDate() : "0" + date.getDate());
  const dateColor = props.project.dueDate > currentDate ? "green" : "red";
  // -----------------------------------------------------
  // calls the delete function in dashboard.js
  const [isAdmin, setIsAdmin] = useState();
  const handleDelete = () => {
    props.handleDelete(props.project.id);
    notifySucess("Project deleted successfully");
  };

  useEffect(() => {
    onSnapshot(
      collection(db, "projects", props.project.id, "assignedUsers"),
      (projectsData) => {
        let data = [];
        projectsData.forEach((doc) => {
          data.push({ ...doc.data() });
        });
        let temp = [];
        for (const prop in data[0]) {
          temp.push(data[0][prop]);
        }
        setAssignedUsers(temp);
        return temp;
      }
    );
    getCurrentUser().then((res) => {
      setIsAdmin(res.admin);
    });
  }, []);

  // color for status tag
  const color =
    props.project.status === "todo"
      ? "hsl(34, 97%, 64%)"
      : props.project.status === "ongoing"
      ? "hsl(212, 86%, 64%)"
      : props.project.status === "priority"
      ? " hsl(0, 78%, 62%)"
      : "hsl(180, 62%, 55%)";
  // --------------------------------
  return (
    <>
      <Card
        sx={{
          width: 300,
          margin: 2,
          backgroundColor: "#f8fafc",
        }}
      >
        <p
          className={styles.taskStatus}
          style={{
            backgroundColor: `${color}`,
          }}
        >
          {props.project.status}
        </p>
        <div style={{ marginTop: "40px", padding: "0 10px" }}>
          <p className={styles.taskTitle}>{props.project.title}</p>
          <p className={styles.taskDescription}>{props.project.description}</p>
          <div
            style={{ display: "flex", justifyContent: "space-between" }}
            sx={{ margin: 1 }}
          >
            <Link to={`/projects/${props.project.id}`}>
              <Button
                size="small"
                variant="outlined"
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "13px",
                  letterSpacing: "1px",
                }}
              >
                Start Working
              </Button>
            </Link>

            <Typography
              style={{
                color: `${dateColor}`,
                fontWeight: 400,
                fontFamily: "Poppins",
              }}
            >
              {props.project.dueDate}
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
                  onClick={() => {
                    setShowModal(true);
                  }}
                ></ion-icon>
              </div>
            )}
          </div>
        </div>

        {showModal && assignedUsers.length > 0 && (
          <EditProjectModal
            showModal={showModal}
            setShowModal={setShowModal}
            title={props.project.title}
            desc={props.project.description}
            due={props.project.dueDate}
            status={props.project.status}
            assignedUsers={assignedUsers}
            projectId={props.project.id}
            setProjectsData={props.setProjectsData}
            setAssignedUsers={setAssignedUsers}
          />
        )}
      </Card>
    </>
  );
};
