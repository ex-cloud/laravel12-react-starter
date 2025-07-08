"use client"
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { User, columns } from './columns';
import { DataTable } from './data-table';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'List User',
        href: '/users',
    },
];

function Users({ users }: { users: { data: User[] } }) {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="List Users" />
        <div className="container mx-auto py-10">
            <DataTable columns={columns} data={users.data} />
        </div>
    </AppLayout>
  )
}

export default Users;
