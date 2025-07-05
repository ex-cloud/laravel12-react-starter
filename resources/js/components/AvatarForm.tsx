import { router, useForm, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';


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
        <form onSubmit={submit} className="flex flex-col items-center gap-4">
        <div className="relative w-28 h-28">
            <img
                src={avatar}
                alt="Current avatar"
                className="w-full h-full rounded-md object-cover border"
            />

            {/* Overlay Upload Button */}
            <label
                htmlFor="avatar-upload"
                className="absolute top-14 right-10 border border-white/10 bg-gray-500/5 text-white text-xs px-2 py-1 rounded backdrop-blur-lg cursor-pointer transition-all hover:bg-gray-500/10 hover:border-white/20 flex items-center justify-center"
            >
                <Pencil size={13} className="text-white/60" />
                <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setData('avatar', e.target.files?.[0] || null)}
                />
            </label>
        </div>

        {errors.avatar && (
            <p className="text-red-500 text-sm">{errors.avatar}</p>
        )}

        <Button type="submit" disabled={processing} variant={'outline'} size={'sm'}>
            Upload
        </Button>
    </form>
    );
}
