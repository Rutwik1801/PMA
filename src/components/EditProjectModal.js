import React from "react";
import { useState, useEffect } from "react";
import Modal from "react-modal";
import styles from "./Modal.module.css";
import Select from "react-select";
import { getAllUsers } from "../asyncCallFunctions";
import { notifySucess } from "../utils/notify";
import { editProject } from "../asyncCallFunctions";
import { UserAuth } from "../store/AuthContext";
import { uuidv4 } from "../utils/generateUid";
import { editAssignedUsers } from "../asyncCallFunctions";
import { getAssignedUsers } from "../asyncCallFunctions";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    outerWidth: "40vh",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#f8fafc",
    border: "1px solid rgb(0 0 0 / 0.1)",
  },
};

Modal.setAppElement("#modal");

function EditProjectModal({
  projectId,
  showModal,
  setShowModal,
  title,
  desc,
  status,
  due,
  assignedUsers,
  setAssignedUsers,
}) {
  const [projectTitle, setProjectTitle] = useState(title);
  const [projectDescription, setProjectDescription] = useState(desc);
  const [projectStatus, setProjectStatus] = useState(status);
  const [dueDate, setDueDate] = useState(due);
  const [allUsers, setAllUsers] = useState([]); // it will contain id, photourl, name etc.
  const [allUsersOption, setAllUsersOption] = useState([]); // it will contain only id, value, label for SELECT BOX 
  const [selectedUsers, setSelectedUsers] = useState(null);

  const { user } = UserAuth();

  function closeModal() {
    setShowModal(false);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !projectTitle ||
      !projectStatus ||
      !projectDescription ||
      !dueDate ||
      selectedUsers.length <= 0
    ) {
      return;
    }

    const id = uuidv4();

    // for assignedUsers collection
    const userData = [];

    // userData for assignedUsers collection
    selectedUsers.forEach((ele) => {
      const userObject = allUsers.filter((e) => {
        return e.id === ele.id;
      });
      userData.push(userObject[0]);
    });

    editProject(projectId, {
      id,
      title: projectTitle,
      status: projectStatus,
      description: projectDescription,
      dueDate,
      creator: user.uid,
    }).then(() => {
      editAssignedUsers(projectId, userData);
    });

    // GET UPDATED ASSIGNED USER
    getAssignedUsers(projectId).then((data) => {
      let temp = [];
      for (const prop in data[0]) {
        temp.push(data[0][prop]);
      }
      setAssignedUsers(temp);
    });

    setShowModal(false);
    notifySucess("Updated");
  };

  // GET DATA
  useEffect(() => {
    getAllUsers().then((data) => {
      let temp = [];
      data.forEach((val) => {
        temp.push({
          id: val.id,
          value: val.email,
          label: val.email,
        });
      });
      setAllUsersOption(temp);
      setAllUsers(data);
    });


    const temp = [];
    assignedUsers.forEach((val) => {
      temp.push({
        id: val.id,
        value: val.email,
        label: val.email,
      });
    });

    setSelectedUsers(temp);
  }, []);

  return (
    <>
      <Modal
        isOpen={showModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Edit Project Modal"
      >
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
                rows="3"
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
              <Select
                options={allUsersOption}
                value={selectedUsers}
                onChange={(option) => setSelectedUsers(option)}
                isMulti
              />
            </div>
            <div className={styles.submitBtn__container}>
              <button type="submit" className={styles.formSubmit__btn}>
                Update
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}

export default EditProjectModal;
