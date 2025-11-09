import React, { useState, useEffect, useMemo } from 'react';
import { message } from 'antd';
import { LoanType } from '../types/LoanTypesSettings/loanTypeTypes';
import { useNavigate } from 'react-router-dom';
import LoanTypeTable from '../components/LoanTypeTable';
import { deleteLoanType, fetchLoanTypes } from '../services/loanTypeService';
import { PaginationOptions } from '../types/paginationTypes';
import { UUID } from 'crypto';

const LoanTypesPage: React.FC = () => {
    const [loanTypes, setLoanTypes] = useState<LoanType[]>([]);
    const [, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [pageNumber] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [searchTerm] = useState<string>('');
    const [searchField] = useState<string>('loanName');

    const options: PaginationOptions = useMemo(() => ({
        pageNumber,
        pageSize,
        searchTerm,
        searchField,
    }), [pageNumber, pageSize, searchTerm, searchField]);

    useEffect(() => {
        const fetchLoanTypesAPI = async () => {
            setLoading(true);
            try {
                const response = await fetchLoanTypes(options);
                if (response.success) {
                    setLoanTypes(response.data.items);
                    setTotalRecords(response.data.totalRecords);
                    setPageSize(response.data.pageSize);
                } else {
                    message.error('Failed to fetch loan types');
                }
            } catch (error) {
                console.error('Error fetching loan types:', error);
                message.error('An error occurred while fetching loan types');
            } finally {
                setLoading(false);
            }
        };

        fetchLoanTypesAPI();
    }, [options]);

    const handleViewDetails = (id: UUID) => {
        navigate(`/loan-types/details/${id}`);
    };

    const handleEdit = (id: UUID) => {
        navigate(`/loan-type/edit/${id}`);
    };

    const handleDelete = async (id: string) => {
        try {
            setLoading(true);
            await deleteLoanType(id);
            message.success('Loan type deleted successfully');

            // Refresh the list
            const response = await fetchLoanTypes(options);
            if (response.success) {
                setLoanTypes(response.data.items);
                setTotalRecords(response.data.totalRecords);
                setPageSize(response.data.pageSize);
            }
        } catch (error) {
            console.error('Error deleting loan type:', error);
            message.error('An error occurred while deleting the loan type');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = () => {
        navigate('/loan-type/register');
    };

    return (
        <div>
            <LoanTypeTable
                loanTypes={loanTypes}
                onViewDetails={handleViewDetails}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onRegister={handleRegister}
                totalRecords={totalRecords}
                pageNumber={pageNumber}
                pageSize={pageSize}
            />
        </div>
    );
};

export default LoanTypesPage;
