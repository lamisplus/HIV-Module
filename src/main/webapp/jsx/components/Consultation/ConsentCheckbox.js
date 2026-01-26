import React, { useState } from 'react';
import {
    Box,
    Typography,
    FormControlLabel,
    Checkbox,
    Button,
    Chip,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
    Info as InfoIcon,
    CheckCircle as CheckCircleIcon,
    Description as DescriptionIcon,
} from '@material-ui/icons';
import ConsentModal from './ConsentModal';
import moment from 'moment';

const useStyles = makeStyles((theme) => ({
    container: {
        backgroundColor: 'transparent',
        border: `1px solid ${theme.palette.grey[300]}`,
        borderRadius: theme.shape.borderRadius * 2,
        padding: theme.spacing(2),
        transition: 'all 0.3s ease',
    },
    containerActive: {
        borderColor: theme.palette.success.main,
        backgroundColor: theme.palette.success.light + '10',
    },
    readConsentButton: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
        textTransform: 'none',
        fontWeight: 600,
        color: theme.palette.primary.main,
        '&:hover': {
            backgroundColor: theme.palette.primary.light + '20',
        },
    },
    consentLabel: {
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing(0.5),
    },
    consentTitle: {
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(1),
    },
    consentDescription: {
        fontSize: '0.875rem',
        color: theme.palette.text.secondary,
        marginTop: theme.spacing(0.5),
    },
    acknowledgedChip: {
        marginTop: theme.spacing(1),
        backgroundColor: theme.palette.success.light,
        color: theme.palette.success.dark,
        fontWeight: 500,
    },
    warningBox: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: theme.spacing(1),
        padding: theme.spacing(1.5),
        backgroundColor: theme.palette.warning.light + '20',
        borderRadius: theme.shape.borderRadius,
        marginTop: theme.spacing(1),
        border: `1px solid ${theme.palette.warning.light}`,
    },
    warningText: {
        fontSize: '0.875rem',
        color: theme.palette.warning.dark,
        fontWeight: 500,
    },
}));

const ConsentCheckbox = ({ 
    hasConsent, 
    setHasConsent, 
    disabled = false 
}) => {
    const classes = useStyles();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [consentTimestamp, setConsentTimestamp] = useState(null);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleAgree = () => {
        setHasConsent(true);
        setConsentTimestamp(new Date());
    };

    const handleCheckboxChange = (e) => {
        // Prevent direct checkbox toggling - must go through modal
        e.preventDefault();
        if (!hasConsent) {
            handleOpenModal();
        }
    };

    return (
        <>
            <Box 
                className={`${classes.container} ${hasConsent ? classes.containerActive : ''}`}
            >
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={hasConsent}
                            onChange={handleCheckboxChange}
                            color="primary"
                            disabled={disabled}
                            icon={<InfoIcon />}
                            checkedIcon={<CheckCircleIcon />}
                        />
                    }
                    label={
                        <Box className={classes.consentLabel}>
                            <Typography variant="body2" className={classes.consentTitle}>
                                {hasConsent ? (
                                    <>
                                        <CheckCircleIcon 
                                            fontSize="small" 
                                            style={{ color: '#4BB543' }} 
                                        />
                                        Patient consent obtained and acknowledged
                                    </>
                                ) : (
                                    <>
                                        <InfoIcon 
                                            fontSize="small" 
                                            color="primary" 
                                        />
                                        Patient consent obtained
                                    </>
                                )}
                            </Typography>
                            <Typography variant="caption" className={classes.consentDescription}>
                                {hasConsent 
                                    ? 'You have confirmed that the patient has agreed to be recorded and their session may be transcribed.'
                                    : 'Please read and acknowledge the consent form to confirm the patient has agreed to recording.'
                                }
                            </Typography>
                        </Box>
                    }
                />

                {!hasConsent && (
                    <>
                        <Button
                            variant="outlined"
                            color="primary"
                            size="small"
                            startIcon={<DescriptionIcon />}
                            onClick={handleOpenModal}
                            className={classes.readConsentButton}
                            fullWidth
                        >
                            Read Consent Form to Continue
                        </Button>
                        
                        <Box className={classes.warningBox}>
                            <InfoIcon fontSize="small" style={{ color: '#ED6C02' }} />
                            <Typography className={classes.warningText}>
                                You must read the complete consent form before recording can begin.
                            </Typography>
                        </Box>
                    </>
                )}

                {hasConsent && consentTimestamp && (
                    <Chip
                        size="small"
                        icon={<CheckCircleIcon fontSize="small" />}
                        label={`Consent acknowledged on ${moment(consentTimestamp).format('MMM DD, YYYY [at] h:mm A')}`}
                        className={classes.acknowledgedChip}
                    />
                )}
            </Box>

            <ConsentModal
                open={isModalOpen}
                onClose={handleCloseModal}
                onAgree={handleAgree}
            />
        </>
    );
};

export default ConsentCheckbox;