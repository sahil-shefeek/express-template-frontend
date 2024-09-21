import { useState, useEffect } from "react";
import axios from "../api/axios";
import {
  Container,
  Table,
  Button,
  Form,
  Modal,
  Spinner,
  Alert,
  Toast,
  ToastContainer,
} from "react-bootstrap";

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState({
    d_no: "",
    d_name: "",
    dept_hod: "",
  });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [errors, setErrors] = useState({});

  const fetchDepartments = async () => {
    try {
      const response = await axios.get("/departments");
      setDepartments(response.data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!currentDepartment.d_name.trim()) {
      newErrors.d_name = "Department name is required.";
    }
    if (!currentDepartment.dept_hod.trim()) {
      newErrors.dept_hod = "HOD name is required.";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      if (currentDepartment.d_no) {
        await axios.patch(
          `/departments/${currentDepartment.d_no}`,
          currentDepartment
        );
        setToastMessage("Department updated successfully!");
      } else {
        await axios.post("/departments", currentDepartment);
        setToastMessage("Department added successfully!");
      }
      fetchDepartments();
      setShowModal(false);
      setShowToast(true);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async (d_no) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      try {
        await axios.delete(`/departments/${d_no}`);
        setToastMessage("Department deleted successfully!");
        fetchDepartments();
        setShowToast(true);
      } catch (error) {
        setError(error.message);
      }
    }
  };

  const handleEdit = (department) => {
    setCurrentDepartment(department);
    setShowModal(true);
    setErrors({});
  };

  const handleAddNew = () => {
    setCurrentDepartment({
      d_no: "",
      d_name: "",
      dept_hod: "",
    });
    setShowModal(true);
    setErrors({});
  };

  return (
    <Container>
      <h2>Departments</h2>
      {loading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}
      {!loading && departments.length === 0 && (
        <Alert variant="info">No departments available.</Alert>
      )}
      <Button onClick={handleAddNew} className="mb-3">
        Add New Department
      </Button>
      <Table responsive striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>HOD</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {departments.map((dept) => (
            <tr key={dept.d_no}>
              <td>{dept.d_name}</td>
              <td>{dept.dept_hod}</td>
              <td>
                <Button variant="warning" onClick={() => handleEdit(dept)}>
                  Edit
                </Button>{" "}
                <Button
                  variant="danger"
                  onClick={() => handleDelete(dept.d_no)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {currentDepartment.d_no ? "Edit Department" : "Add Department"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="d_name">
              <Form.Label>Department Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter department name"
                value={currentDepartment.d_name}
                onChange={(e) =>
                  setCurrentDepartment({
                    ...currentDepartment,
                    d_name: e.target.value,
                  })
                }
                isInvalid={!!errors.d_name}
              />
              <Form.Control.Feedback type="invalid">
                {errors.d_name}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="dept_hod">
              <Form.Label>HOD</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter HOD name"
                value={currentDepartment.dept_hod}
                onChange={(e) =>
                  setCurrentDepartment({
                    ...currentDepartment,
                    dept_hod: e.target.value,
                  })
                }
                isInvalid={!!errors.dept_hod}
              />
              <Form.Control.Feedback type="invalid">
                {errors.dept_hod}
              </Form.Control.Feedback>
            </Form.Group>

            <Button variant="primary" type="submit" className="mt-3">
              {currentDepartment.d_no ? "Update" : "Add"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <ToastContainer
        className="p-3"
        position="bottom-end"
        style={{ zIndex: 1 }}
      >
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={3000}
          autohide
        >
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
};

export default Departments;
