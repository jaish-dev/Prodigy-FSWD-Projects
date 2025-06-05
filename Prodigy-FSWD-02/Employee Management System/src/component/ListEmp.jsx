import React from "react";
import { NavLink } from "react-router-dom";

const ListEmp = () => {
  return (
    <div>
      <div className="container-fluid">
        <div className="row mt-4">
          <div className="col-12 px-4">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h4 className="m-0">EMPLOYEE LIST</h4>
                <NavLink className="btn btn-primary btn-sm">Add Employee</NavLink>
              </div>
              <div className="card-body">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">First</th>
                      <th scope="col">Last</th>
                      <th scope="col">Handle</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th scope="row">1</th>
                      <td>Mark</td>
                      <td>Otto</td>
                      <td>@mdo</td>
                    </tr>
                    <tr>
                      <th scope="row">2</th>
                      <td>Jacob</td>
                      <td>Thornton</td>
                      <td>@fat</td>
                    </tr>
                    <tr>
                      <th scope="row">3</th>
                      <td>Larry</td>
                      <td>the Bird</td>
                      <td>@twitter</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListEmp;
