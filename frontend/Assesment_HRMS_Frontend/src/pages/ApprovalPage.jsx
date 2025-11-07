import React, { useState, useEffect } from "react";
import Header from "../componets/Header";
import Footer from "../componets/Footer";
import "./css/ApprovalPage.css";

const ApprovalPage = () => {
  const [filter, setFilter] = useState("Pending");
  const [requests, setRequests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Dummy data (later you'll fetch from backend)
  useEffect(() => {
    const dummyData = [
      { id: 1, empName: "John Doe", requestName: "Leave Request", status: "Pending" },
      { id: 2, empName: "Jane Smith", requestName: "Project Change", status: "Approved" },
      { id: 3, empName: "Rahul Patil", requestName: "Leave Request", status: "Pending" },
      { id: 4, empName: "Anjali Rao", requestName: "Project Change", status: "Approved" },
      { id: 5, empName: "Karan Singh", requestName: "Leave Request", status: "Pending" },
    ];
    setRequests(dummyData);
  }, []);

  const filteredRequests = requests.filter(
    (req) => req.status.toLowerCase() === filter.toLowerCase()
  );

  // Pagination
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentRequests = filteredRequests.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

  // Handle approve/disapprove
  const toggleStatus = (id) => {
    const updatedRequests = requests.map((req) =>
      req.id === id
        ? { ...req, status: req.status === "Approved" ? "Pending" : "Approved" }
        : req
    );
    setRequests(updatedRequests);
  };

  return (
    <div className="container">
      <Header />
      <main className="approval-main">
        <div className="approval-content">
          <h2>Approval Management</h2>

          {/* Dropdown filter */}
          <div className="filter-section">
            <label>Filter by Status: </label>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
            </select>
          </div>

          {/* Approval table */}
          <table className="approval-table">
            <thead>
              <tr>
                <th>Sr.</th>
                <th>Employee Name</th>
                <th>Request Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentRequests.length > 0 ? (
                currentRequests.map((req, index) => (
                  <tr key={req.id}>
                    <td>{indexOfFirst + index + 1}</td>
                    <td>{req.empName}</td>
                    <td>{req.requestName}</td>
                    <td>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={req.status === "Approved"}
                          onChange={() => toggleStatus(req.id)}
                        />
                        <span className="slider round"></span>
                      </label>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center" }}>
                    No {filter} requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={currentPage === i + 1 ? "active" : ""}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ApprovalPage;
