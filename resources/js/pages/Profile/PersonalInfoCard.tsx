// PersonalInfoCard.tsx
"use client"

import { User } from "@/types";
import { ChevronDownIcon, PencilIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { useForm } from "@inertiajs/react";

interface PersonalInfoCardProps {
  user: User;
  genders: string[];
  form: ReturnType<typeof useForm<{
    name: string;
    email: string;
    profile: {
      gender: string;
      birthdate: string;
      marital_status: string;
      phone: string;
      address: string;
    };
  }>>;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  onSubmit: () => void;
}

export default function PersonalInfoCard({
  user,
  genders,
  form,
  isEditing,
  setIsEditing,
  onSubmit,
}: PersonalInfoCardProps) {
  const { data, setData } = form;

  const [open, setOpen] = useState(false);
  const currentYear = new Date().getFullYear();

  const handleEditClick = () => setIsEditing(true);
  const handleCancelClick = () => {
    setIsEditing(false);
    setData({
      ...data,
      name: user.name,
      email: user.email,
      profile: {
        gender: user.profile?.gender ?? '',
        birthdate: user.profile?.birthdate ?? '',
        marital_status: user.profile?.marital_status ?? '',
        phone: user.profile?.phone ?? '',
        address: user.profile?.address ?? '',
      },
    });
  };
  const handleSaveClick = () => {
  onSubmit(); // ✅ ini akan memanggil form.put(...) dari induk
  setIsEditing(false);
};

  return (
    <Card className="p-6 dark:bg-zinc-900/50 relative shadow-none">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold dark:text-white">Personal information</h3>
        {!isEditing && (
          <Button
            size="sm"
            variant="outline"
            className="text-muted-foreground dark:hover:text-white dark:bg-transparent"
            onClick={handleEditClick}
          >
            <PencilIcon className="w-4 h-4 mr-1" />
            Edit
          </Button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-2">
          <div>
            <Label htmlFor="name" className="block text-sm mb-1">Full name</Label>
            <Input
              type="text"
              value={data.name}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <Label htmlFor="date" className="px-1">Date of birth</Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="date"
                  className="w-full justify-between font-normal"
                >
                  {data.profile.birthdate ? format(new Date(data.profile.birthdate), "yyyy-MM-dd") : "Select date"}
                  <ChevronDownIcon className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={data.profile.birthdate ? new Date(data.profile.birthdate) : undefined}
                  captionLayout="dropdown"
                  fromDate={new Date(currentYear - 100, 0, 1)}
                  toDate={new Date()}
                  onSelect={(selectedDate) => {
                    if (!selectedDate) return;
                    setData("profile", {
                      ...data.profile,
                      birthdate: format(selectedDate, "yyyy-MM-dd"),
                    });
                    setOpen(false);
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label className="block text-sm mb-1">Gender</Label>
            <Select
              value={data.profile.gender}
              onValueChange={(value) => setData("profile", { ...data.profile, gender: value })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                {genders.map((gender, i) => (
                  <SelectItem key={i} value={gender}>{gender}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="block text-sm mb-1">Marital Status</Label>
            <Input
              type="text"
              name="marital_status"
              value={data.profile.marital_status}
              onChange={(e) => setData("profile", { ...data.profile, marital_status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <Label className="block text-sm mb-1">Phone</Label>
            <Input
              type="tel"
              name="phone"
              value={data.profile.phone}
              onChange={(e) => setData("profile", { ...data.profile, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <Label className="block text-sm mb-1">Address</Label>
            <Textarea
              value={data.profile.address}
              onChange={(e) => setData("profile", { ...data.profile, address: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="mt-4 flex gap-2">
            <Button size="sm" onClick={handleSaveClick}>Save</Button>
            <Button size="sm" variant="outline" onClick={handleCancelClick}>Cancel</Button>
          </div>
        </div>
      ) : (
        <table className="w-full text-sm">
          <tbody>
            <tr>
              <td className="py-1 pr-4 text-zinc-700 dark:text-zinc-400 w-[150px] whitespace-nowrap">Full name</td>
              <td className="py-1 text-zinc-800 dark:text-white">{user.name}</td>
            </tr>
            <tr>
              <td className="py-1 pr-4 text-zinc-700 dark:text-zinc-400 w-[150px] whitespace-nowrap">Date of birth</td>
              <td className="py-1 text-zinc-800 dark:text-white">{data.profile.birthdate ?? '-'}</td>
            </tr>
            <tr>
              <td className="py-1 pr-4 text-zinc-700 dark:text-zinc-400 w-[150px] whitespace-nowrap">Gender</td>
              <td className="py-1 text-zinc-800 dark:text-white">{data.profile.gender || '-'}</td>
            </tr>
            <tr>
              <td className="py-1 pr-4 text-zinc-700 dark:text-zinc-400 w-[150px] whitespace-nowrap">Marital status</td>
              <td className="py-1 text-zinc-800 dark:text-white">{data.profile.marital_status ?? '-'}</td>
            </tr>
            <tr>
              <td className="py-1 pr-4 text-zinc-700 dark:text-zinc-400 w-[150px] whitespace-nowrap">Phone</td>
              <td className="py-1 text-zinc-800 dark:text-white">{data.profile.phone ?? '-'}</td>
            </tr>
            <tr>
              <td className="py-1 pr-4 text-zinc-700 dark:text-zinc-400 w-[150px] whitespace-nowrap">Email</td>
              <td className="py-1 text-zinc-800 dark:text-white">{user.email}</td>
            </tr>
            <tr>
              <td className="py-1 pr-4 text-zinc-700 dark:text-zinc-400 w-[150px] whitespace-nowrap">Address</td>
              <td className="py-1 text-zinc-800 dark:text-white">{data.profile.address ?? '-'}</td>
            </tr>
          </tbody>
        </table>
      )}
    </Card>
  );
}
