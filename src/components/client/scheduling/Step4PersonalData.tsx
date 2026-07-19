import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { User, Phone, FileText } from 'lucide-react'

const personalDataSchema = z.object({
  customerName: z
    .string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  customerPhone: z
    .string()
    .regex(/^\d{10,11}$/, 'Telefone inválido (10 ou 11 dígitos)'),
  notes: z
    .string()
    .max(500, 'Observação deve ter no máximo 500 caracteres')
    .optional()
    .or(z.literal('')),
})

type PersonalDataFormData = z.infer<typeof personalDataSchema>

interface Step4PersonalDataProps {
  initialData?: Partial<PersonalDataFormData>
  onSubmit: (data: PersonalDataFormData) => void
}

export function Step4PersonalData({
  initialData,
  onSubmit,
}: Step4PersonalDataProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<PersonalDataFormData>({
    resolver: zodResolver(personalDataSchema),
    defaultValues: initialData,
  })

  const phoneValue = watch('customerPhone')

  // Aplicar máscara de telefone
  useEffect(() => {
    if (phoneValue) {
      const cleaned = phoneValue.replace(/\D/g, '')
      const formatted = formatPhone(cleaned)
      if (formatted !== phoneValue) {
        setValue('customerPhone', cleaned)
      }
    }
  }, [phoneValue, setValue])

  const formatPhone = (value: string) => {
    if (value.length <= 10) {
      return value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3')
    }
    return value.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold">Seus dados</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Nome */}
        <div className="space-y-2">
          <label htmlFor="customerName" className="flex items-center gap-2 text-sm font-medium">
            <User className="w-4 h-4" />
            Nome completo
          </label>
          <Input
            id="customerName"
            {...register('customerName')}
            type="text"
            placeholder="João Silva"
            error={errors.customerName?.message}
          />
        </div>

        {/* Telefone */}
        <div className="space-y-2">
          <label htmlFor="customerPhone" className="flex items-center gap-2 text-sm font-medium">
            <Phone className="w-4 h-4" />
            Telefone
          </label>
          <Input
            id="customerPhone"
            {...register('customerPhone')}
            type="tel"
            placeholder="(11) 99999-9999"
            error={errors.customerPhone?.message}
            maxLength={15}
          />
          <p className="text-xs text-text-secondary">
            Formato: (XX) XXXXX-XXXX
          </p>
        </div>

        {/* Observação */}
        <div className="space-y-2">
          <label htmlFor="notes" className="flex items-center gap-2 text-sm font-medium">
            <FileText className="w-4 h-4" />
            Observação (opcional)
          </label>
          <textarea
            id="notes"
            {...register('notes')}
            placeholder="Deixe aqui alguma observação ou preferência..."
            className="w-full px-4 py-2 bg-background border border-card rounded-lg focus:outline-none focus:border-primary transition-colors resize-none"
            rows={4}
            maxLength={500}
          />
          {errors.notes && (
            <p className="text-error text-sm">{errors.notes.message}</p>
          )}
          <p className="text-xs text-text-secondary">
            Máximo de 500 caracteres
          </p>
        </div>

        {/* Botão Enviar */}
        <Button type="submit" variant="primary" className="w-full mt-6">
          Continuar para revisão
        </Button>
      </form>
    </motion.div>
  )
}