import { Box, Text, styled } from '@ignite-ui/react'

export const Container = styled(Box, {
    position: 'relative',
    margin: '$6 auto 0',
    padding: 0,
    maxWidth: '100%',
    
    display: 'grid',
    
    variants: {
        isTimePickerOpen: {
            true: {
                gridTemplateColumns: '1fr 280px',
                
                '@media(max-width: 900px)': {
                    gridTemplateColumns: '1fr',
                }
            },
            false: {
                gridTemplateColumns: '1fr',
                width: 540,
            },
        }
    }
})

export const TimePicker = styled('div', {
    padding: '$6 $6 0',
    borderLeft: '1px solid $gray600',
    overflowY: 'scroll',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    width: 280
})

export const TimePickerHeader = styled(Text, {
    fontWeight: '$medium',
    
    span: {
        color: '$gray200'
    }
})

export const TimePickerList = styled('div', {
    marginTop: '$3',
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '$2',
    
    '@media(max-width: 900px)': {
        gridTemplateColumns: '2fr'
    }
})

export const TimePickerItem = styled('button', {
    border: 0,
    backgroundColor: '$gray600',
    padding: '$2 0',
    
    cursor: 'pointer',
    color: '$gray100',
    fontSize: '$sm',
    lineHeight: '$base',
    
    borderRadius: '$sm',
    
    '&:last-child': {
        marginBottom: '$6'
    },
    
    '&:disabled': {
        background: 'none',
        cursor: 'not-allowed',
        opacity: 0.4
    },
    
    '&:not(:disabled):hover': {
        background: '$gray500',    
    },
    
    '&:focus': {
        boxShadow: '0px 0px 0px 2px $colors$gray100'
    }
})