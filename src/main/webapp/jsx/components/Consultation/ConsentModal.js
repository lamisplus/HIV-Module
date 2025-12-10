import React, { useState, useRef, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    LinearProgress,
    IconButton,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
    Close as CloseIcon,
    CheckCircle as CheckCircleIcon,
    Info as InfoIcon,
} from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
    dialogPaper: {
        maxWidth: '700px',
        maxHeight: '80vh',
    },
    dialogTitle: {
        backgroundColor: theme.palette.primary.main,
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: theme.spacing(2, 3),
    },
    dialogContent: {
        padding: theme.spacing(3),
        position: 'relative',
    },
    scrollContainer: {
        maxHeight: '400px',
        overflowY: 'auto',
        padding: theme.spacing(2),
        backgroundColor: theme.palette.grey[50],
        borderRadius: theme.shape.borderRadius,
        border: `1px solid ${theme.palette.grey[300]}`,
        '&::-webkit-scrollbar': {
            width: '8px',
        },
        '&::-webkit-scrollbar-track': {
            backgroundColor: theme.palette.grey[200],
            borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: theme.palette.primary.main,
            borderRadius: '4px',
            '&:hover': {
                backgroundColor: theme.palette.primary.dark,
            },
        },
    },
    sectionTitle: {
        fontWeight: 700,
        color: theme.palette.primary.main,
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(1),
    },
    paragraph: {
        marginBottom: theme.spacing(2),
        lineHeight: 1.7,
        color: theme.palette.text.primary,
    },
    bulletList: {
        marginLeft: theme.spacing(3),
        marginBottom: theme.spacing(2),
        '& li': {
            marginBottom: theme.spacing(1),
            lineHeight: 1.6,
        },
    },
    progressContainer: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(1),
    },
    progressText: {
        fontSize: '0.875rem',
        color: theme.palette.text.secondary,
        marginBottom: theme.spacing(1),
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(1),
    },
    scrollPrompt: {
        backgroundColor: theme.palette.info.light,
        color: theme.palette.info.contrastText,
        padding: theme.spacing(1.5),
        borderRadius: theme.shape.borderRadius,
        marginTop: theme.spacing(2),
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(1),
        fontWeight: 500,
    },
    agreeButton: {
        backgroundColor: theme.palette.success.main,
        color: 'white',
        padding: theme.spacing(1, 3),
        fontWeight: 600,
        '&:hover': {
            backgroundColor: theme.palette.success.dark,
        },
        '&:disabled': {
            backgroundColor: theme.palette.grey[300],
            color: theme.palette.grey[500],
        },
    },
    cancelButton: {
        color: theme.palette.text.secondary,
    },
}));

