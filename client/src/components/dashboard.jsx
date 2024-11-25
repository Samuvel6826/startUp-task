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

    const BASE_URL = import.meta.env.VITE_SERVER_HOST_URL;

    const columns = [
        { value: "name", label: "Name" },
        { value: "grade", label: "Grade" },
        { value: "age", label: "Age" },
        { value: "gender", label: "Gender" },
        { value: "subject", label: "Subject" },
        { value: "marks", label: "Marks" },
    ];

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

    const handleFilterChange = (index, field, value) => {
        const newFilters = [...filterList];
        newFilters[index] = { ...newFilters[index], [field]: value };
        setFilterList(newFilters);
    };

    const addFilter = () => {
        setFilterList([...filterList, { column: "", value: "" }]);
    };

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
        <div className="mx-auto max-w-[1200px] p-4 md:p-8">
            <div className="flex flex-wrap items-center gap-4">
                <Typography
                    variant="h2"
                    className="text-xl font-bold md:text-2xl"
                >
                    Student Dashboard
                </Typography>
                <a
                    href="https://github.com/Samuvel6826/startUp-task.git"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block rounded-lg border border-blue-500 px-4 py-2 text-sm text-blue-500 transition hover:bg-blue-500 hover:text-white focus:ring focus:ring-blue-300"
                >
                    Source Code
                </a>
            </div>

            {error && (
                <Alert color="red" className="mb-4">
                    {error}
                </Alert>
            )}

            <Card className="mb-6 p-4">
                <div className="mb-4 flex flex-col items-start md:flex-row md:items-center md:justify-between">
                    <Typography variant="h6" className="mb-2 md:mb-0">
                        Filters
                    </Typography>
                    <Button
                        size="sm"
                        className="bg-blue-500"
                        onClick={addFilter}
                    >
                        Add Filter
                    </Button>
                </div>

                {filterList.map((filter, index) => (
                    <div key={index} className="mb-4 flex flex-col gap-4 md:flex-row">
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
                            onClick={() => removeFilter(index)}
                        >
                            Remove
                        </Button>
                    </div>
                ))}
            </Card>

            {loading ? (
                <div className="flex h-32 items-center justify-center">
                    <Spinner className="h-12 w-12" />
                </div>
            ) : (
                <>
                    <Card className="mb-8 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full table-auto text-left">
                                <thead>
                                    <tr>
                                        {columns.map((col) => (
                                            <th key={col.value} className="border-b border-blue-gray-100 bg-blue-gray-50 p-4 text-sm">
                                                <Typography
                                                    variant="small"
                                                    className="font-normal opacity-70"
                                                >
                                                    {col.label}
                                                </Typography>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map((user, index) => (
                                        <tr key={user._id || index} className="even:bg-blue-gray-50">
                                            {columns.map((col) => (
                                                <td key={col.value} className="p-4 text-sm">
                                                    <Typography variant="small">
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

                    <Card className="p-4 md:p-6">
                        <Typography variant="h5" className="mb-4">
                            Student Marks Distribution
                        </Typography>
                        <div className="h-64 md:h-96">
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