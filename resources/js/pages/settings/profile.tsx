import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import AvatarUploader, { AvatarUploaderHandle } from '@/components/AvatarUploader';
import AvatarDropdown from '@/components/AvatarDropdown';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: '/settings/profile',
    },
];

type ProfileForm = {
    name: string;
    username: string;
    email: string;
};

export default function Profile({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
    const { auth } = usePage<SharedData>().props;
    const [newAvatar, setNewAvatar] = useState<File | null>(null)
    const uploaderRef = useRef<AvatarUploaderHandle>(null)
    const { data, setData, errors, processing, recentlySuccessful } = useForm<Required<ProfileForm>>({
        name: auth.user.name,
        username: auth.user.username || '',
        email: auth.user.email,
    });


    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('_method', 'patch');
        formData.append('name', data.name);
        formData.append('username', data.username);
        formData.append('email', data.email);

        if (newAvatar instanceof File) {
            formData.append('avatar', newAvatar);
        }

        router.post(route('profile.update'), formData, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                console.log("Profile updated!");
            },
            onError: (err) => {
                console.error("Upload error:", err);
            },
        });
    };

    const avatarSrc = newAvatar
        ? URL.createObjectURL(newAvatar)
        : typeof auth.user.avatar === 'string' && auth.user.avatar
            ? auth.user.avatar
            : '/default-avatar.png';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    {/* <HeadingSmall title="My Profile"/> */}
                    <div className='border p-4 rounded-md space-y-4'>
                        <HeadingSmall title="Avatar" description="Upload or change your profile picture" />
                        <div className="flex space-x-4 items-center">
                                <AvatarDropdown
                                    avatarSrc={avatarSrc}
                                    onRemove={() => {
                                        uploaderRef.current?.clearFile() // 🔥 panggil dulu
                                        setNewAvatar(null)               // kemudian set state
                                    }}
                                    onChange={() => {
                                        uploaderRef.current?.openFileDialog()
                                    }}
                                />

                                <div className="flex-1 space-y-2">
                                    <AvatarUploader
                                    ref={uploaderRef}
                                    maxSizeMB={2}
                                    onFileChange={(file) => setNewAvatar(file)}
                                    />
                                </div>
                        </div>
                    </div>

                    <div className='border p-4 rounded-md '>
                        <form onSubmit={submit} className="space-y-6">
                        <HeadingSmall title="Personal Information" description="Update your name and email address" />
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>

                                <Input
                                    id="name"
                                    className="mt-1 block w-full"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                    autoComplete="name"
                                    placeholder="Full name"
                                />

                                <InputError className="mt-2" message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="username">Username</Label>

                                <Input
                                    id="username"
                                    className="mt-1 block w-full"
                                    value={data.username}
                                    onChange={(e) => setData('username', e.target.value)}
                                    required
                                    autoComplete="username"
                                    placeholder="Username"
                                />

                                <InputError className="mt-2" message={errors.username} />
                            </div>



                            <div className="grid gap-2">
                                <Label htmlFor="email">Email address</Label>

                                <Input
                                    id="email"
                                    type="email"
                                    className="mt-1 block w-full"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                    autoComplete="email"
                                    placeholder="Email address"
                                />

                                <InputError className="mt-2" message={errors.email} />
                            </div>

                            {mustVerifyEmail && auth.user.email_verified_at === null && (
                                <div>
                                    <p className="-mt-4 text-sm text-muted-foreground">
                                        Your email address is unverified.{' '}
                                        <Link
                                            href={route('verification.send')}
                                            method="post"
                                            as="button"
                                            className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                        >
                                            Click here to resend the verification email.
                                        </Link>
                                    </p>

                                    {status === 'verification-link-sent' && (
                                        <div className="mt-2 text-sm font-medium text-green-600">
                                            A new verification link has been sent to your email address.
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="flex items-center gap-4">
                                <Button disabled={processing}>Save</Button>

                                <Transition
                                    show={recentlySuccessful}
                                    enter="transition ease-in-out"
                                    enterFrom="opacity-0"
                                    leave="transition ease-in-out"
                                    leaveTo="opacity-0"
                                >
                                    <p className="text-sm text-neutral-600">Saved</p>
                                </Transition>
                            </div>
                        </form>
                    </div>
                </div>

                <DeleteUser />
            </SettingsLayout>
            <Transition
                show={recentlySuccessful}
                enter="transition ease-in-out"
                enterFrom="opacity-0"
                leave="transition ease-in-out"
                leaveTo="opacity-0"
            >
                <p className="text-sm text-neutral-600">Saved</p>
            </Transition>
        </AppLayout>
    );
}
