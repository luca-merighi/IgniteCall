import React from 'react'
import { Button, TextInput, Text } from '@ignite-ui/react'
import { useForm } from 'react-hook-form'
import * as zod from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/router'

import { ArrowRight } from 'phosphor-react'
import { Form, FormAnnotation } from './styles'

const claimUsernameFormSchema = zod.object({
    username: zod.string()
        .min(3, { message: 'O usuário precisa ter pelo menos três letras.' })
        .regex(/^([\a-z\\-]+)$/i, { message: 'O usuário pode ter apenas letras e hifens.'})
        .transform(username => username.toLowerCase())
})

type ClaimUsernameFormData = zod.infer<typeof claimUsernameFormSchema>

export default function ClaimUsernameForm() {
    const { register, handleSubmit, 
        formState: { errors, isSubmitting } } = useForm<ClaimUsernameFormData>({
        resolver: zodResolver(claimUsernameFormSchema)
    })
    const router = useRouter()
    
    async function handleClaimUsername(data: ClaimUsernameFormData) {
        const { username } = data
        
        await router.push(`/register?username=${username}`)
    }
    
    return (
        <React.Fragment>
            <Form as="form" onSubmit={handleSubmit(handleClaimUsername)}>
                <TextInput 
                    size="sm"
                    prefix="ignite.com/"
                    placeholder="seu-usuario"
                    crossOrigin=""
                    {...register('username')} />
                <Button
                    size="sm"
                    type="submit"
                    disabled={isSubmitting}>
                    Reservar
                    <ArrowRight />    
                </Button>
            </Form>
            
            <FormAnnotation>
                <Text size="sm">
                    {errors.username 
                        && errors.username.message}
                </Text>
            </FormAnnotation>
        </React.Fragment>
    )
}