// resources/js/Pages/Profile/Show.tsx

import { Head, Link, useForm } from '@inertiajs/react'
import type { BreadcrumbItem, PageProps, User } from '@/types'
import { Card } from '@/components/ui/card'
import AppLayout from '@/layouts/app-layout'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Check, Loader2, X } from 'lucide-react'
import clsx from 'clsx'
import { useInitials } from '@/hooks/use-initials'
import PersonalInfoCard from './PersonalInfoCard'
import { useState } from 'react'
import { router } from '@inertiajs/react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { toast } from "sonner"
import { format } from "date-fns"
import { id } from "date-fns/locale"

const formattedTime = format(
  new Date(),
  "eeee, dd MMMM yyyy 'pukul' HH:mm",
  { locale: id }
)
export default function ProfileShow({
  user,
  genders,
}: PageProps<{ user: User; genders: string[] }>) {
  const getInitials = useInitials()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleClick = () => {
    setLoading(true)
    setTimeout(() => {
      router.visit('/settings/profile')
    }, 500) // Delay biar loader muncul sebentar
  }

  const form = useForm({
    name: user.name,
    email: user.email,
    profile: {
      gender: user.profile?.gender ?? '',
      birthdate: user.profile?.birthdate ?? '',
      marital_status: user.profile?.marital_status ?? '',
      phone: user.profile?.phone ?? '',
      address: user.profile?.address ?? '',
    },
  })

  const handleSubmit = () => {
  const phone = form.data.profile.phone ?? ''

  // Validasi format: hanya angka (boleh diawali +), panjang 8–13 digit
  const phoneRegex = /^\+?[0-9]{8,13}$/

  if (phone && !phoneRegex.test(phone)) {
    form.setError('profile.phone', 'Nomor telepon tidak valid. Harus 8–13 digit.')
    return
  }
  form.clearErrors() // bersihkan error jika valid

  const formData = new FormData()
  formData.append('name', form.data.name)
  formData.append('email', form.data.email)
  formData.append('profile[gender]', form.data.profile.gender ?? '')
  formData.append('profile[birthdate]', form.data.profile.birthdate ?? '')
  formData.append('profile[marital_status]', form.data.profile.marital_status ?? '')
  formData.append('profile[phone]', form.data.profile.phone ?? '')
  formData.append('profile[address]', form.data.profile.address ?? '')

    //   cek log update profile
    // formData.forEach((value, key) => {
    // console.log(`${key}: ${value}`);
    // });
    
  // ✅ Tambahkan spoof method PATCH di sini
  formData.append('_method', 'PATCH')

  // Kirim data menggunakan router.post
  router.post(route('profile.public.update', user.username), formData, {
    preserveScroll: true,
    onSuccess: () => {
      toast.success("Profil berhasil diperbarui", {
        description: formattedTime,
      })
      setIsEditing(false)
    },
    onError: () => {
      toast.error("Gagal menyimpan profil", {
        description: "Periksa kembali data yang diisi.",
      })
    },
  })
}


  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: `Profile | ${user.name}`,
      href: '#',
    },
  ]

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Profile ${user.name}`} />

      <div className="w-full mx-auto px-12 py-4 space-y-4">
        {/* 🔹 2 Columns (Personal Info & Documents) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Info */}
          <PersonalInfoCard
            form={form}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            user={user}
            genders={genders}
            onSubmit={handleSubmit}
          />

          {/* Documents */}
          <Card className="p-6 bg-background shadow-none">
            <h2 className="text-lg font-semibold mb-4">Documents</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { name: 'Employment contract', date: 'Feb 05, 2024' },
                { name: 'Curriculum Vitae', date: 'Jan 12, 2024' },
                { name: 'Training certificate', date: 'Jul 25, 2024' },
              ].map((doc, i) => (
                <div key={i} className="rounded-md bg-muted p-3 text-sm">
                  <p className="font-medium">{doc.name}</p>
                  <p className="text-xs text-muted-foreground">{doc.date}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* 🔸 3 Columns (Card + Chart + Completion) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Employee Card */}
          <Card className="h-[450px] w-full relative overflow-hidden rounded-xl border-none bg-gradient-to-br from-zinc-800 via-zinc-900 to-black shadow-inner flex flex-col items-center justify-between py-6 px-4 text-white">
            <div className="flex flex-col items-center justify-center">
              <div className="relative z-10 mt-6">

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                            <div className="relative group cursor-pointer" onClick={handleClick}>
                                <Link href={route('profile.edit')}>
                                    <Avatar className="h-28 w-28 border-4 border-zinc-900 shadow-lg">
                                        <AvatarImage src={user.avatar} alt={user.name} />
                                        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                                    </Avatar>
                                    {loading && (
                                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center rounded-full">
                                            <Loader2 className="animate-spin size-6 text-white" />
                                        </div>
                                    )}
                                </Link>
                            </div>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="text-xs bg-muted text-muted-foreground">
                            Edit Avatar
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
              </div>
              <div className="text-center space-y-1 mt-4">
                <p className="text-xl font-semibold">{user.name}</p>
                <p className="text-sm text-zinc-400">Product Designer</p>
              </div>
            </div>

            <div className="items-center justify-between">
              <div className="text-xs text-zinc-500 space-y-1 mb-6 absolute bottom-4 left-6">
                <p className="font-semibold text-white tracking-wide">EMP-51247</p>
                <p>January 15, 2017</p>
                <p>K2net | computer & network solution</p>
                <p>Bandung Office</p>
              </div>
              <div className="absolute bottom-4 right-4 opacity-10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  fill="currentColor"
                  className="text-white"
                >
                  <rect width="32" height="20" rx="3" />
                </svg>
              </div>
            </div>
          </Card>

          {/* Chart */}
          <Card className="p-6 bg-background shadow-none">
            <h2 className="text-lg font-semibold mb-4">Chart</h2>
            <ul className="text-sm space-y-3">
              <li>
                <b>Harold Cooper</b> – Chief, Product
              </li>
              <li>
                <b>Aram Motjabai</b> – Sr. Manager
              </li>
              <li>
                <b>{user.name}</b> – Product Designer
              </li>
              <li>
                <b>Dembe Zuma</b> – UI Designer
              </li>
              <li>
                <b>Katarina Rostova</b> – UX Researcher
              </li>
            </ul>
          </Card>

          {/* Data Completion */}
          <Card className="p-6 bg-background shadow-none">
            <h2 className="text-lg font-semibold mb-4">
              Data completion{' '}
              <span className="text-muted-foreground text-sm">2/5</span>
            </h2>
            <ul className="space-y-2 text-sm">
              {[
                ['Personal data & resume', true],
                ['Education', true],
                ['Email address', false],
                ['Work experience', false],
                ['Certification', false],
              ].map(([label, done], i) => (
                <li
                  key={i}
                  className={clsx(
                    'flex items-center gap-2',
                    done ? 'text-green-600' : 'text-muted-foreground'
                  )}
                >
                  {done ? <Check size={16} /> : <X size={16} />}
                  {label}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
