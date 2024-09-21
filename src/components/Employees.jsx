import { useEffect, useState } from "react";
import {
  Container,
  Table,
  Button,
  Form,
  Modal,
  Alert,
  Spinner,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import axios from "../api/axios";

const EmployeeManager = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingEmployeeId, setEditingEmployeeId] = useState(null);
  const [formData, setFormData] = useState({
    e_name: "",
    salary: "",
    d_no: "",
    mgr_no: "",
    date_of_join: "",
    designation: "",
  });
  const [errors, setErrors] = useState({});
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("/employees");
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get("/departments");
      setDepartments(response.data);
    } catch (error) {
      console.error("Error fetching departments", error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.e_name) newErrors.e_name = "Employee name is required";
    if (!formData.salary) newErrors.salary = "Salary is required";
    if (!formData.d_no) newErrors.d_no = "Department is required";
    if (!formData.mgr_no) newErrors.mgr_no = "Manager is required";
    if (!formData.date_of_join)
      newErrors.date_of_join = "Date of joining is required";
    if (!formData.designation)
      newErrors.designation = "Designation is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const formattedDate = new Date(formData.date_of_join)
          .toISOString()
          .split("T")[0];
        const dataToSubmit = { ...formData, date_of_join: formattedDate };

        if (isEditing) {
          await axios.put(`/employees/${editingEmployeeId}`, dataToSubmit);
          setToastMessage("Employee updated successfully!");
        } else {
          await axios.post("/employees", dataToSubmit);
          setToastMessage("Employee added successfully!");
        }
        fetchEmployees();
        setShowToast(true);
        setShowModal(false); // Close the modal
        resetForm();
      } catch (error) {
        console.error("Error submitting employee data", error);
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/employees/${id}`);
      setToastMessage("Employee deleted successfully!");
      fetchEmployees();
      setShowToast(true);
    } catch (error) {
      console.error("Error deleting employee", error);
    }
  };

  const handleEdit = (emp) => {
    setFormData(emp);
    setEditingEmployeeId(emp.e_no);
    setIsEditing(true);
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      e_name: "",
      salary: "",
      d_no: "",
      mgr_no: "",
      date_of_join: "",
      designation: "",
    });
    setErrors({});
  };

  return (
    <Container fluid>
      <h2>Employees</h2>

      <Button variant="primary" onClick={() => setShowModal(true)}>
        Add New Employee
      </Button>

      {loading ? (
        <Spinner animation="border" />
      ) : employees.length === 0 ? (
        <Alert variant="info">No employees found</Alert>
      ) : (
        <Table responsive striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Salary</th>
              <th>Department</th>
              <th>Manager</th>
              <th>Date of Joining</th>
              <th>Designation</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp, idx) => (
              <tr key={emp.e_no}>
                <td>{idx + 1}</td>
                <td>{emp.e_name}</td>
                <td>{emp.salary}</td>
                <td>{emp.department?.d_name || "N/A"}</td>
                <td>{emp.mgr_no}</td>
                <td>{emp.date_of_join?.split("T")[0]}</td>
                <td>{emp.designation}</td>
                <td>
                  <Button
                    className="me-2"
                    variant="warning"
                    onClick={() => handleEdit(emp)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(emp.e_no)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {isEditing ? "Edit Employee" : "Add Employee"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Employee Name</Form.Label>
              <Form.Control
                type="text"
                name="e_name"
                value={formData.e_name}
                onChange={handleInputChange}
                isInvalid={!!errors.e_name}
              />
              <Form.Control.Feedback type="invalid">
                {errors.e_name}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group>
              <Form.Label>Salary</Form.Label>
              <Form.Control
                type="text"
                name="salary"
                value={formData.salary}
                onChange={handleInputChange}
                isInvalid={!!errors.salary}
              />
              <Form.Control.Feedback type="invalid">
                {errors.salary}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group>
              <Form.Label>Department</Form.Label>
              {departments.length === 0 ? (
                <Alert variant="warning">No departments available</Alert>
              ) : (
                <Form.Control
                  as="select"
                  name="d_no"
                  value={formData.d_no}
                  onChange={handleInputChange}
                  isInvalid={!!errors.d_no}
                >
                  <option value="">Select a department</option>
                  {departments.map((dept) => (
                    <option key={dept.d_no} value={dept.d_no}>
                      {dept.d_name}
                    </option>
                  ))}
                </Form.Control>
              )}
              <Form.Control.Feedback type="invalid">
                {errors.d_no}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group>
              <Form.Label>Manager Number</Form.Label>
              <Form.Control
                type="text"
                name="mgr_no"
                value={formData.mgr_no}
                onChange={handleInputChange}
                isInvalid={!!errors.mgr_no}
              />
              <Form.Control.Feedback type="invalid">
                {errors.mgr_no}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group>
              <Form.Label>Date of Joining</Form.Label>
              <Form.Control
                type="date"
                name="date_of_join"
                value={formData.date_of_join}
                onChange={handleInputChange}
                isInvalid={!!errors.date_of_join}
              />
              <Form.Control.Feedback type="invalid">
                {errors.date_of_join}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group>
              <Form.Label>Designation</Form.Label>
              <Form.Control
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleInputChange}
                isInvalid={!!errors.designation}
              />
              <Form.Control.Feedback type="invalid">
                {errors.designation}
              </Form.Control.Feedback>
            </Form.Group>

            <Button type="submit" variant="primary" className="mt-3">
              {isEditing ? "Update Employee" : "Add Employee"}
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
          className="mb-3"
        >
          <Toast.Header>
            <strong className="me-auto">Success</strong>
          </Toast.Header>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
};

export default EmployeeManager;
