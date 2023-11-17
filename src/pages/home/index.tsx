import React from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { Heading, Text } from '@ignite-ui/react'

import ClaimUsernameForm from './components/ClaimUsernameForm'

import bgCalenderImg from '/public/bg-calendar.png'
import { Container, Hero, Preview } from './styles'

export default function Home() {
    return (
        <React.Fragment>
            <Head>
                <title>Ignite Call</title>
            </Head>
            
            <Container>
                <Hero>
                    <Heading as="h1" size="4xl">
                        Agendamento descomplicado
                    </Heading>
                    <Text size="xl"> 
                        Conecte seu calendário e permita que as pessoas marquem agendamentos no seu tempo livre.
                    </Text>
                    
                    <ClaimUsernameForm />
                </Hero>
                
                <Preview>
                    <Image
                        src={bgCalenderImg} alt="Calendário simbolizando aplicação em funcionamento"
                        width={700} height={400} 
                        quality={100} priority />
                </Preview>
            </Container>
        </React.Fragment>
    )
}