import React, { useState, useEffect } from 'react';
import { LoanType } from '../types/loanTypeTypes';
import { useNavigate } from 'react-router-dom';
import LoanTypeTable from '../components/LoanTypeTable';
import { deleteLoanType, fetchLoanTypes } from '../services/loanTypeService';
import { PaginationOptions } from '../types/paginationTypes';
import { UUID } from 'crypto';

const LoanTypesPage: React.FC = () => {
    const [loanTypes, setLoanTypes] = useState<LoanType[]>([]);
    const navigate = useNavigate();
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [searchField, setSearchField] = useState<string>('');

    const options: PaginationOptions = {
        pageNumber,
        pageSize,
        searchTerm,
        searchField,
    };
    useEffect(() => {
        fetchLoanTypesAPI();
    }, []);

    const fetchLoanTypesAPI = async () => {
        const response = await fetchLoanTypes(options);
        if (response.success) {
            setLoanTypes(response.data.items);
            setTotalRecords(response.data.totalRecords);
            setPageSize(response.data.pageSize);
        }

    };

    const handleViewDetails = (id: UUID) => {
        navigate(`/loan-types/details/${id}`);
    };

    const handleEdit = (id: UUID) => {
        navigate(`/loan-type/edit/${id}`);
    };

    const handleDelete = async (id: string) => {
        await deleteLoanType(id);
    };

    const handleRegister = () => {
        navigate(`/loan-type/register`);

    };

    return (
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
    );
};

export default LoanTypesPage;
