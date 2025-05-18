import React from "react";

// Example component imports
import Button from "../components/ui/Button";
// import Card from "../components/Card";
// import Modal from "../components/Modal";

// Add your actual component imports above

const componentsList = [
  {
    name: "Primary Button",
    component: <Button variant="primary">Ação Principal</Button>,
  },
  {
    name: "Secondary Button",
    component: <Button variant="secondary">Ação Secundária</Button>,
  },
  {
    name: "Danger Button",
    component: <Button variant="danger">Ação Perigosa</Button>,
  },

  // { name: "Card", component: <Card /> },
  // { name: "Modal", component: <Modal /> },
  // Add your components here
];

const ComponentsPage: React.FC = () => {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>All Components</h1>
      <ul>
        {componentsList.length === 0 && (
          <li>No components found. Add your components to the list.</li>
        )}
        {componentsList.map(({ name, component }) => (
          <li key={name} style={{ marginBottom: "2rem" }}>
            <h2>{name}</h2>
            <div>{component}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ComponentsPage;
