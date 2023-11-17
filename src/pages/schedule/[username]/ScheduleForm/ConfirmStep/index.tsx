import { Button, Text, TextArea, TextInput } from '@ignite-ui/react'
import * as zod from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { CalendarBlank, Clock } from 'phosphor-react'
import { ConfirmForm, FormActions, FormError, FormHead } from './styles'

const confirmFormSchema = zod.object({
    name: zod.string().min(3, { message: 'O nome precisa no mínimo três caracteres' }),
    email: zod.string().email({ message: 'Digite um email válido' }),
    observations: zod.string().nullable()
})

type ConfirmFormData = zod.infer<typeof confirmFormSchema>

export default function ConfirmStep() {
    const { 
        register, handleSubmit,
        formState: { isSubmitting, errors }
     } = useForm<ConfirmFormData>({
        resolver: zodResolver(confirmFormSchema)
    })
    
    function handleConfirmScheduling(data: ConfirmFormData) {
        
    }
    
    return (
        <ConfirmForm 
            as="form"
            onSubmit={handleSubmit(handleConfirmScheduling)}>
            <FormHead>
                <Text>
                    <CalendarBlank />
                    08 de Novembro de 2023
                </Text>
                <Text>
                    <Clock />
                    18:00h
                </Text>
            </FormHead>
            
            <label>
                <Text size="sm">Nome completo</Text>
                <TextInput 
                    placeholder="Seu nome"
                    crossOrigin=""
                    {...register('name')} />
                    
                {errors.name && (
                    <FormError size="sm">
                        {errors.name?.message}
                    </FormError>
                )}
            </label>
            
            <label>
                <Text size="sm">Endereço de e-mail</Text>
                <TextInput 
                    placeholder="johndoe@example.com"
                    type="email"
                    crossOrigin=""
                    {...register('email')} />
                    
                {errors.email && (
                    <FormError size="sm">
                        {errors.email?.message}
                    </FormError>
                )}
            </label>
            
            <label>
                <Text size="sm">Observações</Text>
                <TextArea
                {...register('observations')} />
            </label>
            
            <FormActions>
                <Button 
                    type="button" 
                    variant="tertiary">
                    Cancelar
                </Button>
                <Button 
                    type="submit"
                    disabled={isSubmitting}>
                    Confirmar
                </Button>
            </FormActions>
        </ConfirmForm>
    )
}