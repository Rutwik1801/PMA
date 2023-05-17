import React, { useEffect, useState } from "react";
import styles from "./NewProjectForm.module.css";
import Navbar from "../components/Navbar";
import { UserAuth } from "../store/AuthContext";
import { postTask } from "../asyncCallFunctions";
import { useParams, useNavigate } from "react-router-dom";
import { getAllUsers } from "../asyncCallFunctions";
import { notifyError, notifySucess } from "../utils/notify";
import Select from "react-select";
import { uuidv4 } from "../utils/generateUid";
import { postAssignedTaskUsers } from "../asyncCallFunctions";

const NewTaskForm = () => {
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskStatus, setTaskStatus] = useState("");
  const [options, setOptions] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [dueDate, setDueDate] = useState("");

  // REACT-ROUTER-DOM IMPORTS
  const navigate = useNavigate();
  const params = useParams();

  // AUTH CONTEXT IMPORTS
  const { user } = UserAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !taskTitle ||
      !taskStatus ||
      !taskDescription ||
      !dueDate ||
      selectedUsers.length <= 0
    ) {
      return;
    }

    // for assignedUsers collection
    const userData = [];

    // userData for assignedUsers collection
    selectedUsers.forEach((ele) => {
      const userObject = allUsers.filter((e) => {
        return e.id === ele.id;
      });
      userData.push(userObject[0]);
    });
// generates unique id 
    const id = uuidv4();
// posts task to backend
    postTask(params.id, {
      id,
      creator: user.uid,
      title: taskTitle,
      status: taskStatus,
      description: taskDescription,
      dueDate,
    }).then((projectId) => {
      // posts the assigned users to backend
      postAssignedTaskUsers(projectId, id, userData)
        .then(() => {
          notifySucess("Task Added!");
        })
        .catch((err) => {
          notifyError("Something went wrong!");
        });
    });

    setTaskTitle("");
    setTaskDescription("");
    setTaskStatus("");
    setDueDate("");
    setSelectedUsers(null);

    navigate(`/projects/${params.id}`);
  };

  useEffect(() => {
    // ROUTE PROTECTED
    if (!localStorage.getItem("userId")) {
      return navigate("/");
    }

    getAllUsers().then((data) => {
      let temp = [];
      data.forEach((val) => {
        temp.push({
          id: val.id,
          value: val.email,
          label: val.email,
        });
      });
      setAllUsers(data);
      setOptions(temp);
    });
  }, []);

  return (
    <div className={styles.formPage}>
      <Navbar />
      <h1 className={styles.projectPage__heading}>Create a new task</h1>
      <div className={styles.form__container}>
        <div className={styles.form__content}>
          <form onSubmit={handleSubmit}>
            {/* TITLE */}
            <div className={styles.formTitle__container}>
              <label className={styles.formTitle__label} htmlFor="title">
                Task Title
              </label>
              <input
                type="text"
                id="title"
                className={styles.formTitle__input}
                value={taskTitle}
                onChange={(event) => setTaskTitle(event.target.value)}
                placeholder="Enter Title"
                required
              />
            </div>

            {/* DESCRIPTION */}
            <div className={styles.formDesc__container}>
              <label className={styles.formDesc__label} htmlFor="description">
                Task Description
              </label>
              <textarea
                rows="10"
                id="description"
                value={taskDescription}
                onChange={(event) => setTaskDescription(event.target.value)}
                className={styles.formDesc__input}
                required
              ></textarea>
            </div>

            {/* PROJECT STATUS */}
            <div className={styles.formStatus__container}>
              <label className={styles.formStatus__label} htmlFor="status">
                Task Status
              </label>
              <select
                id="status"
                value={taskStatus}
                className={styles.formStatus__input}
                onChange={(event) => setTaskStatus(event.target.value)}
              >
                <option value="">Select Status</option>
                <option value="todo">Todo</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="priority">Priority</option>
              </select>
            </div>

            {/* PROJECT DUE DATE */}
            <div className={styles.formStatus__container}>
              <label className={styles.formStatus__label} htmlFor="date">
                Due Date
              </label>
              <input
                id="date"
                type="date"
                value={dueDate}
                className={styles.formStatus__input}
                onChange={(event) => setDueDate(event.target.value)}
              />
            </div>

            {/* ADD USERS */}
            <div className={styles.formStatus__container}>
              <label className={styles.formStatus__label} htmlFor="status">
                Add Users
              </label>
              {/* THIS SELECT COMES FROM REACT_SELECT PACKAGE */}
              <Select
                options={options}
                value={selectedUsers}
                onChange={(option) => setSelectedUsers(option)}
                isMulti
              />
            </div>

            <div className={styles.submitBtn__container}>
              <button type="submit" className={styles.formSubmit__btn}>
                Add Task
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewTaskForm;
