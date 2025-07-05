"use client"
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { User, columns } from './columns';
import { DataTable } from './data-table';


function Users({ users }: { users: { data: User[] } }) {
    console.log(users); // Tambahkan ini untuk debug
  return (
    <AppLayout>
        <Head title="List Users" />
        <div className="container mx-auto py-10">
            <DataTable columns={columns} data={users.data} />
        </div>
    </AppLayout>
  )
}

export default Users;
