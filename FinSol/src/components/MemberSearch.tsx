import React, { useState, useEffect } from 'react';
import { Input, Select, Table, Button } from 'antd';
import { memberSearchFieldOptions } from '../constants/searchFieldOptions';
import { MemberListDto } from '../types/Member/memberTypes';
// PaginationOptions import kept for reference, but not required after refactor
// import { PaginationOptions } from '../types/paginationTypes';
import { fetchAllMembers } from '../services/memberService';
import { maskData } from '../Utility/maskBioData';
import { CheckOutlined } from '@ant-design/icons';
import { debounce } from 'lodash';

const { Option } = Select;

interface MemberSearchProps {
    onMemberSelect: (member: MemberListDto) => void;
}

const MemberSearch: React.FC<MemberSearchProps> = ({ onMemberSelect }) => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [searchField, setSearchField] = useState<string>('name');
    const [membersList, setMembersList] = useState<MemberListDto[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    // build options inline when calling the API to avoid stale closure

    useEffect(() => {
        const handler = debounce(async (term: string, field: string) => {
            if (!term.trim()) {
                setMembersList([]);
                return;
            }

            setLoading(true);
            try {
                const response = await fetchAllMembers({
                    searchTerm: term,
                    searchField: field,
                    pageNumber: 1,
                    pageSize: 50,
                });
                if (response.success) {
                    setMembersList(response.data.items);
                } else {
                    setMembersList([]);
                }
            } catch (error) {
                console.error('Error fetching members:', error);
                setMembersList([]);
            } finally {
                setLoading(false);
            }
        }, 300);

        handler(searchTerm, searchField);

        return () => {
            handler.cancel();
        };
    }, [searchTerm, searchField]);

    const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleSearchFieldChange = (value: string) => {
        setSearchField(value);
    };

    const columns = [
        {
            title: 'Member Number',
            dataIndex: 'memberNumber',
            key: 'memberNumber',
        },
        {
            title: 'Name',
            dataIndex: ['firstName', 'otherName'],
            key: 'name',
            render: (_: object, record: MemberListDto) => `${record.firstName} ${record.otherName}`,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            render: (email: string) => maskData(email, 'email')
        },
        {
            title: 'Phone Number',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
            render: (phone: string) => maskData(phone, 'phone')
        },
        {
            title: 'National Id',
            dataIndex: 'nationalID',
            key: 'nationalID',
            render: (nationalID: string) => maskData(nationalID, 'nationalID')
        },
        {
            title: 'Action',
            key: 'action',
            render: (record: MemberListDto) => (
                <Button
                    type="primary"
                    onClick={() => onMemberSelect(record)}
                    icon={<CheckOutlined />}
                    className="member-select-button"
                >
                    Select
                </Button>
            ),
        },
    ];

    return (
        <div>
            <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                <Input
                    placeholder="Search members"
                    value={searchTerm}
                    onChange={handleSearchTermChange}
                    style={{ width: '200px' }}
                />
                <Select
                    value={searchField}
                    onChange={handleSearchFieldChange}
                    style={{ width: '150px' }}
                >
                    {memberSearchFieldOptions.map(option => (
                        <Option key={option.value} value={option.value}>
                            {option.label}
                        </Option>
                    ))}
                </Select>
            </div>
            <Table
                columns={columns}
                dataSource={membersList}
                loading={loading}
                pagination={{ pageSize: 10 }}
                rowKey="memberId"
                onRow={(record: MemberListDto) => ({
                    onClick: () => onMemberSelect(record),
                    className: 'member-search-row',
                })}
            />
        </div>
    );
};

export default MemberSearch;
