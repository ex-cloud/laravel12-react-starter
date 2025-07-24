import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { Checkbox } from '@/components/ui/checkbox';

type RegisterForm = {
    name: string;
    email: string;
    username?: string; // Optional field for username
    password: string;
    password_confirmation: string;
    privacy?: boolean;
};

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
        name: '',
        email: '',
        username: '', // Optional field for username
        password: '',
        password_confirmation: '',
        privacy: false,

    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout title="Register" description="Masukkan detail Anda di bawah ini untuk membuat akun Anda.">
            <Head title="Register" />
            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name" className="text-[13px] font-medium tracking-tight">Nama</Label>
                        <Input
                            id="name"
                            type="text"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            disabled={processing}
                            placeholder="Full name"
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="username" className="text-[13px] font-medium tracking-tight">Username (optional)</Label>
                        <Input
                            id="username"
                            type="text"
                            tabIndex={1}
                            autoComplete="username"
                            value={data.username}
                            onChange={(e) => setData('username', e.target.value)}
                            disabled={processing}
                            placeholder="Username"
                        />
                        <InputError message={errors.username} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email" className="text-[13px] font-medium tracking-tight">Email address</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            tabIndex={2}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            disabled={processing}
                            placeholder="email@example.com"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className='flex items-center justify-between gap-x-4'>
                        <div className="grid gap-2">
                            <Label htmlFor="password" className="text-[13px] font-medium tracking-tight">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                required
                                tabIndex={3}
                                autoComplete="new-password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                disabled={processing}
                            />
                            <InputError message={errors.password} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password_confirmation" className="text-[13px] font-medium tracking-tight">Confirm password</Label>
                            <Input
                                id="password_confirmation"
                                type="password"
                                required
                                tabIndex={4}
                                autoComplete="new-password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                disabled={processing}
                            />
                            <InputError message={errors.password_confirmation} />
                        </div>
                    </div>

                    <div className='flex items-center space-x-2'>
                        <Checkbox
                            id="privacy"
                            name="privacy"
                            checked={data.privacy}
                            onClick={() => setData('privacy', !data.privacy)}
                            tabIndex={3}
                        />
                        <Label htmlFor="privacy" className="text-[13px] font-medium tracking-tight">
                            Saya setuju dengan <span className='underline'>Ketentuan</span> dan <span className='underline'>Kebijakan Privasi</span>
                        </Label>
                    </div>

                    <Button type="submit" className="mt-2 w-full" tabIndex={5} disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Register
                    </Button>
                </div>

                <div className="text-center text-[13px] text-muted-foreground">
                    Sudah daftar?{' '}
                    <TextLink href={route('login')} tabIndex={6}>
                        Login
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
