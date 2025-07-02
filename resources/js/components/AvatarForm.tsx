import { router, useForm, usePage } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';


export default function AvatarForm() {
    const { auth } = usePage<{ auth: { user: { avatar: string } } }>().props;
    const avatar = auth.user.avatar;

    const { setData, post, processing, errors } = useForm({
        avatar: null as File | null,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('avatar.update'), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                router.reload({ only: ['auth'] }); // ini akan refresh hanya shared props 'auth'
            },
        });
    };

    return (
        <form onSubmit={submit} className="space-y-4">
            {avatar ? (
                <img
                    src={avatar}
                    alt="Current avatar"
                    className="h-24 w-24 rounded-full object-cover border"
                />
            ) : (
                <div className="h-24 w-24 flex items-center justify-center rounded-full bg-gray-100 text-gray-500">
                    No avatar
                </div>
            )}

            <Input
                type="file"
                accept="image/*"
                onChange={(e) => setData('avatar', e.target.files?.[0] || null)}
            />
            <InputError message={errors.avatar} />

            <Button type="submit" disabled={processing}>
                Upload Avatar
            </Button>
        </form>
    );
}
