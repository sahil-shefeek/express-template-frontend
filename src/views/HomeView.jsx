import Departments from "../components/Departments";
import Employees from "../components/Employees";
import { Container, Tabs, Tab, Card } from "react-bootstrap";

export default function HomeView() {
  return (
    <Container fluid className="m-2 p-5 rounded shadow">
      <Card className="shadow-lg rounded p-4">
        <h1 className="text-center mb-4">Department and Employee Management</h1>
        <Tabs
          defaultActiveKey="departments"
          id="management-tabs"
          className="mb-3"
          fill
        >
          <Tab eventKey="departments" title="Departments">
            <Card className="shadow-sm rounded p-3">
              <Departments />
            </Card>
          </Tab>
          <Tab eventKey="employees" title="Employees">
            <Card className="shadow-sm rounded p-3">
              <Employees />
            </Card>
          </Tab>
        </Tabs>
      </Card>
    </Container>
  );
}