const ConsentModal = ({ open, onClose, onAgree }) => {
    const classes = useStyles();
    const scrollContainerRef = useRef(null);
    const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        // Reset state when modal opens
        if (open) {
            setHasScrolledToBottom(false);
            setScrollProgress(0);
        }
    }, [open]);

    const handleScroll = () => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const { scrollTop, scrollHeight, clientHeight } = container;
        const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100;
        
        setScrollProgress(Math.min(scrollPercentage, 100));

        // Check if scrolled to bottom (with 10px tolerance)
        if (scrollTop + clientHeight >= scrollHeight - 10) {
            setHasScrolledToBottom(true);
        }
    };

    const handleAgree = () => {
        if (hasScrolledToBottom) {
            onAgree();
            onClose();
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            classes={{ paper: classes.dialogPaper }}
            maxWidth="md"
        >
            <DialogTitle className={classes.dialogTitle} disableTypography>
                <Typography variant="h6" style={{ fontWeight: 700, color: "white" }}>
                    Clinician Consent Form for Voice-to-Text Recording
                </Typography>
                <IconButton
                    onClick={onClose}
                    size="small"
                    style={{ color: 'white' }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent className={classes.dialogContent}>
                <div
                    ref={scrollContainerRef}
                    className={classes.scrollContainer}
                    onScroll={handleScroll}
                >
                    {/* Purpose Section */}
                    <Typography variant="h6" className={classes.sectionTitle}>
                        Purpose of Consent
                    </Typography>
                    <Typography className={classes.paragraph}>
                        This form seeks your consent to record and store your spoken clinical notes 
                        and their transcriptions during the pilot phase of our voice-to-text functionality. 
                        These recordings will help us evaluate transcription accuracy and may be used to 
                        improve the model's ability to recognize medical terminology.
                    </Typography>

                    {/* What You're Agreeing To Section */}
                    <Typography variant="h6" className={classes.sectionTitle}>
                        What You're Agreeing To
                    </Typography>

                    <Typography variant="subtitle1" style={{ fontWeight: 600, marginTop: 16 }}>
                        Recording and Storage
                    </Typography>
                    <ul className={classes.bulletList}>
                        <li>Your spoken clinical notes will be recorded and securely stored.</li>
                        <li>Transcriptions generated by the voice-to-text system will also be stored.</li>
                    </ul>

                    <Typography variant="subtitle1" style={{ fontWeight: 600, marginTop: 16 }}>
                        Use of Data
                    </Typography>
                    <ul className={classes.bulletList}>
                        <li>Recordings and transcriptions may be reviewed to assess system performance.</li>
                        <li>With your consent, recordings may be used to fine-tune the transcription model 
                            to better recognize clinical language and terminology.</li>
                    </ul>

                    <Typography variant="subtitle1" style={{ fontWeight: 600, marginTop: 16 }}>
                        Privacy and Security
                    </Typography>
                    <ul className={classes.bulletList}>
                        <li>All recordings will be stored securely and accessed only by authorized personnel.</li>
                        <li>No patient-identifiable information will be linked to your recordings.</li>
                        <li>Any use of recordings for model training will follow strict de-identification protocols.</li>
                    </ul>

                    <Typography variant="subtitle1" style={{ fontWeight: 600, marginTop: 16 }}>
                        Voluntary Participation
                    </Typography>
                    <ul className={classes.bulletList}>
                        <li>Participation is entirely voluntary.</li>
                        <li>You may withdraw your consent at any time by notifying the project team in writing.</li>
                        <li>Withdrawal will not affect your access to other tools or systems.</li>
                    </ul>

                    {/* Consent Options Section */}
                    <Typography variant="h6" className={classes.sectionTitle}>
                        Consent Options
                    </Typography>
                    <Typography className={classes.paragraph}>
                        By clicking "I Agree" below, you acknowledge that you have read and understood 
                        this consent form and agree to participate in the voice-to-text clinical note 
                        recording pilot program under the terms described above.
                    </Typography>

                    <Box style={{ height: 20 }} /> {/* Spacer to ensure scroll to bottom */}
                </div>

                {/* Progress Indicator */}
                <div className={classes.progressContainer}>
                    <Typography className={classes.progressText}>
                        <InfoIcon fontSize="small" />
                        {hasScrolledToBottom 
                            ? 'You have read the entire consent form' 
                            : 'Please scroll to read the entire consent form'}
                    </Typography>
                    <LinearProgress 
                        variant="determinate" 
                        value={scrollProgress}
                        color={hasScrolledToBottom ? 'primary' : 'secondary'}
                    />
                </div>

                {!hasScrolledToBottom && (
                    <Box className={classes.scrollPrompt}>
                        <InfoIcon fontSize="small" />
                        <Typography variant="body2">
                            Scroll down to continue
                        </Typography>
                    </Box>
                )}
            </DialogContent>

            <DialogActions style={{ padding: '16px 24px' }}>
                <Button
                    onClick={onClose}
                    className={classes.cancelButton}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleAgree}
                    disabled={!hasScrolledToBottom}
                    className={classes.agreeButton}
                    startIcon={hasScrolledToBottom ? <CheckCircleIcon /> : null}
                    variant="contained"
                >
                    {hasScrolledToBottom ? 'I Agree' : 'Scroll to Continue'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConsentModal;