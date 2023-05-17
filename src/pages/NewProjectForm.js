import React, { useEffect, useState } from "react";
import styles from "./NewProjectForm.module.css";
import Navbar from "../components/Navbar";
import { UserAuth } from "../store/AuthContext";
import { postAssignedUsers, postProject } from "../asyncCallFunctions";
import { getAllUsers } from "../asyncCallFunctions";
import Select from "react-select";
import { notifySucess } from "../utils/notify";
import { useNavigate } from "react-router-dom";
// TOASTIFY IMPORTS
import { uuidv4 } from "../utils/generateUid";

const NewProjectForm = () => {
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectStatus, setProjectStatus] = useState("");
  const [options, setOptions] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [dueDate, setDueDate] = useState("");

  // REACT ROUTER DOM IMPORTS
  const navigate = useNavigate();

  const { user } = UserAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !projectTitle ||
      !projectStatus ||
      !projectDescription ||
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

    // post project
    const id = uuidv4();

    postProject({
      id,
      title: projectTitle,
      status: projectStatus,
      description: projectDescription,
      dueDate,
      creator: user.uid,
    }).then((projectId) => {
      // post assigned users with the form
      postAssignedUsers(projectId, userData).then(() => {
        notifySucess(`${projectTitle} Added!`);
      });
    });

    setProjectTitle("");
    setProjectDescription("");
    setProjectStatus("");
    setDueDate("");
    setSelectedUsers(null);

    navigate("/dashboard");
  };

  useEffect(() => {
    // ROUTE PROTECTED
    if(!localStorage.getItem('userId')) {
      return navigate('/');
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
      <h1 className={styles.projectPage__heading}>Create a new project</h1>
      <div className={styles.form__container}>
        <div className={styles.form__content}>
          <form onSubmit={handleSubmit}>
            {/* TITLE */}
            <div className={styles.formTitle__container}>
              <label className={styles.formTitle__label} htmlFor="title">
                Project Title
              </label>
              <input
                type="text"
                id="title"
                className={styles.formTitle__input}
                value={projectTitle}
                onChange={(event) => setProjectTitle(event.target.value)}
                placeholder="Enter Title"
                required
              />
            </div>

            {/* DESCRIPTION */}
            <div className={styles.formDesc__container}>
              <label className={styles.formDesc__label} htmlFor="description">
                Project Description
              </label>
              <textarea
                rows="10"
                id="description"
                value={projectDescription}
                onChange={(event) => setProjectDescription(event.target.value)}
                className={styles.formDesc__input}
                required
              ></textarea>
            </div>

            {/* PROJECT STATUS */}
            <div className={styles.formStatus__container}>
              <label className={styles.formStatus__label} htmlFor="status">
                Project Status
              </label>
              <select
                id="status"
                value={projectStatus}
                className={styles.formStatus__input}
                onChange={(event) => setProjectStatus(event.target.value)}
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
                Add This Project
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewProjectForm;
