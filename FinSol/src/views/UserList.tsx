import React, { useState, useEffect } from 'react';
import { Table, Switch, Button } from 'antd';
import UserRegistrationForm from './UserRegistrationForm';
import { User, UserListProps, UserRegistrationFormValues, UserRole } from '../types/systemUsersTypes';
import { getAllSystemUsers, registerSystemUser } from '../services/userService';

const UserList: React.FC<UserListProps> = ({ onStatusChange }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [showRegistrationForm, setShowRegistrationForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await getAllSystemUsers();

            if (response.success) {
                setUsers(response.data);
            } else {
                setError('Failed to fetch users: ' + response.errors.join(', '));
            }
        } catch (err) {
            setError('An error occurred while fetching users.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {

        fetchUsers();
    }, []);

    const toggleRegistrationForm = () => {
        setShowRegistrationForm(!showRegistrationForm);
    };

    const handleFormSubmit =async (values: UserRegistrationFormValues) => {
        console.log('User registered:', values);

        const userRegisterParams: UserRegistrationFormValues = {
            email: values.email,
            roleName: values.roleName,
            firstName: values.firstName,
            otherName: values.otherName
        };

        await registerSystemUser(userRegisterParams);
        await fetchUsers();
    };

    const columns = [
        {
            title: 'First Name',
            dataIndex: 'firstName',
            key: 'firstName',
        },
        {
            title: 'Other Name',
            dataIndex: 'otherName',
            key: 'otherName',
        },
        {
            title: 'Role',
            dataIndex: 'roles',
            key: 'roles',
            render: (roles: UserRole[]) => roles.map(role => role).join(', '),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Active',
            key: 'isActive',
            render: (_: any, record: User) => (
                <Switch
                    checked={record.isActive}
                    onChange={(checked: boolean) => onStatusChange(record.id, checked)}
                />
            ),
        },
    ];

    return (
        <div>
            <Button type="primary" onClick={toggleRegistrationForm}>
                {showRegistrationForm ? 'Hide Registration Form' : 'Register User'}
            </Button>

            {showRegistrationForm && (
                <div style={{ marginTop: '20px' }}>
                    <UserRegistrationForm onSubmit={handleFormSubmit} />
                </div>
            )}

            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p style={{ color: 'red' }}>{error}</p>
            ) : (
                <Table title={() => 'System Users'} dataSource={users} columns={columns} rowKey="email" />
            )}
        </div>
    );
};


export default UserList;
