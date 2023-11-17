import React, { useEffect } from 'react'
import Head from 'next/head'
import { Button, Heading, MultiStep, Text, 
    TextInput } from '@ignite-ui/react'
import { useForm } from 'react-hook-form'
import * as zod from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/router'
import { api } from '@/lib/axios'
import { AxiosError } from 'axios'    

import { ArrowRight } from 'phosphor-react' 
import { Container, Form, FormError, Header } from './styles'

const registerFormSchema = zod.object({
    username: zod.string()
        .min(3, { message: 'O usuário precisa ter pelo menos três letras.' })
        .regex(/^([\a-z\\-]+)$/i, { message: 'O usuário pode ter apenas letras e hifens.'})
        .transform(username => username.toLowerCase()),
    name: zod.string()
        .min(3, { message: 'O usuário precisa ter pelo menos três letras.' })
    
})

type RegisterFormData = zod.infer<typeof registerFormSchema>

export default function Register() {
    const { register, handleSubmit, setValue,
        formState: { errors, isSubmitting} } = useForm<RegisterFormData>({
            resolver: zodResolver(registerFormSchema),
        })
    const router = useRouter()
    
    useEffect(() => {
        if(router.query.username) {
            setValue('username', String(router.query.username))
        }
    }, [router.query?.username, setValue])
    
        
    async function handleRegister(data: RegisterFormData) {
        try {
            await api.post('/users', {
                username: data.username,
                name: data.name
            })
            await router.push('/register/connect-calendar')
        } catch(error) {
            if(error instanceof AxiosError && error?.response?.data?.message) {
                alert(error.response.data.message)
                return
            }
            console.error(error)
        }
    }
    
    return (
        <React.Fragment>
            <Head>
                <title>Cadastro - Ignite Call</title>
            </Head>
            
            <Container>
                <Header>
                    <Heading as="strong">
                        Bem-vindo ao Ignite Call
                    </Heading>
                    <Text>
                        Precisamos de algumas informações para criar seu perfil! Ah, você pode editar essas informações depois.
                    </Text>
                    
                    <MultiStep size={4} currentStep={1} />
                </Header>
                
                <Form as="form" onSubmit={handleSubmit(handleRegister)}>
                    <label>
                        <Text size="sm">
                            Nome de usuário
                        </Text>
                        <TextInput
                            prefix="ignite.com/"
                            placeholder="seu-usuario"
                            crossOrigin=""
                            {...register('username')} />
                            
                        {errors.username && (
                            <FormError size="sm">
                                {errors.username.message}
                            </FormError>
                        )}
                    </label>
                    
                    <label>
                        <Text size="sm">
                            Nome completo
                        </Text>
                        <TextInput 
                            placeholder="Seu nome"
                            crossOrigin=""
                            {...register('name')} />
                            
                        {errors.name && (
                            <FormError size="sm">
                                {errors.name.message}
                            </FormError>
                        )}
                    </label>
                    
                    <Button type="submit" disabled={isSubmitting}>
                        Próximo passo
                        <ArrowRight />
                    </Button>
                </Form>
            </Container>
        </React.Fragment>
    )
}