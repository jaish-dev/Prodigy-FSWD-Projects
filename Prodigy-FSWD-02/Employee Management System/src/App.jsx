import React, {createContext} from "react";
import Navbar from "./component/Navbar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AddEmp from "./component/AddEmp";
import ListEmp from "./component/ListEmp";
import ViewEmp from "./component/ViewEmp";
import "./App.css";

const listContext = createContext();

const App = () => {
  const [Employeelist, setEmployeeList] = React.useState([]);

  return (
    <>
      <listContext.Provider value={{ Employeelist, setEmployeeList }}>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<ListEmp />} />
            <Route path="/add" element={<AddEmp />} />
            <Route path="/view/:id" element={<ViewEmp />} />
          </Routes>
        </Router>
      </listContext.Provider>
    </>
  );
};

export { listContext }

export default App;
