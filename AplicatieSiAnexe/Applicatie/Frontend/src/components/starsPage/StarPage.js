import React, { useState, useEffect } from 'react';
import "./StarPage.css"

function StarPage() {
  const [stars, setStars] = useState([]);
  const [sortBy, setSortBy] = useState('approvalDate');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchStars = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/polaris/stars/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch stars');
        }
  
        const data = await response.json();
        setStars(data);
      } catch (error) {
        console.error('Error fetching stars:', error);
      }
    };

    fetchStars();
  }, []);

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const parseDateFromString = (dateString) => {
    const [day, month, year] = dateString.split('/');
    return new Date(`${year}-${month}-${day}`);
  };

  const filteredStars = stars.filter(star =>
    star.proper_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedStars = filteredStars.slice().sort((a, b) => {
    if (sortBy === 'approvalDate') {
      return parseDateFromString(a.approval_date) - parseDateFromString(b.approval_date);
    } else if (sortBy === 'alphabetical') {
      return a.proper_name.localeCompare(b.proper_name);
    }
  });

  return (
    <div>
      <h1>Star Table</h1>
      <div>
        <label htmlFor="sortDropdown">Sort by:</label>
        <select id="sortDropdown" value={sortBy} onChange={handleSortChange}>
          <option value="approvalDate">Approval Date</option>
          <option value="alphabetical">Alphabetical</option>
        </select>
      </div>
      <div className="search-container">
        <label htmlFor="searchInput">Search by name:</label>
        <input
          type="text"
          id="searchInput"
          className="search-input"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>
      <div style={{ overflowY: 'auto', maxHeight: '750px' }}>
        <table className='styled-table'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Designation</th>
              <th>Hip</th>
              <th>Bayer</th>
              <th>Additional Info</th>
              <th>Approval Status</th>
              <th>Approval Date</th>
            </tr>
          </thead>
          <tbody>
            {sortedStars.map(star => (
              <tr key={star.id}>
                <td>{star.proper_name}</td>
                <td>{star.designation}</td>
                <td>{star.hip}</td>
                <td>{star.bayer}</td>
                <td>{star.additional_info}</td>
                <td>{star.approval_status}</td>
                <td>{star.approval_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StarPage;
