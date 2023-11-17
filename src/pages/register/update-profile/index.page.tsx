import React from 'react'
import Head from 'next/head'
import { Avatar, Button, Heading, MultiStep, Text, TextArea } from '@ignite-ui/react'
import { useForm } from 'react-hook-form'
import * as zod from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSession } from 'next-auth/react'
import { GetServerSideProps } from 'next'
import { getServerSession } from 'next-auth'
import { buildNextAuthOptions } from '@/pages/api/auth/[...nextauth].api'
import { api } from '@/lib/axios'
import { useRouter } from 'next/router'

import { ArrowRight } from 'phosphor-react' 
import { Container, Header } from '../styles'
import { FormAnnotation, ProfileBox } from './styles'

const updateProfileSchema = zod.object({
    bio: zod.string()
})

type UpdateProfileData = zod.infer<typeof updateProfileSchema>

export default function UpdateProfile() {
    const { register, handleSubmit,
        formState: { isSubmitting} } = useForm<UpdateProfileData>({
            resolver: zodResolver(updateProfileSchema),
        })
    const session = useSession()
    const router = useRouter()
        
    async function handleUpdateProfile(data: UpdateProfileData) {
        await api.put('/users/profile', {
            bio: data.bio
        })
        
        await router.push(`/schedule/${session.data?.user.name}`)
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
                    
                    <MultiStep size={4} currentStep={4} />
                </Header>
                
                <ProfileBox as="form" onSubmit={handleSubmit(handleUpdateProfile)}>
                    <label>
                        <Text size="sm">
                            Foto de Perfil
                        </Text>
                        <Avatar 
                            src={session.data?.user.avatar_url} 
                            alt={session.data?.user.name} />
                    </label>
                    
                    <label>
                        <Text size="sm">
                            Sobre você
                        </Text>
                        <TextArea 
                            placeholder="Seu nome"
                            {...register('bio')} />
                        <FormAnnotation size="sm">
                            Fale um poucosobre você. Isto será exibido em sua página pessoal
                        </FormAnnotation>
                    </label>
                    
                    <Button type="submit" disabled={isSubmitting}>
                        Finalizar passo
                        <ArrowRight />
                    </Button>
                </ProfileBox>
            </Container>
        </React.Fragment>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    const session = await getServerSession(req, res, buildNextAuthOptions(req, res))
    
    return {
        props: {
            session
        }
    }
}