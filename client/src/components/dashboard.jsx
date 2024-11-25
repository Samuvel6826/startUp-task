import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Button, Spinner, Alert, Card, Typography, Select, Option, Input } from "@material-tailwind/react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [filterList, setFilterList] = useState([{ column: "", value: "" }]);

    // Base URL from environment variable
    const BASE_URL = import.meta.env.VITE_SERVER_HOST_URL;

    const columns = [
        { value: "name", label: "Name" },
        { value: "grade", label: "Grade" },
        { value: "age", label: "Age" },
        { value: "gender", label: "Gender" },
        { value: "subject", label: "Subject" },
        { value: "marks", label: "Marks" },
    ];

    // Fetch users from the API
    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const res = await axios.get(`${BASE_URL}/users`);
            setUsers(res.data.data || []);
            setFilteredUsers(res.data.data || []);
        } catch (err) {
            console.error(err);
            setError("Failed to fetch users. Please try again.");
        } finally {
            setLoading(false);
        }
    }, [BASE_URL]);

    // Apply filters
    const applyFilters = useCallback(() => {
        let result = users;

        filterList.forEach(filter => {
            if (filter.column && filter.value) {
                result = result.filter(user =>
                    String(user[filter.column])
                        .toLowerCase()
                        .includes(filter.value.toLowerCase())
                );
            }
        });

        setFilteredUsers(result);
    }, [users, filterList]);

    // Handle filter changes
    const handleFilterChange = (index, field, value) => {
        const newFilters = [...filterList];
        newFilters[index] = { ...newFilters[index], [field]: value };
        setFilterList(newFilters);
    };

    // Add new filter
    const addFilter = () => {
        setFilterList([...filterList, { column: "", value: "" }]);
    };

    // Remove filter
    const removeFilter = (index) => {
        const newFilters = filterList.filter((_, i) => i !== index);
        setFilterList(newFilters);
    };

    useEffect(() => {
        applyFilters();
    }, [applyFilters]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const chartData = {
        labels: filteredUsers.map((user) => user.name),
        datasets: [
            {
                label: "Marks",
                data: filteredUsers.map((user) => user.marks),
                backgroundColor: "rgba(59, 130, 246, 0.8)",
                borderColor: "rgb(59, 130, 246)",
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="mx-auto max-w-[1200px] p-8">
            <div className="flex flex-wrap items-center gap-4">
                {/* Dashboard Title */}
                <Typography
                    variant="h2"
                    className="text-2xl font-bold"
                >
                    Student Dashboard
                </Typography>

                {/* Button with Link */}
                <a
                    href="https://github.com/Samuvel6826/startUp-task.git"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block rounded-xl border border-blue-500 px-4 py-2 text-blue-500 transition duration-300 hover:bg-blue-500 hover:text-white focus:outline-none focus:ring focus:ring-blue-300"
                >
                    Source Code
                </a>
            </div>

            {error && (
                <Alert color="red" className="mb-4">
                    {error}
                </Alert>
            )}

            {/* Filters Section */}
            <Card className="mb-6 p-4">
                <div className="mb-4 flex items-center justify-between">
                    <Typography variant="h6">Filters</Typography>
                    <Button
                        size="sm"
                        className="flex items-center gap-2 bg-blue-500"
                        onClick={addFilter}
                    >
                        Add Filter
                    </Button>
                </div>

                {filterList.map((filter, index) => (
                    <div key={index} className="mb-4 flex gap-4">
                        <Select
                            value={filter.column}
                            onChange={(value) => handleFilterChange(index, "column", value)}
                            label="Select column"
                            className="flex-1"
                        >
                            {columns.map((col) => (
                                <Option key={col.value} value={col.value}>
                                    {col.label}
                                </Option>
                            ))}
                        </Select>

                        <Input
                            type="text"
                            label="Filter value..."
                            value={filter.value}
                            onChange={(e) => handleFilterChange(index, "value", e.target.value)}
                            className="flex-1"
                        />

                        <Button
                            color="red"
                            variant="text"
                            className="px-4"
                            onClick={() => removeFilter(index)}
                        >
                            Remove
                        </Button>
                    </div>
                ))}
            </Card>

            {/* Rest of the component remains the same */}
            {loading ? (
                <div className="flex h-32 items-center justify-center">
                    <Spinner className="h-12 w-12" />
                </div>
            ) : (
                <>
                    {/* Table */}
                    <Card className="mb-8 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-max table-auto text-left">
                                <thead>
                                    <tr>
                                        {columns.map((col) => (
                                            <th key={col.value} className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-normal leading-none opacity-70"
                                                >
                                                    {col.label}
                                                </Typography>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map((user, index) => (
                                        <tr key={user._id || index} className="even:bg-blue-gray-50/50">
                                            {columns.map((col) => (
                                                <td key={col.value} className="p-4">
                                                    <Typography variant="small" color="blue-gray">
                                                        {user[col.value]}
                                                    </Typography>
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>

                    {/* Bar Chart */}
                    <Card className="p-6">
                        <Typography variant="h5" color="blue-gray" className="mb-4">
                            Student Marks Distribution
                        </Typography>
                        <div className="h-96">
                            {filteredUsers.length > 0 ? (
                                <Bar
                                    data={chartData}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        scales: {
                                            y: {
                                                beginAtZero: true,
                                                max: 100,
                                            },
                                        },
                                    }}
                                />
                            ) : (
                                <Typography>No data to display in the chart.</Typography>
                            )}
                        </div>
                    </Card>
                </>
            )}
        </div>
    );
};

export default Dashboard;