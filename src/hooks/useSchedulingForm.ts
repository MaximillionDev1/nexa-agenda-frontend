import { useState } from 'react'
import type { SchedulingFormData } from '@/schemas/scheduling'

interface SchedulingFormState extends Partial<SchedulingFormData> {
  appointmentDate?: string
  startTime?: string
}

export function useSchedulingForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<SchedulingFormState>({})

  const updateFormData = (data: Partial<SchedulingFormState>) => {
    setFormData((prev) => ({ ...prev, ...data }))
  }

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const goToStep = (step: number) => {
    if (step >= 1 && step <= 5) {
      setCurrentStep(step)
    }
  }

  const reset = () => {
    setCurrentStep(1)
    setFormData({})
  }

  return {
    currentStep,
    formData,
    updateFormData,
    nextStep,
    prevStep,
    goToStep,
    reset,
  }
}