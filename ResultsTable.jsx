import React, { useState, useMemo } from "react";

const ResultsTable = ({ data }) => {
  const [sortConfig, setSortConfig] = useState({
    key: "rank",
    direction: "ascending",
  });

  const sortedData = useMemo(() => {
    if (!data || data.length === 0) {
      return [];
    }
    let sortableData = [...data];
    if (sortConfig.key !== null) {
      sortableData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  }, [data, sortConfig]);

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "ascending" ? " 🔼" : " 🔽";
    }
    return "";
  };

  if (!data || data.length === 0) {
    return (
      <p>
        No analysis results to display. Process the data to see the rankings.
      </p>
    );
  }

  const headers = Object.keys(data[0] || {});

  // Make column headers more readable
  const formatHeader = (header) => {
    return header
      .replace(/_/g, " ")
      .replace(/pc/g, "percent change")
      .replace(/nw/g, "non-work")
      .replace(/ej/g, "EJ")
      .replace(/cong/g, "congestion")
      .replace(/mil/g, "(mil)")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="mt-5 overflow-hidden rounded-lg border border-gray-200 shadow-sm">
      <div className="max-h-[60vh] overflow-y-auto">
        <table className="min-w-full divide-y divide-gray-200 border-collapse">
          <thead>
            <tr>
              {headers.map((key) => (
                <th
                  key={key}
                  onClick={() => requestSort(key)}
                  className="sticky top-0 z-10 cursor-pointer bg-gray-50 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  <div className="flex items-center">
                    {formatHeader(key)}
                    <span className="ml-1 text-gray-400">
                      {getSortIndicator(key)}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {sortedData.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50">
                {headers.map((key) => (
                  <td
                    key={key}
                    className="whitespace-nowrap px-4 py-3 text-center text-sm text-gray-700"
                  >
                    {typeof row[key] === "number"
                      ? row[key].toFixed(2)
                      : row[key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultsTable;
