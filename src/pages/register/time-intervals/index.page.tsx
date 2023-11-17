import React from 'react'
import Head from 'next/head'
import * as zod from 'zod'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import getWeekDays from '@/utils/get-week-days'
import convertTimeStringToMinutes from '@/utils/convert-time-string-to-minutes'
import { api } from '@/lib/axios'
import { useRouter } from 'next/router'

import { Button, Checkbox, Heading, MultiStep, Text, TextInput } from '@ignite-ui/react'

import { IntervalBox, IntervalContainer, IntervalDay, IntervalInputs, IntervalItem } from './styles'
import { Container, FormError, Header } from '../styles'
import { ArrowRight } from 'phosphor-react'

const timeIntervalsFormSchema = zod.object({
    intervals: zod.array(zod.object({
        weekDay: zod.number().min(0).max(6),
        enabled: zod.boolean(),
        startTime: zod.string(),
        endTime: zod.string()
    }))
    .length(7)
    .transform(intervals => intervals.filter(interval => interval.enabled))
    .refine(intervals => intervals.length > 0, {
        message: 'Você precisa selecionar pelo menos um dia da semana'
    })
    .transform(intervals => {
        return intervals.map(interval => {
            return {
                weekDay: interval.weekDay,
                startTimeInMinutes: convertTimeStringToMinutes(interval.startTime),
                endTimeInMinutes: convertTimeStringToMinutes(interval.endTime)
            }
        })
    })
    .refine(intervals => {
        return intervals.every(interval => interval.endTimeInMinutes - 60 >= interval.startTimeInMinutes)
    },{
        message:'O horário de término deve ser pelo menos uma hora distante do início'
    })
})

type TimeIntervalsFormInput = zod.input<typeof timeIntervalsFormSchema>
type TimeIntervalsFormOutput = zod.infer<typeof timeIntervalsFormSchema>

export default function TimeIntervals() {
    const {
        register, handleSubmit, control, watch,
        formState: {
            isSubmitting, errors
        }
    } = useForm<TimeIntervalsFormInput>({
        resolver: zodResolver(timeIntervalsFormSchema),
        defaultValues: {
            intervals: [
                { weekDay: 0, enabled: false, startTime: '08:00', endTime: '18:00' },
                { weekDay: 1, enabled: true, startTime: '08:00', endTime: '18:00' },
                { weekDay: 2, enabled: true, startTime: '08:00', endTime: '18:00' },
                { weekDay: 3, enabled: true, startTime: '08:00', endTime: '18:00' },
                { weekDay: 4, enabled: true, startTime: '08:00', endTime: '18:00' },
                { weekDay: 5, enabled: true, startTime: '08:00', endTime: '18:00' },
                { weekDay: 6, enabled: false, startTime: '08:00', endTime: '18:00' },
            ]
        }
    })
    const { fields } = useFieldArray({
        control,
        name: 'intervals'})
    const weekDays = getWeekDays()
    const intervals= watch('intervals')
    const router = useRouter()
    
    async function handleSetTimeIntervals(data: any) {
        const { intervals } = data as TimeIntervalsFormOutput 
        
        await api.post('/users/time-intervals', { intervals })
        
        await router.push('/register/update-profile')
    }
    
    return (
        <React.Fragment>
            <Head>
                <title>Cadastro - Ignite Call</title>
            </Head>
            
            <Container>
                <Header>
                    <Heading as="strong">
                        Quase lá
                    </Heading>
                    <Text>
                        Defina o intervalo de horários que você está disponível em cada dia da semana.
                    </Text>
                    
                    <MultiStep size={4} currentStep={3} />
                </Header>
                
                <IntervalBox 
                    as="form" 
                    onSubmit={handleSubmit(handleSetTimeIntervals)}>
                    <IntervalContainer>
                        {fields.map((field, index) => {
                            return (
                                <IntervalItem key={field.id}>
                                    <IntervalDay>
                                        <Controller
                                            name={`intervals.${index}.enabled`}
                                            control={control}
                                            render={({field}) => {
                                                return (
                                                    <Checkbox
                                                        onCheckedChange={checked => {
                                                            field.onChange(checked === true)}}
                                                        checked={field.value} />
                                                )
                                            }} />
                                        <Text>{weekDays[field.weekDay]}</Text>
                                    </IntervalDay>
                                    
                                    <IntervalInputs>
                                        <TextInput 
                                            size="sm"
                                            type="time"
                                            crossOrigin=""
                                            step={60}
                                            disabled={intervals[index].enabled === false}
                                            {...register(`intervals.${index}.startTime`)} />
                                        <TextInput 
                                            size="sm"
                                            type="time"
                                            crossOrigin=""
                                            step={60}
                                            disabled={intervals[index].enabled === false}
                                            {...register(`intervals.${index}.endTime`)} />
                                    </IntervalInputs>
                                </IntervalItem>
                            )
                        })}
                    </IntervalContainer>
                    
                    {errors.intervals && (
                        <FormError size="sm">
                            {errors.intervals.message}
                        </FormError>
                    )}
                    
                    {/* ERROS NÃO ESTÃO APARECENDO!!! */}
                    
                    <Button 
                        type="submit" 
                        disabled={isSubmitting}>
                        Próximo Passo
                        <ArrowRight />
                    </Button>
                </IntervalBox>
            </Container>
        </React.Fragment>
    )
}