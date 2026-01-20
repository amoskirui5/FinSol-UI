import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Space, Popconfirm, message } from "antd";
import { ColumnsType } from "antd/es/table";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { FinancialYear, FinancialYearApiPayload, FinancialYearFormInput, FinancialYearListResponse } from "../types/Settings/financialYearTypes";
import FinancialYearForm from "../views/Settings/FinancialYearForm";
import { fetchFinancialYears, saveFinancialYear, updateFinancialYear } from "../services/financialYearService";

const FinancialYearTable: React.FC = () => {
    const [data, setData] = useState<FinancialYearListResponse>();
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedYear, setSelectedYear] = useState<FinancialYear | null>(null);
    const [saving, setSaving] = useState(false);

    const fetchFinancialYearsResult = async () => {
        setLoading(true);
        try {
            const response = await fetchFinancialYears();
            // keep non-noisy debug information using console.debug
            console.debug("Financial Years Data:", response);
            setData(response);
        } catch (error) {
            console.error('Error fetching financial years:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFinancialYearsResult();
    }, []);

    const handleDelete = async (id: string) => {
        try {
            await fetch(`/api/financial-years/${id}`, { method: "DELETE" });
            message.success("Deleted successfully");
            // setData((prev) => prev.filter((fy) => fy.financialYearId !== id));
        } catch (error) {
            console.error('Delete financial year failed:', error);
            message.error("Delete failed");
        }
    };

    const handleSave = async (values: FinancialYearFormInput) => {
        setSaving(true);
        try {
            // Use update if editing, otherwise create
            if (selectedYear) {
                // Update payload - excludes year field
                const updatePayload = {
                    financialYearId: selectedYear.financialYearId,
                    startDate: values.startDate.format("YYYY-MM-DD"),
                    endDate: values.endDate.format("YYYY-MM-DD"),
                    isActive: values.isActive,
                };
                await updateFinancialYear(updatePayload);
                message.success("Financial year updated successfully");
            } else {
                // Create payload - includes year field
                const createPayload = {
                    year: values.year,
                    startDate: values.startDate.format("YYYY-MM-DD"),
                    endDate: values.endDate.format("YYYY-MM-DD"),
                    isActive: values.isActive,
                };
                await saveFinancialYear(createPayload);
                message.success("Financial year created successfully");
            }
            
            await fetchFinancialYearsResult();
            setModalVisible(false);
            setSelectedYear(null);
        } catch (error) {
            console.error('Failed to save financial year:', error);
            message.error("Failed to save");
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (year: FinancialYear) => {
        setSelectedYear(year);
        setModalVisible(true);
    };

    const handleAdd = () => {
        setSelectedYear(null);
        setModalVisible(true);
    };

    const handleCancel = () => {
        setModalVisible(false);
        setSelectedYear(null);
    };

    const columns: ColumnsType<FinancialYear> = [
        {
            title: "Year",
            dataIndex: "year",
            key: "year",
        },
        {
            title: "Start Date",
            dataIndex: "startDate",
            key: "startDate",
        },
        {
            title: "End Date",
            dataIndex: "endDate",
            key: "endDate",
        },
        {
            title: "Active",
            dataIndex: "isActive",
            key: "isActive",
            render: (isActive: boolean) => (isActive ? "Yes" : "No"),
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Space>
                    <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
                        Edit
                    </Button>
                    <Popconfirm
                        title="Are you sure to delete?"
                        onConfirm={() => handleDelete(record.financialYearId)}
                    >
                        <Button type="link" danger icon={<DeleteOutlined />}>
                            Delete
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <>
            <Button
                type="primary"
                icon={<PlusOutlined />}
                style={{ marginBottom: 16 }}
                onClick={handleAdd}
            >
                Add Financial Year
            </Button>

            <Table
                loading={loading}
                dataSource={data?.data || []}
                columns={columns}
                rowKey="financialYearId"
                bordered
            />

            <Modal
                title={selectedYear ? "Edit Financial Year" : "Add Financial Year"}
                open={modalVisible}
                onCancel={handleCancel}
                footer={null}
                destroyOnClose
            >
                <FinancialYearForm
                    initialValues={selectedYear}
                    onSubmit={handleSave}
                    onCancel={handleCancel}
                    loading={saving}
                />
            </Modal>
        </>
    );
};

export default FinancialYearTable;
