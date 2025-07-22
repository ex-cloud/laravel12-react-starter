import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import clsx from "clsx"
import { AlertCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { toast } from "sonner";
import { format } from "date-fns"
import { id } from "date-fns/locale"

type PhoneInputProps = {
  value: string
  onChange: (value: string) => void
  name?: string
  label?: string
  id?: string
  required?: boolean
  errorMessage?: string | null
  onValidityChange?: (isValid: boolean) => void // ⬅️ tambah ini
}
const formattedTime = format(
  new Date(),
  "eeee, dd MMMM yyyy 'pukul' HH:mm",
  { locale: id }
)
export default function PhoneInput({
  value,
  onChange,
  name = "phone",
  label = "Phone Number",
  id = "phone",
  required = false,
  errorMessage = null,
  onValidityChange,
}: PhoneInputProps) {
    const [error, setError] = useState<string | null>(null)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;

        // Hilangkan semua kecuali angka dan plus
        const cleaned = raw.replace(/(?!^\+)[^\d]/g, "");

        // Tampilkan toast hanya jika awalan 08 atau 8 (sebelum diubah)
        const shouldShowToast = /^08/.test(cleaned) || /^8/.test(cleaned);

        // Ganti awalan
        let formatted = cleaned;
        if (formatted.startsWith("08")) {
            formatted = formatted.replace(/^08/, "+628");
        } else if (formatted.startsWith("8")) {
            formatted = formatted.replace(/^8/, "+628");
        }

        if (shouldShowToast && formatted !== cleaned) {
            toast.info("Awalan 08 diubah otomatis menjadi +62", {
            description: formattedTime,}
        );
        }

        onChange(formatted);
    };


    useEffect(() => {
        const digits = value.replace(/\D/g, "")
        if (digits.length > 0 && digits.length < 8) {
            setError("Nomor terlalu pendek (min. 8 digit)")
            onValidityChange?.(false)
        } else if (digits.length > 13) {
            setError("Nomor terlalu panjang (maks. 13 digit)")
            onValidityChange?.(false)
        } else {
            setError(null)
            onValidityChange?.(true)
        }
    }, [value, onValidityChange])

  return (
    <div className="space-y-1">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        name={name}
        type="tel"
        inputMode="tel"
        pattern="^\+?[0-9]{8,13}$"
        placeholder="+628123456789"
        value={value}
        onChange={handleInputChange}
        required={required}
        className={clsx(error || errorMessage ? "border-red-500 focus-visible:ring-red-500" : "")}
      />
      {(error || errorMessage) && (
        <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
          <AlertCircle className="w-4 h-4" />
          {error || errorMessage}
        </p>
      )}
    </div>
  )
}
