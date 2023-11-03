interface Appointment {
    title: string;
    trainer: string;
    date: Date;
    hour: string;
    minute: string;
    number?: number;
    severity? : Severity;
    error?: string;
    status?: Status;
}

export const enum Severity {
    danger = 'danger',
    warning = 'warning',
    info = 'info',
    success = 'success'
}

export const enum Status {
    finished = 'Finished',
    ongoing = 'Ongoing',
    upcoming = 'Upcoming',
}


export default Appointment;